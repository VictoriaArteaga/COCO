package com.coco.backend.application.service;

import com.coco.backend.application.port.output.AiAnalysisPort;
import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.AnalysisResultJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class RabbitAnalysisServiceTest {
    @Test
    void summarizesRabbitBaselineAndPersistsSuccessfulAnalysis() {
        var rabbits = mock(RabbitJpaRepository.class);
        var records = mock(HabitRecordJpaRepository.class);
        var results = mock(AnalysisResultJpaRepository.class);
        var ai = mock(AiAnalysisPort.class);
        UUID rabbitId = UUID.randomUUID(), owner = UUID.randomUUID();
        RabbitEntity rabbit = new RabbitEntity(rabbitId, "Nube", owner, true, Instant.now());
        when(rabbits.findByIdAndUserIdAndActiveTrue(rabbitId, owner)).thenReturn(Optional.of(rabbit));
        Instant now = Instant.now();
        List<HabitRecordEntity> history = new ArrayList<>();
        for (int i = 10; i >= 7; i--) history.add(record(rabbitId, now.minusSeconds(i * 86400L)));
        for (int i = 0; i < 6; i++) history.add(record(rabbitId, now.minusSeconds(i * 86400L)));
        when(records.findTop200ByRabbitIdOrderByRecordedAtDesc(rabbitId)).thenReturn(history);
        when(ai.analyze(anyMap())).thenReturn(new AiAnalysisPort.AnalysisOutcome("ATTENTION", true,
                List.of("Recent observations differ from earlier recorded days."), "Some recorded patterns changed.",
                "Continue observing and seek veterinary advice if concerned.", false));
        when(results.save(any())).thenAnswer(call -> call.getArgument(0));
        var service = new RabbitAnalysisService(rabbits, records, results, ai, new ObjectMapper(), new RabbitObservationSummaryBuilder());

        var response = service.analyze(rabbitId, owner);

        assertThat(response.status()).isEqualTo(com.coco.backend.domain.enums.AnalysisStatus.ATTENTION);
        assertThat(response.anomalyDetected()).isTrue();
        var summaryCaptor = org.mockito.ArgumentCaptor.forClass(Map.class);
        verify(ai).analyze(summaryCaptor.capture());
        Map<?, ?> habits = (Map<?, ?>) summaryCaptor.getValue().get("habits");
        Map<?, ?> food = (Map<?, ?>) habits.get("FOOD");
        assertThat(food.get("baselineDaysWithRecords")).isEqualTo(4L);
        assertThat(food.get("baselineObservationsPerRecordedDay")).isEqualTo(1.0);
        assertThat(food.get("recentDaysWithRecords")).isEqualTo(7L);
        verify(results).save(any());
    }

    private HabitRecordEntity record(UUID rabbitId, Instant recordedAt) {
        return new HabitRecordEntity(UUID.randomUUID(), UUID.randomUUID().toString(), rabbitId, HabitType.FOOD,
                1.0, "observed", recordedAt, "WEB", RecordStatus.SYNCED, recordedAt, null);
    }
}
