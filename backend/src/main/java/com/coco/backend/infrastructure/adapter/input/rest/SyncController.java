package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.request.SyncBatchRequest;
import com.coco.backend.application.dto.response.SyncResultResponse;
import com.coco.backend.application.usecase.SyncRecordsUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para sincronización desde el smartwatch Wear OS.
 * POST /api/sync/habits -- recibe un lote de registros pendientes.
 */
@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final SyncRecordsUseCase syncRecordsUseCase;

    public SyncController(SyncRecordsUseCase syncRecordsUseCase) {
        this.syncRecordsUseCase = syncRecordsUseCase;
    }

    /**
     * POST /api/sync/habits
     * Recibe un lote de registros pendientes desde el smartwatch.
     *
     * Respuesta incluye:
     * - synced: clientRecordIds procesados correctamente
     * - duplicates: clientRecordIds que ya existían (no se crearon de nuevo)
     * - failed: clientRecordIds que fallaron
     *
     * El smartwatch debe marcar como SYNCED los de 'synced' y 'duplicates'.
     * Los de 'failed' deben reintentarse en el próximo ciclo de sync.
     */
    @PostMapping("/habits")
    public ResponseEntity<SyncResultResponse> syncHabits(
            @Valid @RequestBody SyncBatchRequest request
    ) {
        SyncResultResponse result = syncRecordsUseCase.execute(request.getRecords());
        return ResponseEntity.ok(result);
    }
}
