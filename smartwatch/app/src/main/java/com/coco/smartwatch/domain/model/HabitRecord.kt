package com.coco.smartwatch.domain.model

data class HabitRecord(
    val id: Long = 0,
    val type: HabitType,
    val value: Double?,
    val note: String?,
    val recordedAt: Long,
    /** UUID generado en el cliente para idempotencia en sincronización */
    val clientRecordId: String = java.util.UUID.randomUUID().toString(),
    val syncStatus: SyncStatus = SyncStatus.PENDING
)
