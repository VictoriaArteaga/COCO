package com.coco.smartwatch.domain.model

data class HabitRecord(val id: Long = 0, val type: HabitType, val value: Double?, val note: String?, val recordedAt: Long, val syncPending: Boolean = true)
