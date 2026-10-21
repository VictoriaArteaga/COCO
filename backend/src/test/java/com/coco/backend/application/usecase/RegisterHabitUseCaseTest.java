package com.coco.backend.application.usecase;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.exception.DuplicateRecordException;
import com.coco.backend.domain.model.HabitRecord;
import com.coco.backend.infrastructure.adapter.output.persistence.mapper.HabitRecordEntityMapper;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for RegisterHabitUseCase.
 *
 * Uses LENIENT strictness to avoid issues with Mockito inline mocks on Java 21+.
 * HabitRecordEntityMapper is instantiated directly (no external deps) to avoid
 * byte-buddy instrumentation issues.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("RegisterHabitUseCase")
class RegisterHabitUseCaseTest {

    @Mock
    private HabitRecordJpaRepository repository;

    // Instantiated directly — no external dependencies, avoids instrumentation issues
    private final HabitRecordEntityMapper mapper = new HabitRecordEntityMapper();

    private RegisterHabitUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new RegisterHabitUseCase(repository, mapper);
    }

    @Test
    @DisplayName("registra un hábito nuevo correctamente")
    void registraHabitoNuevo() {
        String clientId = UUID.randomUUID().toString();
        UUID rabbitId = UUID.randomUUID();
        Instant now = Instant.now();

        when(repository.existsByClientRecordId(clientId)).thenReturn(false);
        // Simulate save returning the entity passed to it
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        HabitRecord result = useCase.execute(
                clientId, rabbitId, HabitType.FOOD, 50.0, null, now, "WATCH"
        );

        assertThat(result).isNotNull();
        assertThat(result.getClientRecordId()).isEqualTo(clientId);
        assertThat(result.getHabitType()).isEqualTo(HabitType.FOOD);
        verify(repository).save(any());
    }

    @Test
    @DisplayName("lanza DuplicateRecordException si clientRecordId ya existe")
    void rechazaDuplicado() {
        String clientId = UUID.randomUUID().toString();
        when(repository.existsByClientRecordId(clientId)).thenReturn(true);

        assertThatThrownBy(() -> useCase.execute(
                clientId, UUID.randomUUID(), HabitType.WATER, null, null, Instant.now(), "WATCH"
        ))
                .isInstanceOf(DuplicateRecordException.class)
                .hasMessageContaining(clientId);

        verify(repository, never()).save(any());
    }
}
