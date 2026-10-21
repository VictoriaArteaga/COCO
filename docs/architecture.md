# Arquitectura COCO

## Componentes

- **Wear OS:** Kotlin, Jetpack Compose, Room y sincronización offline-first.
- **Backend:** Spring Boot REST, Java 17, casos de uso y adaptadores JPA. El perfil local usa H2 en memoria y carga datos de demostración; el perfil `postgres` habilita PostgreSQL y Flyway.
- **Web:** Next.js 15 App Router, TypeScript, Tailwind y Recharts. La navegación y las vistas de consulta profunda son propias de escritorio y responsive.
- **Análisis:** la UI consume `AnalysisService`, que depende de `AnalysisProvider`; el proveedor conectado es `MockAnalysisProvider`.

## Flujo

El reloj conserva registros localmente y envía lotes con `clientRecordId` como clave idempotente. El backend devuelve resultados sincronizados, duplicados o fallidos. La web funciona con repositorios demo locales y mantiene un cliente HTTP para el backend.

## Fronteras actuales

Los mocks web están centralizados en `web/lib/mock`. La capa `web/services` ofrece contratos de repositorio y análisis. El backend aún usa Spring Data JPA en los casos de uso y controladores; H2 hace posible la demo sin un servicio PostgreSQL, pero una futura sustitución completa por `InMemoryRepository` requiere terminar de invertir esas dependencias.
