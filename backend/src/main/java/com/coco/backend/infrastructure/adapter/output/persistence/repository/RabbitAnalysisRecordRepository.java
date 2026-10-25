package com.coco.backend.infrastructure.adapter.output.persistence.repository;

import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RabbitAnalysisRecordRepository extends JpaRepository<HabitRecordEntity, UUID> {
    List<HabitRecordEntity> findTop200ByRabbitIdOrderByRecordedAtDesc(UUID rabbitId);
}
