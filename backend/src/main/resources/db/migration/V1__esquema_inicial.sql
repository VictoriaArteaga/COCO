-- =====================================================
-- COCO Backend -- Migración V1: Esquema inicial
-- =====================================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabla de conejos
CREATE TABLE IF NOT EXISTS rabbits (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rabbits_user_id ON rabbits(user_id);
CREATE INDEX IF NOT EXISTS idx_rabbits_active   ON rabbits(active);

-- Tabla de registros de hábitos
CREATE TABLE IF NOT EXISTS habit_records (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- UUID generado en el cliente; restricción UNIQUE garantiza idempotencia
    client_record_id VARCHAR(100) NOT NULL UNIQUE,
    rabbit_id        UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
    habit_type       VARCHAR(20)  NOT NULL
                         CHECK (habit_type IN ('FOOD','WATER','SLEEP','PLAY','BEHAVIOR')),
    value            DOUBLE PRECISION,
    note             VARCHAR(500),
    -- Timestamp original del cliente; NO sobreescribir con hora del servidor
    recorded_at      TIMESTAMPTZ NOT NULL,
    source           VARCHAR(20) DEFAULT 'WATCH',
    status           VARCHAR(20) NOT NULL DEFAULT 'SYNCED'
                         CHECK (status IN ('PENDING','SYNCED','FAILED','DUPLICATE')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_habit_records_rabbit_id   ON habit_records(rabbit_id);
CREATE INDEX IF NOT EXISTS idx_habit_records_habit_type  ON habit_records(habit_type);
CREATE INDEX IF NOT EXISTS idx_habit_records_recorded_at ON habit_records(recorded_at);
CREATE INDEX IF NOT EXISTS idx_habit_records_rabbit_type_date
    ON habit_records(rabbit_id, habit_type, recorded_at);
