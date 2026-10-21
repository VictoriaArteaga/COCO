package com.coco.backend.application.dto.request;

import com.coco.backend.domain.enums.HabitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO para registrar un hábito individual (uso directo desde web).
 */
public class CreateHabitRequest {

    @NotBlank(message = "clientRecordId es requerido")
    private String clientRecordId;

    @NotNull(message = "rabbitId es requerido")
    private UUID rabbitId;

    @NotNull(message = "habitType es requerido")
    private HabitType habitType;

    private Double value;
    private String note;

    @NotNull(message = "recordedAt es requerido")
    @PastOrPresent(message = "recordedAt no puede ser una fecha futura")
    private Instant recordedAt;

    private String source;

    public CreateHabitRequest() {}

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

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
