package com.coco.backend.application.usecase;

import com.coco.backend.application.dto.request.SyncHabitRequest;
import com.coco.backend.application.dto.response.SyncResultResponse;
import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.domain.exception.DuplicateRecordException;
import com.coco.backend.domain.model.HabitRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;

@ExtendWith(MockitoExtension.class)
@DisplayName("SyncRecordsUseCase")
class SyncRecordsUseCaseTest {

    @Mock
    private RegisterHabitUseCase registerHabitUseCase;
    @Mock
    private RabbitJpaRepository rabbitRepository;

    private SyncRecordsUseCase syncUseCase;

    @BeforeEach
    void setUp() {
        syncUseCase = new SyncRecordsUseCase(registerHabitUseCase, rabbitRepository);
        lenient().when(rabbitRepository.findByIdAndUserId(any(), any()))
                .thenReturn(java.util.Optional.of(new RabbitEntity(UUID.randomUUID(), "test", UUID.randomUUID(), true, Instant.now())));
    }

    private SyncHabitRequest makeRequest(String clientId) {
        SyncHabitRequest req = new SyncHabitRequest();
        req.setClientRecordId(clientId);
        req.setRabbitId(UUID.randomUUID());
        req.setHabitType(HabitType.FOOD);
        req.setRecordedAt(Instant.now());
        return req;
    }

    @Test
    @DisplayName("sincroniza correctamente registros nuevos")
    void sincronizaRegistrosNuevos() {
        String id1 = UUID.randomUUID().toString();
        String id2 = UUID.randomUUID().toString();

        HabitRecord mockRecord1 = mockRecord(id1);
        HabitRecord mockRecord2 = mockRecord(id2);

        when(registerHabitUseCase.execute(eq(id1), any(), any(), any(), any(), any(), any()))
                .thenReturn(mockRecord1);
        when(registerHabitUseCase.execute(eq(id2), any(), any(), any(), any(), any(), any()))
                .thenReturn(mockRecord2);

        SyncResultResponse result = syncUseCase.execute(UUID.randomUUID(), List.of(makeRequest(id1), makeRequest(id2)));

        assertThat(result.getSynced()).containsExactlyInAnyOrder(id1, id2);
        assertThat(result.getDuplicates()).isEmpty();
        assertThat(result.getFailed()).isEmpty();
    }

    @Test
    @DisplayName("clasifica duplicados correctamente sin crear nuevo registro")
    void clasificaDuplicados() {
        String idNuevo = UUID.randomUUID().toString();
        String idDuplicado = UUID.randomUUID().toString();

        when(registerHabitUseCase.execute(eq(idNuevo), any(), any(), any(), any(), any(), any()))
                .thenReturn(mockRecord(idNuevo));
        when(registerHabitUseCase.execute(eq(idDuplicado), any(), any(), any(), any(), any(), any()))
                .thenThrow(new DuplicateRecordException(idDuplicado));

        SyncResultResponse result = syncUseCase.execute(
                UUID.randomUUID(), List.of(makeRequest(idNuevo), makeRequest(idDuplicado))
        );

        assertThat(result.getSynced()).containsExactly(idNuevo);
        assertThat(result.getDuplicates()).containsExactly(idDuplicado);
        assertThat(result.getFailed()).isEmpty();
    }

    @Test
    @DisplayName("no acepta conejos que no pertenecen al usuario en la sincronización")
    void rechazaConejoAjenoEnSync() {
        String clientId = UUID.randomUUID().toString();
        SyncHabitRequest request = makeRequest(clientId);
        when(rabbitRepository.findByIdAndUserId(eq(request.getRabbitId()), any())).thenReturn(java.util.Optional.empty());

        SyncResultResponse result = syncUseCase.execute(UUID.randomUUID(), List.of(request));

        assertThat(result.getFailed()).containsExactly(clientId);
        verify(registerHabitUseCase, never()).execute(eq(clientId), any(), any(), any(), any(), any(), any());
    }

    private HabitRecord mockRecord(String clientId) {
        return new HabitRecord(
                UUID.randomUUID(), clientId, UUID.randomUUID(),
                HabitType.FOOD, null, null, Instant.now(),
                "WATCH", RecordStatus.SYNCED, Instant.now(), null
        );
    }
}
