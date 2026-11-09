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
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class RabbitAnalysisService {
    private static final int MIN_RECORDS = 10;
    private static final int MIN_DAYS = 3;
    private static final int HISTORY_DAYS = 180;
    private final RabbitJpaRepository rabbits;
    private final HabitRecordJpaRepository records;
    private final AnalysisResultJpaRepository results;
    private final AiAnalysisPort ai;
    private final ObjectMapper mapper;
    private final RabbitObservationSummaryBuilder summaryBuilder;

    public RabbitAnalysisService(RabbitJpaRepository rabbits, HabitRecordJpaRepository records,
            AnalysisResultJpaRepository results, AiAnalysisPort ai, ObjectMapper mapper, RabbitObservationSummaryBuilder summaryBuilder) {
        this.rabbits = rabbits; this.records = records; this.results = results; this.ai = ai; this.mapper = mapper; this.summaryBuilder = summaryBuilder;
    }

    public RabbitAnalysisResponse analyze(UUID rabbitId, UUID authenticatedUserId) {
        return analyze(rabbitId, authenticatedUserId, null);
    }

    /**
     * @param asOf instante de referencia opcional (nunca futuro). Permite analizar el historial tal como estaba
     *             en una fecha pasada; null equivale a "ahora".
     */
    public RabbitAnalysisResponse analyze(UUID rabbitId, UUID authenticatedUserId, Instant asOf) {
        return analyze(rabbitId, authenticatedUserId, asOf, "es");
    }

    /** @param lang idioma del texto de respuesta: "en" (inglés); cualquier otro valor, español. */
    public RabbitAnalysisResponse analyze(UUID rabbitId, UUID authenticatedUserId, Instant asOf, String lang) {
        boolean english = "en".equalsIgnoreCase(lang);
        Instant now = Instant.now();
        Instant reference = asOf == null || asOf.isAfter(now) ? now : asOf;
        RabbitEntity rabbit = rabbits.findByIdAndUserIdAndActiveTrue(rabbitId, authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Rabbit", rabbitId.toString()));
        // Ventana por fecha (no por cantidad): un tope de N registros recortaría la línea base de historiales largos.
        List<HabitRecordEntity> history = records.findByRabbitIdAndRecordedAtBetweenOrderByRecordedAtDesc(
                rabbitId, reference.minus(HISTORY_DAYS, ChronoUnit.DAYS), reference);
        Map<String, Object> summary = summaryBuilder.build(rabbit, history, reference);
        summary.put("responseLanguage", english ? "English" : "Spanish");
        AiAnalysisPort.AnalysisOutcome outcome;
        if (history.size() < MIN_RECORDS || summaryBuilder.distinctDays(history) < MIN_DAYS) {
            outcome = new AiAnalysisPort.AnalysisOutcome(AnalysisStatus.LEARNING.name(), false,
                    List.of(english ? "The available history does not yet cover enough records and days to establish an individual baseline."
                            : "El historial disponible aún no cubre suficientes registros y días para establecer una línea base individual."),
                    english ? "COCO is learning " + rabbit.getName() + "'s routine. The available information does not allow changes to be compared with enough context."
                            : "COCO está aprendiendo la rutina de " + rabbit.getName() + ". La información disponible no permite comparar cambios con suficiente contexto.",
                    english ? "Keep recording observations. Missing records do not mean the activity did not happen."
                            : "Continúa registrando observaciones. La ausencia de registros no significa ausencia de actividad.", false);
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

    private String writeFactors(List<String> factors) {
        try { return mapper.writeValueAsString(factors); }
        catch (JsonProcessingException e) { throw new IllegalStateException("Could not serialize analysis factors"); }
    }
    private String bounded(String value) {
        if (value == null || value.isBlank()) throw new IllegalStateException("AI provider returned incomplete analysis");
        return value.length() > 2000 ? value.substring(0, 2000) : value;
    }
}



