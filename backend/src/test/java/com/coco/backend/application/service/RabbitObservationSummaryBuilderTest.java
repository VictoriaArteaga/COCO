package com.coco.backend.application.service;

import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;

class RabbitObservationSummaryBuilderTest {
    @Test
    void missingHabitRecordsAreDescribedAsUnknownRatherThanInactive() {
        var rabbit = new RabbitEntity(UUID.randomUUID(), "Nube", UUID.randomUUID(), true, Instant.now());
        Map<String, Object> summary = new RabbitObservationSummaryBuilder().build(rabbit, java.util.List.of(), Instant.now());
        Map<?, ?> habits = (Map<?, ?>) summary.get("habits");
        assertThat(habits).containsKeys("FOOD", "WATER", "SLEEP", "PLAY", "BEHAVIOR");
        for (Object value : habits.values()) {
            Map<?, ?> detail = (Map<?, ?>) value;
            assertThat(detail.get("observation").toString()).contains("does not mean the activity was absent");
            assertThat(detail.get("recentObservationsPerRecordedDay")).isEqualTo(0.0);
        }
    }
}
