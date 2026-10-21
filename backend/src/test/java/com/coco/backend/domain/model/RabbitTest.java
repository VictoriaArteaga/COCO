package com.coco.backend.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Rabbit - Modelo de dominio")
class RabbitTest {

    @Test
    @DisplayName("crea conejo válido con todos los campos")
    void creaConejo() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Rabbit rabbit = new Rabbit(id, "Coquito", userId, true, Instant.now());

        assertThat(rabbit.getId()).isEqualTo(id);
        assertThat(rabbit.getName()).isEqualTo("Coquito");
        assertThat(rabbit.getUserId()).isEqualTo(userId);
        assertThat(rabbit.isActive()).isTrue();
    }

    @Test
    @DisplayName("nombre vacío lanza IllegalArgumentException")
    void nombreVacioFalla() {
        assertThatThrownBy(() ->
                new Rabbit(UUID.randomUUID(), "", UUID.randomUUID(), true, null)
        ).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("userId nulo lanza IllegalArgumentException")
    void userIdNuloFalla() {
        assertThatThrownBy(() ->
                new Rabbit(UUID.randomUUID(), "Coquito", null, true, null)
        ).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("withActive cambia solo el estado activo")
    void withActiveCambiaEstado() {
        Rabbit original = new Rabbit(UUID.randomUUID(), "Coquito", UUID.randomUUID(), true, Instant.now());
        Rabbit inactivo = original.withActive(false);

        assertThat(inactivo.isActive()).isFalse();
        assertThat(inactivo.getId()).isEqualTo(original.getId());
        assertThat(inactivo.getName()).isEqualTo(original.getName());
    }
}
