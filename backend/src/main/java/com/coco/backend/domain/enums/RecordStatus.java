package com.coco.backend.domain.enums;

/**
 * Estado del registro de hábito en el ciclo de sincronización.
 */
public enum RecordStatus {
    PENDING,    // Pendiente de procesar
    SYNCED,     // Sincronizado correctamente
    FAILED,     // Falló el procesamiento
    DUPLICATE   // Detectado como duplicado (ya existía)
}
