package com.coco.smartwatch.domain.repository

import com.coco.smartwatch.domain.model.HabitRecord
import kotlinx.coroutines.flow.Flow

interface HabitRepository {
    fun observeRecords(): Flow<List<HabitRecord>>
    suspend fun add(record: HabitRecord): Long
    suspend fun undo(id: Long)
    suspend fun pendingCount(): Int
}
