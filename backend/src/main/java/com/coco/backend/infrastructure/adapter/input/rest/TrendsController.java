package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.response.TrendPointResponse;
import com.coco.backend.application.usecase.GetTrendsUseCase;
import com.coco.backend.domain.enums.HabitType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller REST para tendencias de hábitos.
 * GET /api/trends/{habitType}?rabbitId=&days=
 */
@RestController
@RequestMapping("/api/trends")
public class TrendsController {

    private final GetTrendsUseCase getTrendsUseCase;

    public TrendsController(GetTrendsUseCase getTrendsUseCase) {
        this.getTrendsUseCase = getTrendsUseCase;
    }

    /**
     * GET /api/trends/{habitType}
     * Retorna puntos de tendencia para los últimos N días (por defecto 7).
     * Los puntos tienen formato {date, count} listos para Recharts.
     */
    @GetMapping("/{habitType}")
    public ResponseEntity<List<TrendPointResponse>> getTrends(
            @PathVariable HabitType habitType,
            @RequestParam UUID rabbitId,
            @RequestParam(defaultValue = "7") int days
    ) {
        if (days < 1 || days > 90) {
            days = 7;
        }
        List<TrendPointResponse> points = getTrendsUseCase.execute(rabbitId, habitType, days);
        return ResponseEntity.ok(points);
    }
}
