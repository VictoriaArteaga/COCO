package com.coco.backend;

import com.coco.backend.domain.enums.HabitType;
import com.coco.backend.domain.enums.RecordStatus;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.HabitRecordEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.RabbitEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.entity.UserEntity;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.HabitRecordJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.RabbitJpaRepository;
import com.coco.backend.infrastructure.adapter.output.persistence.repository.UserJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class Phase2FunctionalIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired UserJpaRepository users;
    @Autowired RabbitJpaRepository rabbits;
    @Autowired HabitRecordJpaRepository records;
    @Autowired JdbcTemplate jdbc;
    @Autowired JwtEncoder jwtEncoder;

    @Test
    void trendsForAllRequestedTypesAndHistoryDateFilterUseStoredRows() throws Exception {
        UUID owner = createUser("trends");
        UUID rabbitId = createRabbit(owner);
        Instant now = Instant.now();
        for (HabitType type : List.of(HabitType.FOOD, HabitType.WATER, HabitType.SLEEP, HabitType.PLAY)) {
            saveRecord("phase2-" + UUID.randomUUID(), rabbitId, type, now);
        }
        saveRecord("phase2-old-" + UUID.randomUUID(), rabbitId, HabitType.FOOD, now.minusSeconds(4 * 86400L));

        String token = token(owner);
        for (HabitType type : List.of(HabitType.WATER, HabitType.SLEEP, HabitType.PLAY)) {
            mvc.perform(get("/api/trends/" + type).param("rabbitId", rabbitId.toString()).param("days", "14")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[13].count").value(1));
        }
        mvc.perform(get("/api/trends/FOOD").param("rabbitId", rabbitId.toString()).param("days", "14")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[13].count").value(1));

        Instant from = LocalDate.now(ZoneOffset.UTC).atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant to = from.plusSeconds(86400L);
        mvc.perform(get("/api/history").param("rabbitId", rabbitId.toString()).param("habitType", "FOOD")
                        .param("from", from.toString()).param("to", to.toString()).param("size", "50")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].habitType").value("FOOD"));
    }

    @Test
    void missingRabbitIdsAndCrossOwnerReadsAreRejected() throws Exception {
        UUID ownerA = createUser("owner-a");
        UUID ownerB = createUser("owner-b");
        UUID rabbitA = createRabbit(ownerA);
        UUID rabbitB = createRabbit(ownerB);
        HabitRecordEntity otherOwnerRecord = saveRecord("phase2-owner-b-" + UUID.randomUUID(), rabbitB, HabitType.FOOD, Instant.now());
        String tokenA = token(ownerA);
        String tokenB = token(ownerB);

        mvc.perform(post("/api/habits").header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"clientRecordId\":\"phase2-missing\",\"rabbitId\":\"" + UUID.randomUUID() + "\",\"habitType\":\"FOOD\",\"recordedAt\":\"" + Instant.now() + "\"}"))
                .andExpect(status().isNotFound());
        mvc.perform(post("/api/analysis/rabbit/" + UUID.randomUUID()).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/habits/" + otherOwnerRecord.getId()).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/history").param("rabbitId", rabbitB.toString()).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content.length()").value(0));
        mvc.perform(get("/api/trends/FOOD").param("rabbitId", rabbitB.toString()).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
        mvc.perform(post("/api/analysis/rabbit/" + rabbitB).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/habits/" + otherOwnerRecord.getId()).header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk());
        assertThat(rabbits.findByIdAndUserIdAndActiveTrue(rabbitA, ownerA)).isPresent();
    }

    @Test
    void duplicateSyncReturnsDuplicateWithoutRollingBackBatch() throws Exception {
        UUID owner = createUser("sync-duplicate");
        UUID rabbitId = createRabbit(owner);
        String clientId = "phase2-sync-" + UUID.randomUUID();
        saveRecord(clientId, rabbitId, HabitType.PLAY, Instant.now());
        String body = "{\"records\":[{\"clientRecordId\":\"" + clientId + "\",\"rabbitId\":\"" + rabbitId
                + "\",\"habitType\":\"PLAY\",\"value\":2,\"recordedAt\":\"" + Instant.now() + "\"}]}";

        mvc.perform(post("/api/sync/habits").header("Authorization", "Bearer " + token(owner))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.duplicates[0]").value(clientId))
                .andExpect(jsonPath("$.failed.length()").value(0));
        assertThat(jdbc.queryForObject("select count(*) from habit_records where client_record_id=?", Integer.class, clientId)).isEqualTo(1);
    }

    private UUID createUser(String prefix) {
        UserEntity user = users.saveAndFlush(new UserEntity(null, prefix + "-" + UUID.randomUUID() + "@example.test",
                prefix, "test-hash", true, Instant.now()));
        return user.getId();
    }

    private UUID createRabbit(UUID owner) {
        return rabbits.saveAndFlush(new RabbitEntity(null, "QA rabbit", owner, true, Instant.now())).getId();
    }

    private HabitRecordEntity saveRecord(String clientId, UUID rabbitId, HabitType type, Instant recordedAt) {
        return records.saveAndFlush(new HabitRecordEntity(null, clientId, rabbitId, type, 1.0, "phase2 test record",
                recordedAt, "WEB", RecordStatus.SYNCED, null, null));
    }

    private String token(UUID owner) {
        Instant now = Instant.now();
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder().issuer("coco").subject(owner.toString()).issuedAt(now)
                        .expiresAt(now.plusSeconds(600)).build())).getTokenValue();
    }
}
