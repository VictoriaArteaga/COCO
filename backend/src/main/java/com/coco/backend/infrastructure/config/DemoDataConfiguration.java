package com.coco.backend.infrastructure.config;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.UserEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.UserJpaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/** Seeds the ephemeral local demo store; never enabled with the postgres profile. */
@Configuration
@Profile("!postgres")
public class DemoDataConfiguration {
    private static final UUID DEMO_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID DEMO_RABBIT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Bean
    CommandLineRunner seedDemoData(UserJpaRepository users, RabbitJpaRepository rabbits,
                                   HabitRecordJpaRepository records) {
        return args -> {
            if (users.existsById(DEMO_USER_ID)) return;
            Instant now = Instant.now();
            users.save(new UserEntity(DEMO_USER_ID, "demo@coco.local", "Cuenta demo", "", true, now));
            rabbits.save(new RabbitEntity(DEMO_RABBIT_ID, "Coquito", DEMO_USER_ID, true, now));
            HabitType[] types = HabitType.values();
            for (int day = 6; day >= 0; day--) {
                for (int typeIndex = 0; typeIndex < types.length; typeIndex++) {
                    HabitType type = types[typeIndex];
                    Instant recorded = now.minus(day, ChronoUnit.DAYS).minus(typeIndex, ChronoUnit.HOURS);
                    records.save(new HabitRecordEntity(UUID.randomUUID(), "demo-" + day + "-" + type.name(),
                            DEMO_RABBIT_ID, type, type == HabitType.BEHAVIOR ? null : 2.0 + typeIndex,
                            type == HabitType.BEHAVIOR ? "Rutina observada sin cambios relevantes." : null,
                            recorded, "WEB", RecordStatus.SYNCED, now, null));
                }
            }
        };
    }
}
