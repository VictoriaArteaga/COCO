package com.coco.backend.infrastructure.config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {
    @Bean
    SecretKey jwtSecretKey(@Value("${coco.jwt.secret}") String secret) {
        byte[] bytes;
        try { bytes = Base64.getDecoder().decode(secret); }
        catch (IllegalArgumentException e) { throw new IllegalStateException("JWT_SECRET must be Base64", e); }
        if (bytes.length < 32) throw new IllegalStateException("JWT_SECRET must decode to at least 32 bytes");
        return new SecretKeySpec(bytes, "HmacSHA256");
    }
    @Bean JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        OctetSequenceKey signingKey = new OctetSequenceKey.Builder(jwtSecretKey.getEncoded())
                .keyID("coco-hs256").algorithm(JWSAlgorithm.HS256).build();
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(signingKey)));
    }
    @Bean JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtSecretKey).macAlgorithm(MacAlgorithm.HS256).build();
        OAuth2TokenValidator<Jwt> issuerAndTime = JwtValidators.createDefaultWithIssuer("coco");
        OAuth2TokenValidator<Jwt> requiredClaims = jwt -> {
            try { java.util.UUID.fromString(jwt.getSubject()); return OAuth2TokenValidatorResult.success(); }
            catch (RuntimeException ex) { return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid subject", null)); }
        };
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(issuerAndTime, requiredClaims));
        return decoder;
    }
}
