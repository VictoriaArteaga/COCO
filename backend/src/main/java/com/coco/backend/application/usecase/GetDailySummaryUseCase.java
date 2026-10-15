package com.coco.backend.application.usecase;

import com.coco.backend.application.dto.response.DailySummaryResponse;
import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Caso de uso: obtener el resumen diario de hábitos de un conejo.
 */
@Service
public class GetDailySummaryUseCase {

    private final HabitRecordJpaRepository habitRecordRepository;

    public GetDailySummaryUseCase(HabitRecordJpaRepository habitRecordRepository) {
        this.habitRecordRepository = habitRecordRepository;
    }

    @Transactional(readOnly = true)
    public DailySummaryResponse execute(UUID rabbitId, LocalDate date) {
        Instant start = date.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant end = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        Map<HabitType, Long> counts = new LinkedHashMap<>();
        for (HabitType type : HabitType.values()) {
            long count = habitRecordRepository.countByRabbitIdAndHabitTypeAndRecordedAtBetween(
                    rabbitId, type, start, end
            );
            counts.put(type, count);
        }

        long total = counts.values().stream().mapToLong(Long::longValue).sum();
        return new DailySummaryResponse(rabbitId, date, total, counts);
    }
}
