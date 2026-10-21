package com.coco.smartwatch.data.local

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.model.SyncStatus

/**
 * Room entity for habit records.
 *
 * clientRecordId has a unique index to prevent duplicate local insertions.
 * The @ColumnInfo(defaultValue) annotations are required for Room AutoMigration (1→2)
 * so that existing rows in version 1 databases receive a valid default value
 * when the migration runs.
 */
@Entity(
    tableName = "habit_records",
    indices = [Index(value = ["clientRecordId"], unique = true)]
)
data class HabitEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,

    val type: String,
    val value: Double?,
    val note: String?,
    val recordedAt: Long,

    /**
     * Client-generated UUID for backend idempotency.
     * Default value for AutoMigration: a placeholder that makes the row re-syncable.
     */
    @ColumnInfo(defaultValue = "legacy-" + "0")
    val clientRecordId: String = java.util.UUID.randomUUID().toString(),

    /**
     * Sync lifecycle state. Default "PENDING" so migrated rows are queued for sync.
     */
    @ColumnInfo(defaultValue = "PENDING")
    val syncStatus: String = SyncStatus.PENDING.name,

    /** Number of failed sync retries. Default 0. */
    @ColumnInfo(defaultValue = "0")
    val retryCount: Int = 0,
) {
    /** Convert to domain model. */
    fun toDomain() = HabitRecord(
        id = id,
        type = HabitType.fromName(type),
        value = value,
        note = note,
        recordedAt = recordedAt,
        clientRecordId = clientRecordId,
        syncStatus = SyncStatus.valueOf(syncStatus),
    )

    companion object {
        /** Create entity from domain model. retryCount always starts at 0 for new records. */
        fun from(record: HabitRecord) = HabitEntity(
            id = record.id,
            type = record.type.name,
            value = record.value,
            note = record.note,
            recordedAt = record.recordedAt,
            clientRecordId = record.clientRecordId,
            syncStatus = record.syncStatus.name,
            retryCount = 0,
        )
    }
}
