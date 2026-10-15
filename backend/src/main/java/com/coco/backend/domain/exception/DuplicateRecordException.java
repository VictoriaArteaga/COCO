package com.coco.backend.domain.exception;

/**
 * Se lanza cuando se intenta sincronizar un registro que ya existe.
 * El clientRecordId se usa como clave de idempotencia.
 */
public class DuplicateRecordException extends RuntimeException {

    private final String clientRecordId;

    public DuplicateRecordException(String clientRecordId) {
        super("El registro con clientRecordId '" + clientRecordId + "' ya existe");
        this.clientRecordId = clientRecordId;
    }

    public String getClientRecordId() { return clientRecordId; }
}
