package com.coco.backend.infrastructure.adapter.output.persistence.entity;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidad JPA para la tabla 'habit_records'.
 * client_record_id tiene restricción UNIQUE para garantizar idempotencia en sync.
 */
@Entity
@Table(name = "habit_records", indexes = {
    @Index(name = "idx_habit_records_rabbit_id", columnList = "rabbit_id"),
    @Index(name = "idx_habit_records_habit_type", columnList = "habit_type"),
    @Index(name = "idx_habit_records_recorded_at", columnList = "recorded_at"),
    @Index(name = "idx_habit_records_rabbit_type_date", columnList = "rabbit_id, habit_type, recorded_at")
})
public class HabitRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    /**
     * UUID generado en el cliente (smartwatch).
     * Restricción UNIQUE garantiza idempotencia en sincronización.
     */
    @Column(name = "client_record_id", nullable = false, unique = true, length = 100)
    private String clientRecordId;

    @Column(name = "rabbit_id", nullable = false)
    private UUID rabbitId;

    @Enumerated(EnumType.STRING)
    @Column(name = "habit_type", nullable = false, length = 20)
    private HabitType habitType;

    @Column(name = "value")
    private Double value;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    @Column(name = "source", length = 20)
    private String source;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RecordStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    protected HabitRecordEntity() {}

    public HabitRecordEntity(UUID id, String clientRecordId, UUID rabbitId, HabitType habitType,
                              Double value, String note, Instant recordedAt, String source,
                              RecordStatus status, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.clientRecordId = clientRecordId;
        this.rabbitId = rabbitId;
        this.habitType = habitType;
        this.value = value;
        this.note = note;
        this.recordedAt = recordedAt;
        this.source = source;
        this.status = status;
        this.createdAt = createdAt;
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
