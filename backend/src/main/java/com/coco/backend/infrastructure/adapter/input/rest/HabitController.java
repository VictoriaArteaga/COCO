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

    public HabitController(
            RegisterHabitUseCase registerHabitUseCase,
            HabitRecordJpaRepository habitRecordRepository,
            HabitRecordEntityMapper habitRecordEntityMapper,
            DomainDtoMapper dtoMapper
    ) {
        this.registerHabitUseCase = registerHabitUseCase;
        this.habitRecordRepository = habitRecordRepository;
        this.habitRecordEntityMapper = habitRecordEntityMapper;
        this.dtoMapper = dtoMapper;
    }

    /**
     * POST /api/habits
     * Registra un hábito individual.
     */
    @PostMapping
    public ResponseEntity<HabitRecordResponse> createHabit(
            @Valid @RequestBody CreateHabitRequest request
    ) {
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
    public ResponseEntity<Page<HabitRecordResponse>> listHabits(Pageable pageable) {
        Page<HabitRecordResponse> page = habitRecordRepository.findAll(pageable)
                .map(habitRecordEntityMapper::toDomain)
                .map(dtoMapper::toHabitRecordResponse);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /api/habits/{id}
     * Obtiene un registro de hábito por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HabitRecordResponse> getHabit(@PathVariable UUID id) {
        HabitRecord record = habitRecordRepository.findById(id)
                .map(habitRecordEntityMapper::toDomain)
                .orElseThrow(() -> new ResourceNotFoundException("HabitRecord", id.toString()));
        return ResponseEntity.ok(dtoMapper.toHabitRecordResponse(record));
    }
}
