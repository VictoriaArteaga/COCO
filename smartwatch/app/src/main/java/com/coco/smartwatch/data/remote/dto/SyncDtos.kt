package com.coco.smartwatch.data.remote.dto

import com.coco.smartwatch.domain.model.HabitType

/**
 * DTOs para comunicación con el backend COCO.
 * Deben mantenerse consistentes con los DTOs del backend Java.
 */

data class SyncHabitDto(
    val clientRecordId: String,
    val rabbitId: String,
    val habitType: String,
    val value: Double?,
    val note: String?,
    /** Epoch millis del registro original en el cliente */
    val recordedAt: String
)

data class SyncBatchDto(
    val records: List<SyncHabitDto>
)

data class SyncResultDto(
    val synced: List<String>,
    val duplicates: List<String>,
    val failed: List<String>
)

/** Convierte un HabitType del dominio al string del backend */
fun HabitType.toApiName(): String = this.name
