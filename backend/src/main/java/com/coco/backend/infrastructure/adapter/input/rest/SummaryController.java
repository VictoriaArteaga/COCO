package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.response.DailySummaryResponse;
import com.coco.backend.application.usecase.GetDailySummaryUseCase;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public SummaryController(GetDailySummaryUseCase getDailySummaryUseCase) {
        this.getDailySummaryUseCase = getDailySummaryUseCase;
    }

    /**
     * GET /api/summary/daily
     * Retorna el resumen diario de hábitos de un conejo.
     * Si no se especifica fecha, usa la de hoy (UTC).
     */
    @GetMapping("/daily")
    public ResponseEntity<DailySummaryResponse> getDailySummary(
            @RequestParam UUID rabbitId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        DailySummaryResponse summary = getDailySummaryUseCase.execute(rabbitId, targetDate);
        return ResponseEntity.ok(summary);
    }
}
