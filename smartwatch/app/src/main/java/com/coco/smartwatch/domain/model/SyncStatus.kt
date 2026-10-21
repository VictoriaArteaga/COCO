package com.coco.smartwatch.domain.model

/**
 * Estado de sincronización de un registro con el backend.
 *
 * Flujo normal:  PENDING → SYNCING → SYNCED
 * Flujo error:   PENDING → SYNCING → FAILED → PENDING (reintento)
 * Sin red:       PENDING → OFFLINE (no se intenta sync)
 */
enum class SyncStatus {
    /** Registrado localmente, aún no enviado al backend */
    PENDING,
    /** Siendo enviado al backend en este momento */
    SYNCING,
    /** Confirmado por el backend */
    SYNCED,
    /** El backend devolvió error; se reintentará */
    FAILED,
    /** Sin conexión disponible; se enviará cuando haya red */
    OFFLINE
}
