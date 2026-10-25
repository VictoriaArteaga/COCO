package com.coco.backend.application.service;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class RabbitObservationSummaryBuilder {
    public Map<String, Object> build(RabbitEntity rabbit, List<HabitRecordEntity> history, Instant now) {
        Instant recentStart = now.minus(7, ChronoUnit.DAYS);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("rabbit", Map.of("name", rabbit.getName(), "age", "not recorded"));
        summary.put("historyRecordCount", history.size());
        summary.put("historyDays", distinctDays(history));
        summary.put("recentWindow", "7 days");
        summary.put("recentRecordCount", history.stream().filter(r -> !r.getRecordedAt().isBefore(recentStart)).count());
        Map<String, Object> byHabit = new LinkedHashMap<>();
        for (HabitType type : HabitType.values()) {
            List<HabitRecordEntity> typed = history.stream().filter(r -> r.getHabitType() == type).toList();
            List<HabitRecordEntity> recent = typed.stream().filter(r -> !r.getRecordedAt().isBefore(recentStart)).toList();
            List<HabitRecordEntity> baseline = typed.stream().filter(r -> r.getRecordedAt().isBefore(recentStart)).toList();
            Map<String, Object> detail = new LinkedHashMap<>();
            detail.put("historyCount", typed.size());
            detail.put("recentCount", recent.size());
            detail.put("recentValues", recent.stream().map(HabitRecordEntity::getValue).filter(Objects::nonNull).limit(30).toList());
            detail.put("baselineDaysWithRecords", distinctDays(baseline));
            detail.put("baselineObservationsPerRecordedDay", observationsPerRecordedDay(baseline));
            detail.put("recentDaysWithRecords", distinctDays(recent));
            detail.put("recentObservationsPerRecordedDay", observationsPerRecordedDay(recent));
            detail.put("notes", typed.stream().filter(r -> r.getNote() != null && !r.getNote().isBlank()).limit(8).map(HabitRecordEntity::getNote).toList());
            if (typed.isEmpty()) detail.put("observation", "No records; this does not mean the activity was absent.");
            byHabit.put(type.name(), detail);
        }
        summary.put("habits", byHabit);
        summary.put("comparison", "Compare recent observations with this rabbit's earlier recorded observations by habit type. Per-day values use days with records only; missing records do not imply no activity.");
        return summary;
    }

    public long distinctDays(List<HabitRecordEntity> history) {
        return history.stream().map(r -> r.getRecordedAt().truncatedTo(ChronoUnit.DAYS)).distinct().count();
    }
    private double observationsPerRecordedDay(List<HabitRecordEntity> history) {
        Map<Instant, Long> countByDay = history.stream().collect(Collectors.groupingBy(
                r -> r.getRecordedAt().truncatedTo(ChronoUnit.DAYS), Collectors.counting()));
        return countByDay.isEmpty() ? 0.0 : countByDay.values().stream().mapToLong(Long::longValue).average().orElse(0.0);
    }
}

