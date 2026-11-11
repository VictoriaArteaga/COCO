package com.coco.smartwatch.data.remote.dto

/** Página de registros que devuelve GET /api/habits. */
data class HabitPageDto(val content: List<HabitRecordDto> = emptyList(), val last: Boolean = true)

data class HabitRecordDto(
    val clientRecordId: String,
    val rabbitId: String,
    val habitType: String,
    val value: Double? = null,
    val note: String? = null,
    val recordedAt: String,
)
