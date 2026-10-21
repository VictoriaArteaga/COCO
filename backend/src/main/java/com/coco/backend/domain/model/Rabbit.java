package com.coco.backend.domain.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Modelo de dominio que representa un conejo registrado en COCO.
 * No contiene anotaciones de persistencia (eso va en la capa de infraestructura).
 */
public class Rabbit {

    private final UUID id;
    private final String name;
    private final UUID userId;
    private final boolean active;
    private final Instant createdAt;

    public Rabbit(UUID id, String name, UUID userId, boolean active, Instant createdAt) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("El nombre del conejo no puede estar vacío");
        }
        if (userId == null) {
            throw new IllegalArgumentException("El conejo debe tener un usuario asociado");
        }
        this.id = id;
        this.name = name.trim();
        this.userId = userId;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public UUID getUserId() { return userId; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }

    public Rabbit withActive(boolean newActive) {
        return new Rabbit(this.id, this.name, this.userId, newActive, this.createdAt);
    }
}
