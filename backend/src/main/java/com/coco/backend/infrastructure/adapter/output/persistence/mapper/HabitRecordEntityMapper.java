package com.coco.backend.infrastructure.adapter.output.persistence.mapper;

import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import org.springframework.stereotype.Component;

/**
 * Convierte entre HabitRecord (dominio) y HabitRecordEntity (JPA).
 */
@Component
public class HabitRecordEntityMapper {

    public HabitRecordEntity toEntity(HabitRecord record) {
        return new HabitRecordEntity(
                record.getId(),
                record.getClientRecordId(),
                record.getRabbitId(),
                record.getHabitType(),
                record.getValue(),
                record.getNote(),
                record.getRecordedAt(),
                record.getSource(),
                record.getStatus(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }

    public HabitRecord toDomain(HabitRecordEntity entity) {
        return new HabitRecord(
                entity.getId(),
                entity.getClientRecordId(),
                entity.getRabbitId(),
                entity.getHabitType(),
                entity.getValue(),
                entity.getNote(),
                entity.getRecordedAt(),
                entity.getSource(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
