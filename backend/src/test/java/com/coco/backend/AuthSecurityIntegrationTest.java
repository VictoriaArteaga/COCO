package com.coco.backend;

import com.coco.backend.infrastructure.adapter.output.persistence.repository.UserJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthSecurityIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired UserJpaRepository users;
    @Autowired JwtEncoder jwtEncoder;

    @Test
    void registerHashesPasswordAndIssuesToken() throws Exception {
        String json = "{\"displayName\":\"Ana\",\"email\":\"Ana@Example.com\",\"password\":\"password123\"}";
        String response = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("ana@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist()).andReturn().getResponse().getContentAsString();
        String token = com.fasterxml.jackson.databind.json.JsonMapper.builder().build().readTree(response).get("token").asText();
        String hash = users.findByEmail("ana@example.com").orElseThrow().getPasswordHash();
        assertThat(hash).startsWith("$2").isNotEqualTo("password123");
        mvc.perform(get("/api/rabbits")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/rabbits").header("Authorization", "Bearer " + token)).andExpect(status().isOk());
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value("ana@example.com"));
        mvc.perform(get("/api/rabbits").header("Authorization", "Bearer " + token + "x")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/rabbits").header("Authorization", "Bearer not.a.jwt")).andExpect(status().isUnauthorized());
        Instant past = Instant.now().minusSeconds(7200);
        String expired = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder().issuer("coco").subject(UUID.randomUUID().toString()).issuedAt(past).expiresAt(past.plusSeconds(60)).build())).getTokenValue();
        mvc.perform(get("/api/rabbits").header("Authorization", "Bearer " + expired)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ana@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void duplicateRegistrationAndInvalidLoginAreRejected() throws Exception {
        String body = "{\"displayName\":\"Ana\",\"email\":\"duplicate@example.com\",\"password\":\"password123\"}";
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isCreated());
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isConflict());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"duplicate@example.com\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"displayName\":\"\",\"email\":\"bad\",\"password\":\"short\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rabbitOwnershipIsEnforcedForReadsUpdatesAndHabitCreation() throws Exception {
        String ownerToken = register("owner@example.com");
        String otherToken = register("other@example.com");
        String rabbit = mvc.perform(post("/api/rabbits").header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Nube\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String rabbitId = com.fasterxml.jackson.databind.json.JsonMapper.builder().build().readTree(rabbit).get("id").asText();

        mvc.perform(get("/api/rabbits/" + rabbitId).header("Authorization", "Bearer " + otherToken)).andExpect(status().isNotFound());
        mvc.perform(put("/api/rabbits/" + rabbitId).header("Authorization", "Bearer " + otherToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Ajeno\"}")).andExpect(status().isNotFound());
        mvc.perform(post("/api/habits").header("Authorization", "Bearer " + otherToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"clientRecordId\":\"foreign-record-1\",\"rabbitId\":\"" + rabbitId + "\",\"habitType\":\"FOOD\",\"recordedAt\":\"2026-10-21T10:00:00Z\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void inactiveAccountsCannotLogIn() throws Exception {
        register("inactive@example.com");
        var user = users.findByEmail("inactive@example.com").orElseThrow();
        user.setActive(false);
        users.save(user);
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"inactive@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isUnauthorized());
    }

    private String register(String email) throws Exception {
        String body = "{\"displayName\":\"Test\",\"email\":\"" + email + "\",\"password\":\"password123\"}";
        String response = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return com.fasterxml.jackson.databind.json.JsonMapper.builder().build().readTree(response).get("token").asText();
    }
}
