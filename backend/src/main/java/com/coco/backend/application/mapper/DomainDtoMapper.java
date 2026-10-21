package com.coco.backend.application.mapper;

import com.coco.backend.application.dto.response.HabitRecordResponse;
import com.coco.backend.application.dto.response.RabbitResponse;
import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.domain.model.Rabbit;
import org.springframework.stereotype.Component;

/**
 * Convierte modelos de dominio a DTOs de respuesta REST.
 */
@Component
public class DomainDtoMapper {

    public RabbitResponse toRabbitResponse(Rabbit rabbit) {
        return new RabbitResponse(
                rabbit.getId(),
                rabbit.getName(),
                rabbit.isActive(),
                rabbit.getCreatedAt()
        );
    }

    public HabitRecordResponse toHabitRecordResponse(HabitRecord record) {
        HabitRecordResponse response = new HabitRecordResponse();
        response.setId(record.getId());
        response.setClientRecordId(record.getClientRecordId());
        response.setRabbitId(record.getRabbitId());
        response.setHabitType(record.getHabitType());
        response.setValue(record.getValue());
        response.setNote(record.getNote());
        response.setRecordedAt(record.getRecordedAt());
        response.setSource(record.getSource());
        response.setStatus(record.getStatus());
        response.setCreatedAt(record.getCreatedAt());
        return response;
    }
}
