package com.coco.backend.application.dto.response;

import java.time.LocalDate;

/**
 * DTO de un punto de tendencia para graficar con Recharts en la web.
 * Cada punto representa la cantidad de registros en un día.
 */
public class TrendPointResponse {

    private LocalDate date;
    private long count;

    public TrendPointResponse() {}

    public TrendPointResponse(LocalDate date, long count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}
