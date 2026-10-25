package com.coco.backend;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.UserEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.AnalysisResultJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.UserJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.time.Instant;
import java.util.UUID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class RabbitAnalysisIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired UserJpaRepository users;
    @Autowired RabbitJpaRepository rabbits;
    @Autowired HabitRecordJpaRepository records;
    @Autowired AnalysisResultJpaRepository analyses;
    @Autowired JwtEncoder jwtEncoder;

    @Test
    void endpointRequiresAuthentication() throws Exception {
        mvc.perform(post("/api/analysis/rabbit/" + UUID.randomUUID())).andExpect(status().isUnauthorized());
    }

    @Test
    void malformedRabbitIdReturnsBadRequest() throws Exception {
        mvc.perform(post("/api/analysis/rabbit/not-a-uuid").header("Authorization", "Bearer " + token(UUID.randomUUID())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void insufficientHistoryReturnsLearningAndPersistsIt() throws Exception {
        UUID owner = createUser("analysis");
        UUID rabbitId = createRabbit(owner);
        for (int i = 0; i < 2; i++) records.save(new HabitRecordEntity(null,
                "analysis-record-" + UUID.randomUUID(), rabbitId, HabitType.FOOD, 10.0, null,
                Instant.now().minusSeconds(i * 86400L), "WEB", RecordStatus.SYNCED, null, null));
        mvc.perform(post("/api/analysis/rabbit/" + rabbitId).header("Authorization", "Bearer " + token(owner)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("LEARNING"))
                .andExpect(jsonPath("$.anomalyDetected").value(false))
                .andExpect(jsonPath("$.requiresVeterinaryAttention").value(false))
                .andExpect(jsonPath("$.factors[0]").isNotEmpty());
        assertThat(analyses.findAll().stream().anyMatch(a -> a.getRabbitId().equals(rabbitId))).isTrue();
    }

    @Test
    void anotherUsersRabbitIsNotFound() throws Exception {
        UUID owner = createUser("owner");
        UUID other = createUser("other");
        UUID rabbitId = createRabbit(owner);
        mvc.perform(post("/api/analysis/rabbit/" + rabbitId).header("Authorization", "Bearer " + token(other)))
                .andExpect(status().isNotFound());
    }

    private UUID createUser(String prefix) {
        UserEntity user = users.saveAndFlush(new UserEntity(null, prefix + "-" + UUID.randomUUID() + "@example.com",
                prefix, "hash", true, Instant.now()));
        return user.getId();
    }
    private UUID createRabbit(UUID owner) {
        RabbitEntity rabbit = rabbits.saveAndFlush(new RabbitEntity(null, "Nube", owner, true, Instant.now()));
        assertThat(rabbits.findByIdAndUserIdAndActiveTrue(rabbit.getId(), owner)).isPresent();
        return rabbit.getId();
    }
    private String token(UUID userId) {
        Instant now = Instant.now();
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder().issuer("coco").subject(userId.toString()).issuedAt(now).expiresAt(now.plusSeconds(600)).build())).getTokenValue();
    }
}



