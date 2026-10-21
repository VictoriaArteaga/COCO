# COCO — Cuaderno de Observación y Cuidado Oportuno

COCO ayuda a registrar y consultar hábitos de conejos domésticos: alimentación, agua, sueño, juego y comportamiento. No diagnostica ni reemplaza la valoración veterinaria.

## Arquitectura

```text
Wear OS (Kotlin + Room) ── sincronización REST ── Spring Boot API ── H2 efímero por defecto
                                                   └─ PostgreSQL opcional (perfil postgres)
Next.js App Router ── repositorios demo locales; API client preparado para backend
Análisis web ── AnalysisService ── AnalysisProvider ── MockAnalysisProvider
```

La interfaz web no conoce proveedores de análisis ni detalles de persistencia. El análisis actual es una observación demo, no IA. El backend arranca localmente con almacenamiento H2 en memoria y datos de ejemplo; al detenerlo, esos datos desaparecen. PostgreSQL permanece como perfil opcional de desarrollo futuro.

## Estructura

- `smartwatch/`: app Wear OS, Room, casos de uso, UI Compose y sincronización.
- `backend/`: API Java 17 / Spring Boot 3, controladores REST, casos de uso, DTOs y adaptador JPA.
- `web/`: Next.js 15 App Router, TypeScript, Tailwind y Recharts.
- `docs/`: arquitectura, API, design system y fronteras futuras de IA y datos.

## Ejecutar

### Web

```bash
cd web
npm install
npm run dev
```

La web usa datos locales demo por defecto. Copia `web/.env.example` a `.env.local` solo si necesitas definir `NEXT_PUBLIC_API_URL` para llamadas al backend.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

No requiere variables para iniciar; usa H2 efímero y carga Coquito con observaciones demo. Ejecuta pruebas con `./mvnw test`.

Perfil PostgreSQL opcional (no requerido por la demo): copia `backend/.env.example` a tu entorno, configura `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`, y activa `SPRING_PROFILES_ACTIVE=postgres`.

### Smartwatch

Abre el proyecto en Android Studio con JDK 17 y el SDK indicado por `smartwatch/app/build.gradle.kts`. Ejecuta en un emulador Wear OS. La URL de backend se configura en build y para emulador Android suele usar `http://10.0.2.2:8080/`.

## Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| GET/POST | `/api/rabbits` | Consultar y crear conejos |
| GET | `/api/rabbits/{id}` | Consultar conejo |
| PUT | `/api/rabbits/{id}` | Actualizar nombre |
| GET/POST | `/api/habits` | Listar y registrar hábitos |
| GET | `/api/habits/{id}` | Consultar registro |
| GET | `/api/history` | Historial filtrado y paginado |
| GET | `/api/trends/{habitType}` | Conteos diarios |
| GET | `/api/summary/daily` | Resumen diario |
| POST | `/api/sync/habits` | Sincronización idempotente del reloj |

## Configuración y futuras integraciones

No hay claves ni credenciales en el repositorio. Los ejemplos están en `web/.env.example` y `backend/.env.example`. La capa de análisis actual es `MockAnalysisProvider`; el punto futuro para IA está documentado en [docs/future-ai.md](docs/future-ai.md). La configuración de persistencia actual usa H2 efímero o PostgreSQL por perfil; las decisiones para una sustitución por repositorios de dominio se describen en [docs/future-database.md](docs/future-database.md).

## Verificación

```bash
cd web && npm run type-check && npm run build
cd backend && ./mvnw test
./gradlew :smartwatch:app:testDebugUnitTest
```
