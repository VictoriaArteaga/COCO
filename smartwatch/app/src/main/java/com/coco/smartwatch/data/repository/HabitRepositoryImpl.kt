package com.coco.smartwatch.data.repository

import com.coco.smartwatch.data.local.HabitDao
import com.coco.smartwatch.data.local.HabitEntity
import com.coco.smartwatch.data.sync.SyncManager
import com.coco.smartwatch.data.sync.SyncState
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.repository.HabitRepository
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map

/**
 * Implementación del repositorio de hábitos.
 * Conecta Room (local) con SyncManager (remoto).
 * El ViewModel interactúa únicamente con esta interfaz.
 */
class HabitRepositoryImpl(
    private val dao: HabitDao,
    private val syncManager: SyncManager
) : HabitRepository {

    override fun observeRecords() =
        dao.observeAll().map { rows -> rows.map(HabitEntity::toDomain) }

    override suspend fun add(record: HabitRecord) =
        dao.insert(HabitEntity.from(record))

    override suspend fun undo(id: Long) = dao.delete(id)

    override suspend fun pendingCount() = dao.pendingCount()

    override val syncState: StateFlow<SyncState> = syncManager.syncState

    override suspend fun sync() = syncManager.sync()

    override suspend fun retryExhaustedRecords() = dao.resetExhaustedRetries()
}
