package com.coco.backend.application.dto.response;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO de respuesta para un registro de hábito.
 */
public class HabitRecordResponse {

    private UUID id;
    private String clientRecordId;
    private UUID rabbitId;
    private HabitType habitType;
    private Double value;
    private String note;
    private Instant recordedAt;
    private String source;
    private RecordStatus status;
    private Instant createdAt;

    public HabitRecordResponse() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public RecordStatus getStatus() { return status; }
    public void setStatus(RecordStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
