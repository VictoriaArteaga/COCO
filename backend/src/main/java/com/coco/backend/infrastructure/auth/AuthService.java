package com.coco.backend.infrastructure.auth;

import com.coco.backend.application.dto.request.LoginRequest;
import com.coco.backend.application.dto.request.RegisterRequest;
import com.coco.backend.application.dto.response.AuthResponse;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.UserEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.UserJpaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {
    private final UserJpaRepository users;
    private final PasswordEncoder passwords;
    private final JwtEncoder jwtEncoder;
    private final long expirationSeconds;

    public AuthService(UserJpaRepository users, PasswordEncoder passwords, JwtEncoder jwtEncoder,
                       @org.springframework.beans.factory.annotation.Value("${coco.jwt.expiration-seconds:3600}") long expirationSeconds) {
        this.users = users; this.passwords = passwords; this.jwtEncoder = jwtEncoder;
        if (expirationSeconds < 60 || expirationSeconds > 86400) throw new IllegalArgumentException("JWT expiration must be between 60 and 86400 seconds");
        this.expirationSeconds = expirationSeconds;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        UserEntity user = new UserEntity(UUID.randomUUID(), email, request.displayName().trim(), passwords.encode(request.password()), true, Instant.now());
        try { user = users.saveAndFlush(user); }
        catch (DataIntegrityViolationException e) { throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado"); }
        return issue(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        UserEntity user = users.findByEmail(email).orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        if (!user.isActive() || !passwords.matches(request.password(), user.getPasswordHash())) throw new BadCredentialsException("Credenciales inválidas");
        return issue(user);
    }

    public AuthResponse.UserResponse currentUser(UUID userId) {
        UserEntity user = users.findById(userId).filter(UserEntity::isActive)
                .orElseThrow(() -> new BadCredentialsException("Sesión no válida"));
        return new AuthResponse.UserResponse(user.getId(), user.getEmail(), user.getDisplayName());
    }

    private AuthResponse issue(UserEntity user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer("coco").issuedAt(now).expiresAt(now.plusSeconds(expirationSeconds)).subject(user.getId().toString()).claim("email", user.getEmail()).build();
        return new AuthResponse(jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue(),
                new AuthResponse.UserResponse(user.getId(), user.getEmail(), user.getDisplayName()));
    }
}
