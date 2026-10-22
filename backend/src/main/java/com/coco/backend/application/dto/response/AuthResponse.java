package com.coco.backend.application.dto.response;

import java.util.UUID;

public record AuthResponse(String token, UserResponse user) {
    public record UserResponse(UUID id, String email, String displayName) {}
}
