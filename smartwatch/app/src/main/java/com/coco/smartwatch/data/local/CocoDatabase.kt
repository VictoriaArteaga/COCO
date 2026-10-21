package com.coco.smartwatch.data.local

import androidx.room.AutoMigration
import androidx.room.Database
import androidx.room.RoomDatabase

/**
 * COCO Room database.
 *
 * Version history:
 *   1 → Initial schema: id, type, value, note, recordedAt, syncPending
 *   2 → Sync-aware schema: adds clientRecordId, syncStatus, retryCount; removes syncPending
 *
 * AutoMigration 1→2 is handled by Migration1To2Spec which declares the column deletion.
 * New columns (clientRecordId, syncStatus, retryCount) use defaults defined in HabitEntity.
 */
@Database(
    entities = [HabitEntity::class],
    version = 2,
    exportSchema = true,
    autoMigrations = [
        AutoMigration(from = 1, to = 2, spec = Migration1To2Spec::class)
    ]
)
abstract class CocoDatabase : RoomDatabase() {
    abstract fun habitDao(): HabitDao
}
