package com.coco.backend.application.dto.response;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO de respuesta para datos de un conejo.
 */
public class RabbitResponse {

    private UUID id;
    private String name;
    private boolean active;
    private Instant createdAt;

    public RabbitResponse() {}

    public RabbitResponse(UUID id, String name, boolean active, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
