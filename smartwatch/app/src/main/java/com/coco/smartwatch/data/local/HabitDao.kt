package com.coco.smartwatch.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

/**
 * DAO para operaciones sobre habit_records.
 * Incluye consultas necesarias para el ciclo de sincronización.
 */
@Dao
interface HabitDao {

    @Query("SELECT * FROM habit_records ORDER BY recordedAt DESC")
    fun observeAll(): Flow<List<HabitEntity>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(entity: HabitEntity): Long

    @Query("DELETE FROM habit_records WHERE id = :id")
    suspend fun delete(id: Long)

    /** Registros que aún no se han sincronizado (PENDING o FAILED con reintentos disponibles) */
    @Query("""
        SELECT * FROM habit_records
        WHERE syncStatus IN ('PENDING', 'FAILED')
        AND retryCount < 5
        ORDER BY recordedAt ASC
        LIMIT 50
    """)
    suspend fun getPendingRecords(): List<HabitEntity>

    /** Cantidad de registros pendientes (para UI) */
    @Query("SELECT COUNT(*) FROM habit_records WHERE syncStatus IN ('PENDING', 'FAILED')")
    suspend fun pendingCount(): Int

    /** Marca un registro como SYNCING antes de enviarlo */
    @Query("UPDATE habit_records SET syncStatus = 'SYNCING' WHERE id = :id")
    suspend fun markSyncing(id: Long)

    /** Marca un registro como SYNCED tras confirmación del backend */
    @Query("UPDATE habit_records SET syncStatus = 'SYNCED' WHERE clientRecordId = :clientRecordId")
    suspend fun markSynced(clientRecordId: String)

    /** Registra un fallo de sync e incrementa el contador de reintentos */
    @Query("""
        UPDATE habit_records
        SET syncStatus = 'FAILED', retryCount = retryCount + 1
        WHERE id = :id
    """)
    suspend fun markFailed(id: Long)

    /** Allows a user-initiated sync to retry records that exhausted automatic retries. */
    @Query("UPDATE habit_records SET syncStatus = 'PENDING', retryCount = 0 WHERE syncStatus = 'FAILED' AND retryCount >= 5")
    suspend fun resetExhaustedRetries()

    /** Marca todos los SYNCING como FAILED al arrancar (eran sincs interrumpidos) */
    @Query("UPDATE habit_records SET syncStatus = 'FAILED' WHERE syncStatus = 'SYNCING'")
    suspend fun resetInterruptedSyncs()
}
