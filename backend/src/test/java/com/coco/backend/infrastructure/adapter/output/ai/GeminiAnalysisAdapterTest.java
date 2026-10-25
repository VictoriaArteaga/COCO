package com.coco.backend.infrastructure.adapter.output.ai;

import com.coco.backend.infrastructure.exception.AiProviderException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import java.net.SocketTimeoutException;
import java.util.List;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class GeminiAnalysisAdapterTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final String uri = "https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent";
    private final String valid = "{\"status\":\"NORMAL\",\"anomalyDetected\":false,\"factors\":[\"Stable recorded pattern\"],\"explanation\":\"The recent observations resemble this rabbit's recorded history.\",\"recommendation\":\"Continue recording observations.\",\"requiresVeterinaryAttention\":false}";

    @Test
    void acceptsValidStructuredResponseAndSendsKeyInHeader() throws Exception {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(uri)).andExpect(method(HttpMethod.POST)).andExpect(header("x-goog-api-key", "test-only-key"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(org.hamcrest.Matchers.allOf(org.hamcrest.Matchers.containsString("responseSchema"),
                        org.hamcrest.Matchers.containsString("does not diagnose"), org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("test-only-key")))))
                .andRespond(withSuccess(wrap(valid), MediaType.APPLICATION_JSON));
        var outcome = new GeminiAnalysisAdapter(mapper, "test-only-key", "test-model", builder).analyze(Map.of("rabbit", "Nube"));
        assertThat(outcome.status()).isEqualTo("NORMAL");
        assertThat(outcome.factors()).containsExactly("Stable recorded pattern");
        server.verify();
    }

    @Test
    void rejectsSemanticallyInvalidStructuredResponse() throws Exception {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        String invalid = valid.replace("NORMAL", "DIAGNOSIS");
        server.expect(requestTo(uri)).andRespond(withSuccess(wrap(invalid), MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> new GeminiAnalysisAdapter(mapper, "test-only-key", "test-model", builder)
                .analyze(Map.of())).isInstanceOf(AiProviderException.class).hasMessage("Gemini returned an invalid analysis structure");
        server.verify();
    }

    @Test
    void convertsProviderUnavailableToSanitizedError() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(uri)).andRespond(withServiceUnavailable());
        assertThatThrownBy(() -> new GeminiAnalysisAdapter(mapper, "test-only-key", "test-model", builder)
                .analyze(Map.of())).isInstanceOf(AiProviderException.class)
                .hasMessage("Gemini analysis is temporarily unavailable").hasNoCause();
        server.verify();
    }

    @Test
    void convertsTimeoutToSanitizedError() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(uri)).andRespond(withException(new SocketTimeoutException("test timeout")));
        assertThatThrownBy(() -> new GeminiAnalysisAdapter(mapper, "test-only-key", "test-model", builder)
                .analyze(Map.of())).isInstanceOf(AiProviderException.class)
                .hasMessage("Gemini analysis is temporarily unavailable").hasNoCause();
        server.verify();
    }

    @Test
    void rejectsMissingApiKeyWithoutSendingRequest() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        assertThatThrownBy(() -> new GeminiAnalysisAdapter(mapper, "", "test-model", builder)
                .analyze(Map.of())).isInstanceOf(AiProviderException.class).hasMessage("Gemini is not configured");
        server.verify();
    }

    @Test
    void rejectsMalformedJsonWithoutReturningItToCaller() throws Exception {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(uri)).andRespond(withSuccess(wrap("{not-json"), MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> new GeminiAnalysisAdapter(mapper, "test-only-key", "test-model", builder)
                .analyze(Map.of())).isInstanceOf(AiProviderException.class).hasMessage("Gemini returned an invalid analysis");
        server.verify();
    }
    private String wrap(String generated) throws Exception {
        return mapper.writeValueAsString(Map.of("candidates", List.of(Map.of("content", Map.of("parts", List.of(Map.of("text", generated)))))));
    }
}


