package com.coco.backend.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * DTO para enviar un lote de registros pendientes desde el smartwatch.
 * Máximo 100 registros por lote para evitar sobrecarga.
 */
public class SyncBatchRequest {

    @NotEmpty(message = "El lote no puede estar vacío")
    @Size(max = 100, message = "El lote no puede contener más de 100 registros")
    @Valid
    private List<SyncHabitRequest> records;

    public SyncBatchRequest() {}

    public SyncBatchRequest(List<SyncHabitRequest> records) {
        this.records = records;
    }

    public List<SyncHabitRequest> getRecords() { return records; }
    public void setRecords(List<SyncHabitRequest> records) { this.records = records; }
}
