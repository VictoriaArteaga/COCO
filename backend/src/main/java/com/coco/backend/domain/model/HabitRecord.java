package com.coco.backend.domain.model;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Modelo de dominio que representa un registro de hábito del conejo.
 * El campo clientRecordId es el UUID generado en el cliente (smartwatch)
 * y se usa para prevenir duplicados en la sincronización.
 */
public class HabitRecord {

    private final UUID id;
    /** UUID generado en el cliente para idempotencia en sync */
    private final String clientRecordId;
    private final UUID rabbitId;
    private final HabitType habitType;
    private final Double value;
    private final String note;
    /** Timestamp original del cliente -- NO depender solo del servidor */
    private final Instant recordedAt;
    /** Fuente: WATCH (smartwatch) o WEB */
    private final String source;
    private final RecordStatus status;
    private final Instant createdAt;
    private final Instant updatedAt;

    public HabitRecord(
            UUID id,
            String clientRecordId,
            UUID rabbitId,
            HabitType habitType,
            Double value,
            String note,
            Instant recordedAt,
            String source,
            RecordStatus status,
            Instant createdAt,
            Instant updatedAt
    ) {
        if (rabbitId == null) throw new IllegalArgumentException("rabbitId es requerido");
        if (habitType == null) throw new IllegalArgumentException("habitType es requerido");
        if (recordedAt == null) throw new IllegalArgumentException("recordedAt es requerido");
        if (clientRecordId == null || clientRecordId.isBlank()) {
            throw new IllegalArgumentException("clientRecordId es requerido para idempotencia");
        }

        this.id = id;
        this.clientRecordId = clientRecordId;
        this.rabbitId = rabbitId;
        this.habitType = habitType;
        this.value = value;
        this.note = note;
        this.recordedAt = recordedAt;
        this.source = source != null ? source : "WATCH";
        this.status = status != null ? status : RecordStatus.SYNCED;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public String getClientRecordId() { return clientRecordId; }
    public UUID getRabbitId() { return rabbitId; }
    public HabitType getHabitType() { return habitType; }
    public Double getValue() { return value; }
    public String getNote() { return note; }
    public Instant getRecordedAt() { return recordedAt; }
    public String getSource() { return source; }
    public RecordStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
