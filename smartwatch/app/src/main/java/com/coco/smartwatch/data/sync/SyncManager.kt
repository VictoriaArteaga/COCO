package com.coco.smartwatch.data.sync

import com.coco.smartwatch.data.local.HabitDao
import com.coco.smartwatch.data.local.HabitEntity
import com.coco.smartwatch.data.remote.CocoApiService
import com.coco.smartwatch.data.remote.dto.SyncBatchDto
import com.coco.smartwatch.data.remote.dto.SyncHabitDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.Instant

/**
 * Orquesta el envío de registros pendientes al backend.
 *
 * Flujo:
 *   Room (PENDING/FAILED) → SyncManager → REST API → actualiza estado en Room
 *
 * Estrategia de reintentos:
 *   - Máximo 5 reintentos por registro (configurable en MAX_RETRIES)
 *   - Después de MAX_RETRIES el registro permanece en FAILED y no se reintenta
 *     automáticamente (puede reintentarse manualmente o en la próxima sesión)
 *
 * Estrategia de conflictos:
 *   - El backend usa clientRecordId como clave de idempotencia
 *   - Si el backend reporta un registro como 'duplicate', se marca SYNCED localmente
 *     (el primer envío llegó; los duplicados se ignoran sin error)
 *
 * El SyncManager NO hace peticiones HTTP directamente desde Composables ni ViewModel.
 * El ViewModel llama a sync() y observa syncState.
 */
class SyncManager(
    private val dao: HabitDao,
    private val api: CocoApiService,
    private val rabbitId: () -> String?
) {

    companion object {
        const val MAX_RETRIES = 5
        const val BATCH_SIZE = 50
    }

    private val _syncState = MutableStateFlow<SyncState>(SyncState.Idle)
    val syncState: StateFlow<SyncState> = _syncState.asStateFlow()

    /**
     * Ejecuta un ciclo de sincronización:
     * 1. Obtiene registros PENDING/FAILED de Room
     * 2. Los envía al backend en un lote
     * 3. Actualiza el estado en Room según la respuesta
     */
    suspend fun sync() {
        val pending = dao.getPendingRecords()
        if (pending.isEmpty()) {
            _syncState.value = SyncState.Idle
            return
        }

        val selectedRabbitId = rabbitId()
        if (selectedRabbitId == null) {
            _syncState.value = SyncState.Failed("Inicia sesión y selecciona un conejo para sincronizar")
            return
        }

        _syncState.value = SyncState.Syncing(pending.size)

        // Marcar todos como SYNCING antes de enviar
        pending.forEach { dao.markSyncing(it.id) }

        try {
            val batch = SyncBatchDto(
                records = pending.map { it.toSyncDto(selectedRabbitId) }
            )

            val response = api.syncHabits(batch)

            if (response.isSuccessful) {
                val result = response.body()!!

                // Marcar synced y duplicados como SYNCED (ambos están en el backend)
                (result.synced + result.duplicates).forEach { clientId ->
                    dao.markSynced(clientId)
                }

                // Marcar fallados para reintento
                result.failed.forEach { clientId ->
                    pending.find { it.clientRecordId == clientId }
                        ?.let { dao.markFailed(it.id) }
                }

                val remainingPending = dao.pendingCount()
                _syncState.value = if (remainingPending == 0) {
                    SyncState.Synced(result.synced.size)
                } else {
                    SyncState.PartialSync(result.synced.size, remainingPending)
                }

            } else {
                // El servidor respondió con error HTTP
                pending.forEach { dao.markFailed(it.id) }
                _syncState.value = SyncState.Failed(if (response.code() == 401) "Sesión vencida. Inicia sesión de nuevo" else "Error del servidor: ${response.code()}")
            }

        } catch (e: Exception) {
            // Error de red (sin conexión, timeout, etc.)
            pending.forEach { dao.markFailed(it.id) }
            _syncState.value = SyncState.Offline
        }
    }

    /** Reinicia registros SYNCING (pueden quedar así si la app se cerró durante sync) */
    suspend fun resetInterruptedSyncs() {
        dao.resetInterruptedSyncs()
    }
}

/** Convierte HabitEntity a DTO para el backend */
private fun HabitEntity.toSyncDto(rabbitId: String) = SyncHabitDto(
    clientRecordId = clientRecordId,
    rabbitId = rabbitId,
    habitType = type,
    value = value,
    note = note,
    recordedAt = Instant.ofEpochMilli(recordedAt).toString()
)
