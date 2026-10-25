package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.request.CreateHabitRequest;
import com.coco.backend.application.dto.response.HabitRecordResponse;
import com.coco.backend.application.mapper.DomainDtoMapper;
import com.coco.backend.application.usecase.RegisterHabitUseCase;
import com.coco.backend.domain.exception.ResourceNotFoundException;
import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.infrastructure.adapter.output.persistence.mapper.HabitRecordEntityMapper;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;

import java.util.UUID;

/**
 * Controller REST para registros de hábitos individuales.
 */
@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final RegisterHabitUseCase registerHabitUseCase;
    private final HabitRecordJpaRepository habitRecordRepository;
    private final HabitRecordEntityMapper habitRecordEntityMapper;
    private final DomainDtoMapper dtoMapper;
    private final RabbitJpaRepository rabbits;

    public HabitController(
            RegisterHabitUseCase registerHabitUseCase,
            HabitRecordJpaRepository habitRecordRepository,
            HabitRecordEntityMapper habitRecordEntityMapper,
            DomainDtoMapper dtoMapper,
            RabbitJpaRepository rabbits
    ) {
        this.registerHabitUseCase = registerHabitUseCase;
        this.habitRecordRepository = habitRecordRepository;
        this.habitRecordEntityMapper = habitRecordEntityMapper;
        this.dtoMapper = dtoMapper;
        this.rabbits = rabbits;
    }

    /**
     * POST /api/habits
     * Registra un hábito individual.
     */
    @PostMapping
    public ResponseEntity<HabitRecordResponse> createHabit(
            @Valid @RequestBody CreateHabitRequest request, Authentication auth
    ) {
        requireOwnedRabbit(request.getRabbitId(), auth);
        HabitRecord record = registerHabitUseCase.execute(
                request.getClientRecordId(),
                request.getRabbitId(),
                request.getHabitType(),
                request.getValue(),
                request.getNote(),
                request.getRecordedAt(),
                request.getSource() != null ? request.getSource() : "WEB"
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(dtoMapper.toHabitRecordResponse(record));
    }

    /**
     * GET /api/habits
     * Lista registros paginados.
     */
    @GetMapping
    public ResponseEntity<Page<HabitRecordResponse>> listHabits(Pageable pageable, Authentication auth) {
        Page<HabitRecordResponse> page = habitRecordRepository.findAllByOwner(UUID.fromString(auth.getName()), pageable)
                .map(habitRecordEntityMapper::toDomain)
                .map(dtoMapper::toHabitRecordResponse);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/habits/{id}
     * Obtiene un registro de hábito por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HabitRecordResponse> getHabit(@PathVariable UUID id, Authentication auth) {
        HabitRecord record = habitRecordRepository.findByIdAndOwner(id, UUID.fromString(auth.getName()))
                .map(habitRecordEntityMapper::toDomain)
                .orElseThrow(() -> new ResourceNotFoundException("HabitRecord", id.toString()));
        return ResponseEntity.ok(dtoMapper.toHabitRecordResponse(record));
    }

    private void requireOwnedRabbit(UUID rabbitId, Authentication auth) {
        if (rabbits.findByIdAndUserId(rabbitId, UUID.fromString(auth.getName()))
                .filter(com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity::isActive).isEmpty())
            throw new ResourceNotFoundException("Rabbit", rabbitId.toString());
    }
}
