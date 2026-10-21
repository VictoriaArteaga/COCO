package com.coco.smartwatch.data.sync

/**
 * Estados del ciclo de sincronización.
 * Usado por el ViewModel para actualizar la UI.
 */
sealed class SyncState {
    /** Sin actividad de sync en curso */
    data object Idle : SyncState()

    /** Sync en progreso; count = registros siendo enviados */
    data class Syncing(val count: Int) : SyncState()

    /** Todos los registros sincronizados correctamente */
    data class Synced(val count: Int) : SyncState()

    /** Sync parcial: algunos enviados, otros aún pendientes */
    data class PartialSync(val synced: Int, val remaining: Int) : SyncState()

    /** Error de red: sin conexión disponible */
    data object Offline : SyncState()

    /** Error del backend u otro error */
    data class Failed(val reason: String) : SyncState()
}
