package com.coco.backend.application.dto.response;

import com.coco.backend.domain.enums.HabitType;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

/**
 * DTO de respuesta para el resumen diario de hábitos de un conejo.
 */
public class DailySummaryResponse {

    private UUID rabbitId;
    private LocalDate date;
    private long totalRecords;
    private Map<HabitType, Long> countsByType;

    public DailySummaryResponse() {}

    public DailySummaryResponse(UUID rabbitId, LocalDate date, long totalRecords,
                                 Map<HabitType, Long> countsByType) {
        this.rabbitId = rabbitId;
        this.date = date;
        this.totalRecords = totalRecords;
        this.countsByType = countsByType;
    }

    public UUID getRabbitId() { return rabbitId; }
    public void setRabbitId(UUID rabbitId) { this.rabbitId = rabbitId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }

    public Map<HabitType, Long> getCountsByType() { return countsByType; }
    public void setCountsByType(Map<HabitType, Long> countsByType) { this.countsByType = countsByType; }
}
