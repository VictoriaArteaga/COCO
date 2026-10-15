package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.request.CreateRabbitRequest;
import com.coco.backend.application.dto.response.RabbitResponse;
import com.coco.backend.application.mapper.DomainDtoMapper;
import com.coco.backend.domain.exception.ResourceNotFoundException;
import com.coco.backend.domain.model.Rabbit;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.mapper.RabbitEntityMapper;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Controller REST para gestión de conejos.
 * Todos los endpoints requieren autenticación (configurada en SecurityConfig).
 */
@RestController
@RequestMapping("/api/rabbits")
public class RabbitController {

    private final RabbitJpaRepository rabbitRepository;
    private final RabbitEntityMapper rabbitEntityMapper;
    private final DomainDtoMapper dtoMapper;

    public RabbitController(
            RabbitJpaRepository rabbitRepository,
            RabbitEntityMapper rabbitEntityMapper,
            DomainDtoMapper dtoMapper
    ) {
        this.rabbitRepository = rabbitRepository;
        this.rabbitEntityMapper = rabbitEntityMapper;
        this.dtoMapper = dtoMapper;
    }

    /**
     * GET /api/rabbits
     * Lista todos los conejos activos del usuario autenticado.
     * Por ahora retorna todos (la autenticación completa es semana 5+).
     */
    @GetMapping
    public ResponseEntity<List<RabbitResponse>> listRabbits() {
        List<RabbitResponse> rabbits = rabbitRepository.findAll()
                .stream()
                .filter(RabbitEntity::isActive)
                .map(rabbitEntityMapper::toDomain)
                .map(dtoMapper::toRabbitResponse)
                .toList();
        return ResponseEntity.ok(rabbits);
    }

    /**
     * GET /api/rabbits/{id}
     * Obtiene un conejo por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RabbitResponse> getRabbit(@PathVariable UUID id) {
        RabbitEntity entity = rabbitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rabbit", id.toString()));
        return ResponseEntity.ok(dtoMapper.toRabbitResponse(rabbitEntityMapper.toDomain(entity)));
    }

    /**
     * POST /api/rabbits
     * Crea un nuevo conejo.
     */
    @PostMapping
    public ResponseEntity<RabbitResponse> createRabbit(@Valid @RequestBody CreateRabbitRequest request) {
        // TODO semana 5: extraer userId del token de autenticación
        UUID placeholderUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");

        Rabbit rabbit = new Rabbit(
                UUID.randomUUID(),
                request.getName(),
                placeholderUserId,
                true,
                Instant.now()
        );

        RabbitEntity saved = rabbitRepository.save(rabbitEntityMapper.toEntity(rabbit));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(dtoMapper.toRabbitResponse(rabbitEntityMapper.toDomain(saved)));
    }

    /**
     * PUT /api/rabbits/{id}
     * Actualiza un conejo existente (nombre o estado activo).
     */
    @PutMapping("/{id}")
    public ResponseEntity<RabbitResponse> updateRabbit(
            @PathVariable UUID id,
            @Valid @RequestBody CreateRabbitRequest request
    ) {
        RabbitEntity entity = rabbitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rabbit", id.toString()));
        entity.setName(request.getName());
        RabbitEntity saved = rabbitRepository.save(entity);
        return ResponseEntity.ok(dtoMapper.toRabbitResponse(rabbitEntityMapper.toDomain(saved)));
    }
}
