package com.coco.backend.application.dto.response;

import java.util.List;

/**
 * DTO de respuesta para un lote de sincronización desde el smartwatch.
 * Permite que el smartwatch sepa qué registros se procesaron correctamente,
 * cuáles ya existían (duplicados) y cuáles fallaron.
 */
public class SyncResultResponse {

    private List<String> synced;
    private List<String> duplicates;
    private List<String> failed;

    public SyncResultResponse() {}

    public SyncResultResponse(List<String> synced, List<String> duplicates, List<String> failed) {
        this.synced = synced;
        this.duplicates = duplicates;
        this.failed = failed;
    }

    public List<String> getSynced() { return synced; }
    public void setSynced(List<String> synced) { this.synced = synced; }

    public List<String> getDuplicates() { return duplicates; }
    public void setDuplicates(List<String> duplicates) { this.duplicates = duplicates; }

    public List<String> getFailed() { return failed; }
    public void setFailed(List<String> failed) { this.failed = failed; }

    public int getTotalProcessed() {
        return synced.size() + duplicates.size() + failed.size();
    }
}
