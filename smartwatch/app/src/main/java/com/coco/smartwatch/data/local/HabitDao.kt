package com.coco.smartwatch.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao interface HabitDao {
    @Query("SELECT * FROM habit_records ORDER BY recordedAt DESC") fun observeAll(): Flow<List<HabitEntity>>
    @Insert suspend fun insert(entity: HabitEntity): Long
    @Query("DELETE FROM habit_records WHERE id = :id") suspend fun delete(id: Long)
    @Query("SELECT COUNT(*) FROM habit_records WHERE syncPending = 1") suspend fun pendingCount(): Int
}
