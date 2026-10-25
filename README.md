# COCO — Observa. Registra. Cuida.

COCO registra y consulta hábitos de conejos domésticos. No diagnostica ni reemplaza la valoración veterinaria.

## Arquitectura

- `backend/`: Java 17, Spring Boot 3, Spring Security, JWT HS256, JPA y Flyway. H2 es local; PostgreSQL se activa con el perfil `postgres`.
- `web/`: Next.js 15, TypeScript y Tailwind. Los JWT viven en cookies `HttpOnly`; las llamadas al backend pasan por Route Handlers del mismo origen.
- `smartwatch/`: Wear OS con Kotlin, Compose y Room offline-first. El usuario inicia sesión en el reloj y selecciona un conejo autorizado antes de sincronizar.

PostgreSQL conserva el esquema inicial en `backend/src/main/resources/db/migration/V1__esquema_inicial.sql` y crea resultados de análisis mediante `V2__create_analysis_results.sql`. H2 usa el esquema de entidades con `create-drop` para desarrollo y demostración.

## Inicio rápido

1. Configura `JWT_SECRET` con una cadena Base64 generada con `openssl rand -base64 32` y `JWT_EXPIRATION_SECONDS=3600`.
2. Define `GEMINI_API_KEY` en el entorno del proceso backend para habilitar análisis reales. En PowerShell, usa `$env:GEMINI_API_KEY='<tu clave>'` en la sesión actual; nunca guardes el valor en el repositorio. El backend puede iniciar sin la variable, pero los análisis con historial suficiente devolverán un error controlado hasta configurarla. Ejecuta desde `backend` con `.\mvnw.cmd spring-boot:run` (PowerShell) o `./mvnw spring-boot:run`.
3. Copia `web/.env.example` a `web/.env.local`, configura `COCO_API_URL=http://localhost:8080` y ejecuta `npm install` y `npm run dev` desde `web`.
4. Registra una cuenta en la web, crea un conejo desde el panel y luego inicia sesión en Wear OS con la misma cuenta para asociar el reloj.

Para PostgreSQL configura `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` y `SPRING_PROFILES_ACTIVE=postgres`. Usa credenciales propias del entorno; no las guardes en el repositorio.

## Rutas principales

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET/POST | `/api/rabbits` | JWT y propietario |
| GET/PUT | `/api/rabbits/{id}` | JWT y propietario |
| GET/POST | `/api/habits` | JWT y conejo autorizado |
| GET | `/api/history`, `/api/trends/{habitType}`, `/api/summary/daily` | JWT y datos del propietario |
| POST | `/api/sync/habits` | JWT, propietario e idempotencia por `clientRecordId` |
| POST | `/api/analysis/rabbit/{rabbitId}` | JWT y propietario del conejo |

## Análisis preventivo con Gemini

El navegador envía `POST /api/analysis/rabbit/{rabbitId}` al proxy same-origin de Next.js; el proxy agrega el JWT de sesión y Spring Boot verifica que el conejo pertenezca al usuario autenticado. Spring Boot resume hasta 200 registros recientes, incluye la línea base individual por días con observaciones y notas relevantes, solicita JSON estructurado a Gemini y valida cada campo antes de guardar la respuesta.

Cuando el historial tiene menos de 10 registros o cubre menos de 3 días distintos, el backend devuelve y persiste `LEARNING` sin llamar a Gemini. Los análisis se guardan en `analysis_results`; los factores se conservan como JSON en texto para compatibilidad con H2 y PostgreSQL. El análisis se ejecuta solo mediante el endpoint explícito, nunca al registrar o sincronizar hábitos.

Estados disponibles: `NORMAL`, `ATTENTION`, `HIGH_ATTENTION` y `LEARNING`. COCO es una herramienta de observación preventiva; no diagnostica ni reemplaza al veterinario. Si la conexión a Gemini falla, el backend devuelve un error controlado. En desarrollo, la web puede mostrar el resultado `MockAnalysisProvider` como respaldo; producción consume Spring Boot directamente. Wear OS mantiene su flujo offline-first y no llama a Gemini.

Para PostgreSQL, ejecuta con `SPRING_PROFILES_ACTIVE=postgres`; Flyway aplicará la migración V2. En H2, Hibernate crea el esquema de demostración sin depender de la API key.

Por defecto, el backend usa `gemini-3.8-flash`; configura `GEMINI_MODEL` para seleccionar otro modelo compatible con salida estructurada.

La solicitud no lleva body: el backend obtiene todos los datos registrados y deriva el usuario del JWT. Ejemplo: `POST /api/analysis/rabbit/550e8400-e29b-41d4-a716-446655440000` con `Authorization: Bearer <JWT>` y `Content-Type: application/json`. Para usarlo desde la web, configura `COCO_API_URL`; el navegador pasa por el proxy same-origin de Next.js.

## Pruebas

```powershell
cd backend
.\mvnw.cmd test
cd ..\web
npm run type-check
npm run build
cd ..
.\gradlew.bat :smartwatch:app:testDebugUnitTest
```

La configuración y ejemplos de autenticación, PostgreSQL y sincronización están en [docs/authentication-security-and-device-setup.md](docs/authentication-security-and-device-setup.md).




