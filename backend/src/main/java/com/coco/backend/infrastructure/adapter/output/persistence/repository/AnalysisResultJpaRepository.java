package com.coco.backend.infrastructure.adapter.output.persistence.repository;

import com.coco.backend.infrastructure.adapter.output.persistence.entity.AnalysisResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AnalysisResultJpaRepository extends JpaRepository<AnalysisResultEntity, UUID> {
    List<AnalysisResultEntity> findTop20ByRabbitIdOrderByCreatedAtDesc(UUID rabbitId);
}
