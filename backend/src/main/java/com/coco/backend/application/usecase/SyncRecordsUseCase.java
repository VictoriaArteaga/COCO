package com.coco.backend.application.usecase;

import com.coco.backend.application.dto.request.SyncHabitRequest;
import com.coco.backend.application.dto.response.SyncResultResponse;
import com.coco.backend.domain.exception.DuplicateRecordException;
import com.coco.backend.domain.model.HabitRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;

/**
 * Caso de uso: sincronizar lote de registros enviados desde el smartwatch.
 * 
 * Estrategia de conflictos:
 * - Se usa clientRecordId como clave de idempotencia.
 * - Si el registro ya existe, se marca como DUPLICATE (no se crea dos veces).
 * - El timestamp original del cliente se conserva (no se sobreescribe con la hora del servidor).
 * - Estrategia "last-write-wins" no aplica aquí: el primer envío gana, los duplicados se ignoran.
 */
@Service
public class SyncRecordsUseCase {

    private final RegisterHabitUseCase registerHabitUseCase;
    private final RabbitJpaRepository rabbits;

    public SyncRecordsUseCase(RegisterHabitUseCase registerHabitUseCase, RabbitJpaRepository rabbits) {
        this.registerHabitUseCase = registerHabitUseCase;
        this.rabbits = rabbits;
    }

    @Transactional
    public SyncResultResponse execute(UUID userId, List<SyncHabitRequest> requests) {
        List<String> synced = new ArrayList<>();
        List<String> duplicates = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        for (SyncHabitRequest req : requests) {
            try {
                if (rabbits.findByIdAndUserId(req.getRabbitId(), userId).filter(com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity::isActive).isEmpty()) {
                    failed.add(req.getClientRecordId());
                    continue;
                }
                HabitRecord record = registerHabitUseCase.execute(
                        req.getClientRecordId(),
                        req.getRabbitId(),
                        req.getHabitType(),
                        req.getValue(),
                        req.getNote(),
                        req.getRecordedAt(),
                        "WATCH"
                );
                synced.add(record.getClientRecordId());
            } catch (DuplicateRecordException e) {
                // No es un error: el smartwatch reintentó un registro ya enviado
                duplicates.add(req.getClientRecordId());
            } catch (Exception e) {
                failed.add(req.getClientRecordId());
            }
        }

        return new SyncResultResponse(synced, duplicates, failed);
    }
}
