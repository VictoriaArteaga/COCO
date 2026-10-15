package com.coco.backend.application.usecase;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.domain.exception.DuplicateRecordException;
import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.mapper.HabitRecordEntityMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Caso de uso: registrar un hábito del conejo.
 * Incluye lógica de prevención de duplicados mediante clientRecordId.
 */
@Service
public class RegisterHabitUseCase {

    private final HabitRecordJpaRepository habitRecordRepository;
    private final HabitRecordEntityMapper habitRecordMapper;

    public RegisterHabitUseCase(
            HabitRecordJpaRepository habitRecordRepository,
            HabitRecordEntityMapper habitRecordMapper
    ) {
        this.habitRecordRepository = habitRecordRepository;
        this.habitRecordMapper = habitRecordMapper;
    }

    @Transactional
    public HabitRecord execute(
            String clientRecordId,
            UUID rabbitId,
            HabitType habitType,
            Double value,
            String note,
            Instant recordedAt,
            String source
    ) {
        // 1. Verificar duplicado
        if (habitRecordRepository.existsByClientRecordId(clientRecordId)) {
            throw new DuplicateRecordException(clientRecordId);
        }

        // 2. Crear modelo de dominio
        HabitRecord habit = new HabitRecord(
                UUID.randomUUID(),
                clientRecordId,
                rabbitId,
                habitType,
                value,
                note,
                recordedAt,
                source,
                RecordStatus.SYNCED,
                Instant.now(),
                null
        );

        // 3. Persistir
        HabitRecordEntity entity = habitRecordMapper.toEntity(habit);
        HabitRecordEntity saved = habitRecordRepository.save(entity);

        // 4. Devolver dominio
        return habitRecordMapper.toDomain(saved);
    }
}
