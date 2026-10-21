# Integración futura de base de datos

**Demo actual:** backend Spring Data JPA conectado a H2 en memoria (`create-drop`) y datos sembrados al iniciar. Se pierden al detener la aplicación. No se requiere PostgreSQL para desarrollar ni demostrar las pantallas.

**Perfil PostgreSQL opcional:** activar `SPRING_PROFILES_ACTIVE=postgres`, proporcionar `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`; Flyway aplica el esquema inicial.

**Siguiente frontera arquitectónica:** introducir contratos de repositorio de dominio para conejos y observaciones, usar un adaptador en memoria por defecto y mover JPA a un adaptador PostgreSQL. Actualmente algunos casos de uso y controladores dependen directamente de Spring Data JPA, así que no se debe afirmar que el reemplazo ya está desacoplado por completo.
