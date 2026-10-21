package com.coco.backend.domain.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Modelo de dominio para el usuario de COCO.
 * La contraseña nunca se expone en este modelo de dominio.
 */
public class User {

    private final UUID id;
    private final String email;
    private final String displayName;
    private final boolean active;
    private final Instant createdAt;

    public User(UUID id, String email, String displayName, boolean active, Instant createdAt) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El email es requerido");
        }
        this.id = id;
        this.email = email.toLowerCase().trim();
        this.displayName = displayName;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
}
