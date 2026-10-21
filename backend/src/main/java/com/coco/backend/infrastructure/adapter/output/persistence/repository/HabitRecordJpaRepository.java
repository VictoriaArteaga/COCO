package com.coco.backend.infrastructure.adapter.output.persistence.repository;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

/**
 * Repositorio JPA para registros de hábitos.
 * Incluye consultas para historial, tendencias y resumen diario.
 */
@Repository
public interface HabitRecordJpaRepository extends JpaRepository<HabitRecordEntity, UUID> {

    /** Verificación de duplicado por clientRecordId (clave de idempotencia) */
    boolean existsByClientRecordId(String clientRecordId);

    /**
     * Historial con filtros opcionales.
     * Si un parámetro es null, no se aplica ese filtro.
     */
    @Query("""
        SELECT h FROM HabitRecordEntity h
        WHERE (:rabbitId IS NULL OR h.rabbitId = :rabbitId)
          AND (:habitType IS NULL OR h.habitType = :habitType)
          AND (:from IS NULL OR h.recordedAt >= :from)
          AND (:to IS NULL OR h.recordedAt < :to)
        ORDER BY h.recordedAt DESC
        """)
    Page<HabitRecordEntity> findByFilters(
            @Param("rabbitId") UUID rabbitId,
            @Param("habitType") HabitType habitType,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );

    /** Conteo para resumen diario y tendencias */
    long countByRabbitIdAndHabitTypeAndRecordedAtBetween(
            UUID rabbitId,
            HabitType habitType,
            Instant start,
            Instant end
    );
}
