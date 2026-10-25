CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('NORMAL','ATTENTION','HIGH_ATTENTION','LEARNING')),
    anomaly_detected BOOLEAN NOT NULL,
    factors_json TEXT NOT NULL,
    explanation VARCHAR(2000) NOT NULL,
    recommendation VARCHAR(2000) NOT NULL,
    requires_veterinary_attention BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_analysis_rabbit_created ON analysis_results(rabbit_id, created_at DESC);
