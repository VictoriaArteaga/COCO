package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.request.LoginRequest;
import com.coco.backend.application.dto.request.RegisterRequest;
import com.coco.backend.application.dto.response.AuthResponse;
import com.coco.backend.infrastructure.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }

    @GetMapping("/me")
    public AuthResponse.UserResponse currentUser(Authentication authentication) {
        return authService.currentUser(UUID.fromString(authentication.getName()));
    }
}
