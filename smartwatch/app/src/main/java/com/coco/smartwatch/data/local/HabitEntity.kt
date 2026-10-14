package com.coco.smartwatch.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType

@Entity(tableName = "habit_records")
data class HabitEntity(@PrimaryKey(autoGenerate = true) val id: Long = 0, val type: String, val value: Double?, val note: String?, val recordedAt: Long, val syncPending: Boolean = true) {
    fun toDomain() = HabitRecord(id, HabitType.fromName(type), value, note, recordedAt, syncPending)
    companion object { fun from(record: HabitRecord) = HabitEntity(record.id, record.type.name, record.value, record.note, record.recordedAt, true) }
}
