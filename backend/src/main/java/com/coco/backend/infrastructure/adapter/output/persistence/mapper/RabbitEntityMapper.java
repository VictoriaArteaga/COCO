package com.coco.backend.infrastructure.adapter.output.persistence.mapper;

import com.coco.backend.domain.model.Rabbit;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import org.springframework.stereotype.Component;

/**
 * Convierte entre Rabbit (dominio) y RabbitEntity (JPA).
 */
@Component
public class RabbitEntityMapper {

    public RabbitEntity toEntity(Rabbit rabbit) {
        return new RabbitEntity(
                rabbit.getId(),
                rabbit.getName(),
                rabbit.getUserId(),
                rabbit.isActive(),
                rabbit.getCreatedAt()
        );
    }

    public Rabbit toDomain(RabbitEntity entity) {
        return new Rabbit(
                entity.getId(),
                entity.getName(),
                entity.getUserId(),
                entity.isActive(),
                entity.getCreatedAt()
        );
    }
}
