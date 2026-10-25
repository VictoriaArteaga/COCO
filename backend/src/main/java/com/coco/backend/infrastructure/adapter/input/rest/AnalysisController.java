package com.coco.backend.infrastructure.adapter.input.rest;

import com.coco.backend.application.dto.response.RabbitAnalysisResponse;
import com.coco.backend.application.service.RabbitAnalysisService;
import com.coco.backend.domain.exception.ResourceNotFoundException;
import com.coco.backend.infrastructure.exception.AiProviderException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    private final RabbitAnalysisService service;
    public AnalysisController(RabbitAnalysisService service) { this.service = service; }

    @PostMapping("/rabbit/{rabbitId}")
    public RabbitAnalysisResponse analyze(@PathVariable UUID rabbitId, @AuthenticationPrincipal Jwt jwt) {
        UUID userId;
        try { userId = UUID.fromString(jwt.getSubject()); }
        catch (RuntimeException ex) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida"); }
        return service.analyze(rabbitId, userId);
    }
}
