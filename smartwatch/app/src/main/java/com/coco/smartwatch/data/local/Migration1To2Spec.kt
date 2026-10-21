package com.coco.smartwatch.data.local

import androidx.room.DeleteColumn
import androidx.room.migration.AutoMigrationSpec

/**
 * AutoMigration spec for database version 1 → 2.
 *
 * Changes in version 2:
 *   - REMOVED: syncPending (Boolean) — replaced by syncStatus (String enum)
 *   - ADDED: clientRecordId (TEXT, unique) — UUID generated on the client for idempotency
 *   - ADDED: syncStatus (TEXT) — replaces the removed syncPending flag
 *   - ADDED: retryCount (INTEGER) — tracks how many times a sync was retried
 *
 * Room AutoMigration handles column additions automatically when defaults are
 * specified in the entity. The @DeleteColumn annotation handles the removal.
 */
@DeleteColumn(tableName = "habit_records", columnName = "syncPending")
class Migration1To2Spec : AutoMigrationSpec
