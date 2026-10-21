package com.coco.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Verifica que el contexto de Spring Boot carga correctamente con H2.
 */
@SpringBootTest
@ActiveProfiles("test")
class CocoApplicationTests {

    @Test
    void contextLoads() {
        // Si el contexto carga sin excepciones, el test pasa
    }
}
