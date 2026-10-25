package com.coco.backend.application.port.output;

import java.util.Map;

public interface AiAnalysisPort {
    AnalysisOutcome analyze(Map<String, Object> summary);

    record AnalysisOutcome(String status, boolean anomalyDetected, java.util.List<String> factors,
                           String explanation, String recommendation, boolean requiresVeterinaryAttention) { }
}
