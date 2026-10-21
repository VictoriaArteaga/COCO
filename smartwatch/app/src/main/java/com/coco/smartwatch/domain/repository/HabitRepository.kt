package com.coco.smartwatch.domain.repository

import com.coco.smartwatch.data.sync.SyncState
import com.coco.smartwatch.domain.model.HabitRecord
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow

/**
 * Contrato del repositorio de hábitos.
 * Define las operaciones disponibles para el dominio y la presentación.
 */
interface HabitRepository {
    fun observeRecords(): Flow<List<HabitRecord>>
    suspend fun add(record: HabitRecord): Long
    suspend fun undo(id: Long)
    suspend fun pendingCount(): Int

    /** Estado actual del ciclo de sincronización */
    val syncState: StateFlow<SyncState>

    /** Inicia un ciclo de sincronización con el backend */
    suspend fun sync()

    /** Requeues records that exhausted their automatic retries. */
    suspend fun retryExhaustedRecords()
}
