package com.coco.backend.application.usecase;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.infrastructure.adapter.output.persistence.mapper.HabitRecordEntityMapper;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Caso de uso: consultar historial de hábitos con filtros opcionales.
 */
@Service
public class GetHistoryUseCase {

    private final HabitRecordJpaRepository habitRecordRepository;
    private final HabitRecordEntityMapper habitRecordMapper;

    public GetHistoryUseCase(
            HabitRecordJpaRepository habitRecordRepository,
            HabitRecordEntityMapper habitRecordMapper
    ) {
        this.habitRecordRepository = habitRecordRepository;
        this.habitRecordMapper = habitRecordMapper;
    }

    @Transactional(readOnly = true)
    public Page<HabitRecord> execute(
            UUID userId,
            UUID rabbitId,
            HabitType habitType,
            Instant from,
            Instant to,
            Pageable pageable
    ) {
        return habitRecordRepository
                .findByOwnerAndFilters(userId, rabbitId, habitType, from, to, pageable)
                .map(habitRecordMapper::toDomain);
    }
}
