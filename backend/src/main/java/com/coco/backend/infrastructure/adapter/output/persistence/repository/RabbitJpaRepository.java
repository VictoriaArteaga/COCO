package com.coco.backend.infrastructure.adapter.output.persistence.repository;

import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para conejos.
 */
@Repository
public interface RabbitJpaRepository extends JpaRepository<RabbitEntity, UUID> {

    List<RabbitEntity> findByUserIdAndActiveTrue(UUID userId);

    Optional<RabbitEntity> findByIdAndUserId(UUID id, UUID userId);
}
