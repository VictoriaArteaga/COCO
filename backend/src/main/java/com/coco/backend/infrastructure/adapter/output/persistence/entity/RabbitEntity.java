package com.coco.backend.infrastructure.adapter.output.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidad JPA para la tabla 'rabbits'.
 */
@Entity
@Table(name = "rabbits", indexes = {
    @Index(name = "idx_rabbits_user_id", columnList = "user_id"),
    @Index(name = "idx_rabbits_active", columnList = "active")
})
public class RabbitEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected RabbitEntity() {}

    public RabbitEntity(UUID id, String name, UUID userId, boolean active, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.active = active;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getUserId() { return userId; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Instant getCreatedAt() { return createdAt; }
}
