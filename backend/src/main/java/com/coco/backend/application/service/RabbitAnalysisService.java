package com.coco.backend.application.service;

import com.coco.backend.application.dto.response.RabbitAnalysisResponse;
import com.coco.backend.application.port.output.AiAnalysisPort;
import com.coco.backend.domain.enums.AnalysisStatus;
import com.coco.backend.domain.exception.ResourceNotFoundException;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.AnalysisResultEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.AnalysisResultJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitAnalysisRecordRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RabbitAnalysisService {
    private static final int MIN_RECORDS = 10;
    private static final int MIN_DAYS = 3;
    private final RabbitJpaRepository rabbits;
    private final RabbitAnalysisRecordRepository records;
    private final AnalysisResultJpaRepository results;
    private final AiAnalysisPort ai;
    private final ObjectMapper mapper;

    public RabbitAnalysisService(RabbitJpaRepository rabbits, RabbitAnalysisRecordRepository records,
            AnalysisResultJpaRepository results, AiAnalysisPort ai, ObjectMapper mapper) {
        this.rabbits = rabbits; this.records = records; this.results = results; this.ai = ai; this.mapper = mapper;
    }

    @Transactional
    public RabbitAnalysisResponse analyze(UUID rabbitId, UUID authenticatedUserId) {
        RabbitEntity rabbit = rabbits.findByIdAndUserIdAndActiveTrue(rabbitId, authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Rabbit", rabbitId.toString()));
        List<HabitRecordEntity> history = records.findTop200ByRabbitIdOrderByRecordedAtDesc(rabbitId);
        Map<String, Object> summary = summarize(rabbit, history);
        AiAnalysisPort.AnalysisOutcome outcome;
        if (history.size() < MIN_RECORDS || distinctDays(history) < MIN_DAYS) {
            outcome = new AiAnalysisPort.AnalysisOutcome(AnalysisStatus.LEARNING.name(), false,
                    List.of("El historial disponible aún no cubre suficientes registros y días para establecer una línea base individual."),
                    "COCO está aprendiendo la rutina de " + rabbit.getName() + ". La información disponible no permite comparar cambios con suficiente contexto.",
                    "Continúa registrando observaciones. La ausencia de registros no significa ausencia de actividad.", false);
        } else {
            outcome = ai.analyze(summary);
        }
        AnalysisStatus status;
        try { status = AnalysisStatus.valueOf(outcome.status()); }
        catch (RuntimeException ex) { throw new IllegalStateException("AI provider returned invalid analysis status"); }
        AnalysisResultEntity saved = results.save(new AnalysisResultEntity(rabbitId, status, outcome.anomalyDetected(),
                writeFactors(outcome.factors()), bounded(outcome.explanation()), bounded(outcome.recommendation()), outcome.requiresVeterinaryAttention()));
        return new RabbitAnalysisResponse(saved.getId(), rabbitId, saved.getStatus(), saved.isAnomalyDetected(),
                outcome.factors(), saved.getExplanation(), saved.getRecommendation(), saved.isRequiresVeterinaryAttention(), saved.getCreatedAt());
    }

    private Map<String, Object> summarize(RabbitEntity rabbit, List<HabitRecordEntity> history) {
        Instant now = Instant.now();
        Instant recentStart = now.minus(7, ChronoUnit.DAYS);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("rabbit", Map.of("name", rabbit.getName(), "age", "not recorded"));
        summary.put("historyRecordCount", history.size());
        summary.put("historyDays", distinctDays(history));
        summary.put("recentWindow", "7 days");
        summary.put("recentRecordCount", history.stream().filter(r -> !r.getRecordedAt().isBefore(recentStart)).count());
        Map<String, Object> byHabit = new LinkedHashMap<>();
        for (var type : com.coco.backend.domain.enums.HabitType.values()) {
            List<HabitRecordEntity> typed = history.stream().filter(r -> r.getHabitType() == type).toList();
            List<HabitRecordEntity> recent = typed.stream().filter(r -> !r.getRecordedAt().isBefore(recentStart)).toList();
            Set<String> observedDays = typed.stream().map(r -> r.getRecordedAt().truncatedTo(ChronoUnit.DAYS).toString()).collect(Collectors.toSet());
            Map<String, Object> detail = new LinkedHashMap<>();
            detail.put("historyCount", typed.size()); detail.put("daysWithRecords", observedDays.size()); detail.put("recentCount", recent.size());
            detail.put("recentValues", recent.stream().map(HabitRecordEntity::getValue).filter(Objects::nonNull).limit(30).toList());
            detail.put("notes", typed.stream().filter(r -> r.getNote() != null && !r.getNote().isBlank()).limit(8).map(HabitRecordEntity::getNote).toList());
            if (typed.isEmpty()) detail.put("observation", "No records; this does not mean the activity was absent.");
            byHabit.put(type.name(), detail);
        }
        summary.put("habits", byHabit);
        summary.put("comparison", "Compare recent observations with this rabbit's earlier recorded observations by habit type. Do not infer activity from missing records.");
        return summary;
    }

    private long distinctDays(List<HabitRecordEntity> history) {
        return history.stream().map(r -> r.getRecordedAt().truncatedTo(ChronoUnit.DAYS)).distinct().count();
    }
    private String writeFactors(List<String> factors) {
        try { return mapper.writeValueAsString(factors); }
        catch (JsonProcessingException e) { throw new IllegalStateException("Could not serialize analysis factors"); }
    }
    private String bounded(String value) {
        if (value == null || value.isBlank()) throw new IllegalStateException("AI provider returned incomplete analysis");
        return value.length() > 2000 ? value.substring(0, 2000) : value;
    }
}
