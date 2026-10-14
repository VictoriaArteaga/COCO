package com.coco.smartwatch.data.repository

import com.coco.smartwatch.data.local.HabitDao
import com.coco.smartwatch.data.local.HabitEntity
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.repository.HabitRepository
import kotlinx.coroutines.flow.map

class HabitRepositoryImpl(private val dao: HabitDao) : HabitRepository {
    override fun observeRecords() = dao.observeAll().map { rows -> rows.map(HabitEntity::toDomain) }
    override suspend fun add(record: HabitRecord) = dao.insert(HabitEntity.from(record))
    override suspend fun undo(id: Long) = dao.delete(id)
    override suspend fun pendingCount() = dao.pendingCount()
}
