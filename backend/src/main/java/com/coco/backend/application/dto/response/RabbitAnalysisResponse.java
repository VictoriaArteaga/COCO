package com.coco.backend.application.dto.response;

import com.coco.backend.domain.enums.AnalysisStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RabbitAnalysisResponse(UUID id, UUID rabbitId, AnalysisStatus status, boolean anomalyDetected,
                                    List<String> factors, String explanation, String recommendation,
                                    boolean requiresVeterinaryAttention, Instant createdAt) { }
