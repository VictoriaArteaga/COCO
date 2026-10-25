package com.coco.backend.infrastructure.adapter.output.persistence.entity;

import com.coco.backend.domain.enums.AnalysisStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "analysis_results", indexes = @Index(name = "idx_analysis_rabbit_created", columnList = "rabbit_id, created_at"))
public class AnalysisResultEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) @Column(nullable = false, updatable = false)
    private UUID id;
    @Column(name = "rabbit_id", nullable = false) private UUID rabbitId;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private AnalysisStatus status;
    @Column(name = "anomaly_detected", nullable = false) private boolean anomalyDetected;
    @Column(name = "factors_json", nullable = false, columnDefinition = "text") private String factorsJson;
    @Column(nullable = false, length = 2000) private String explanation;
    @Column(nullable = false, length = 2000) private String recommendation;
    @Column(name = "requires_veterinary_attention", nullable = false) private boolean requiresVeterinaryAttention;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    protected AnalysisResultEntity() { }
    public AnalysisResultEntity(UUID rabbitId, AnalysisStatus status, boolean anomalyDetected, String factorsJson,
                                String explanation, String recommendation, boolean requiresVeterinaryAttention) {
        this.rabbitId = rabbitId; this.status = status; this.anomalyDetected = anomalyDetected;
        this.factorsJson = factorsJson; this.explanation = explanation; this.recommendation = recommendation;
        this.requiresVeterinaryAttention = requiresVeterinaryAttention;
    }
    public UUID getId() { return id; }
    public UUID getRabbitId() { return rabbitId; }
    public AnalysisStatus getStatus() { return status; }
    public boolean isAnomalyDetected() { return anomalyDetected; }
    public String getFactorsJson() { return factorsJson; }
    public String getExplanation() { return explanation; }
    public String getRecommendation() { return recommendation; }
    public boolean isRequiresVeterinaryAttention() { return requiresVeterinaryAttention; }
    public Instant getCreatedAt() { return createdAt; }
}
