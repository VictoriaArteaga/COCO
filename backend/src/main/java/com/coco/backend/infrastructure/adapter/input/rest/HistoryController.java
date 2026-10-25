package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.response.HabitRecordResponse;
import com.coco.backend.application.mapper.DomainDtoMapper;
import com.coco.backend.application.usecase.GetHistoryUseCase;
import com.coco.backend.domain.enums.HabitType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.Instant;
import java.util.UUID;

/**
 * Controller REST para consultar el historial de hábitos con filtros.
 * GET /api/history?rabbitId=&habitType=&from=&to=
 */
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final GetHistoryUseCase getHistoryUseCase;
    private final DomainDtoMapper dtoMapper;

    public HistoryController(GetHistoryUseCase getHistoryUseCase, DomainDtoMapper dtoMapper) {
        this.getHistoryUseCase = getHistoryUseCase;
        this.dtoMapper = dtoMapper;
    }

    /**
     * GET /api/history
     * Retorna historial paginado con filtros opcionales.
     *
     * @param rabbitId  Filtra por conejo (opcional)
     * @param habitType Filtra por tipo de hábito (opcional)
     * @param from      Fecha inicio ISO-8601 (opcional)
     * @param to        Fecha fin ISO-8601 (opcional)
     */
    @GetMapping
    public ResponseEntity<Page<HabitRecordResponse>> getHistory(
            @RequestParam(required = false) UUID rabbitId,
            @RequestParam(required = false) HabitType habitType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Pageable pageable,
            Authentication auth
    ) {
        Page<HabitRecordResponse> page = getHistoryUseCase
                .execute(UUID.fromString(auth.getName()), rabbitId, habitType, from, to, pageable)
                .map(dtoMapper::toHabitRecordResponse);
        return ResponseEntity.ok(page);
    }
}
