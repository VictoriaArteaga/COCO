package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.response.DailySummaryResponse;
import com.coco.backend.application.usecase.GetDailySummaryUseCase;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.coco.backend.domain.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Controller REST para el resumen diario de hábitos.
 * GET /api/summary/daily?rabbitId=&date=
 */
@RestController
@RequestMapping("/api/summary")
public class SummaryController {

    private final GetDailySummaryUseCase getDailySummaryUseCase;
    private final RabbitJpaRepository rabbits;

    public SummaryController(GetDailySummaryUseCase getDailySummaryUseCase, RabbitJpaRepository rabbits) {
        this.getDailySummaryUseCase = getDailySummaryUseCase;
        this.rabbits = rabbits;
    }

    /**
     * GET /api/summary/daily
     * Retorna el resumen diario de hábitos de un conejo.
     * Si no se especifica fecha, usa la de hoy (UTC).
     */
    @GetMapping("/daily")
    public ResponseEntity<DailySummaryResponse> getDailySummary(
            @RequestParam UUID rabbitId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth
    ) {
        if (rabbits.findByIdAndUserId(rabbitId, UUID.fromString(auth.getName())).filter(com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity::isActive).isEmpty())
            throw new ResourceNotFoundException("Rabbit", rabbitId.toString());
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        DailySummaryResponse summary = getDailySummaryUseCase.execute(rabbitId, targetDate);
        return ResponseEntity.ok(summary);
    }
}
