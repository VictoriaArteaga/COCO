package com.coco.backend.application.usecase;

import com.coco.backend.application.dto.response.TrendPointResponse;
import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Caso de uso: obtener datos de tendencia por tipo de hábito en los últimos N días.
 * Devuelve puntos (fecha, conteo) listos para graficar en la web con Recharts.
 */
@Service
public class GetTrendsUseCase {

    private final HabitRecordJpaRepository habitRecordRepository;

    public GetTrendsUseCase(HabitRecordJpaRepository habitRecordRepository) {
        this.habitRecordRepository = habitRecordRepository;
    }

    @Transactional(readOnly = true)
    public List<TrendPointResponse> execute(UUID rabbitId, HabitType habitType, int days) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<TrendPointResponse> points = new ArrayList<>();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            Instant start = day.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = day.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

            long count = habitRecordRepository.countByRabbitIdAndHabitTypeAndRecordedAtBetween(
                    rabbitId, habitType, start, end
            );
            points.add(new TrendPointResponse(day, count));
        }

        return points;
    }
}
