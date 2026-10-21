package com.coco.backend.application.dto.request;

import com.coco.backend.domain.enums.HabitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO de un registro individual dentro de un lote de sincronización desde el smartwatch.
 */
public class SyncHabitRequest {

    @NotBlank(message = "clientRecordId es requerido")
    private String clientRecordId;

    @NotNull(message = "rabbitId es requerido")
    private UUID rabbitId;

    @NotNull(message = "habitType es requerido")
    private HabitType habitType;

    private Double value;
    private String note;

    @NotNull(message = "recordedAt es requerido")
    private Instant recordedAt;

    public SyncHabitRequest() {}

    public String getClientRecordId() { return clientRecordId; }
    public void setClientRecordId(String clientRecordId) { this.clientRecordId = clientRecordId; }

    public UUID getRabbitId() { return rabbitId; }
    public void setRabbitId(UUID rabbitId) { this.rabbitId = rabbitId; }

    public HabitType getHabitType() { return habitType; }
    public void setHabitType(HabitType habitType) { this.habitType = habitType; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}
