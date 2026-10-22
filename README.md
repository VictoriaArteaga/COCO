# COCO — Observa. Registra. Cuida.

COCO registra y consulta hábitos de conejos domésticos. No diagnostica ni reemplaza la valoración veterinaria.

## Arquitectura

- `backend/`: Java 17, Spring Boot 3, Spring Security, JWT HS256, JPA y Flyway. H2 es local; PostgreSQL se activa con el perfil `postgres`.
- `web/`: Next.js 15, TypeScript y Tailwind. Los JWT viven en cookies `HttpOnly`; las llamadas al backend pasan por Route Handlers del mismo origen.
- `smartwatch/`: Wear OS con Kotlin, Compose y Room offline-first. El usuario inicia sesión en el reloj y selecciona un conejo autorizado antes de sincronizar.

El esquema de base de datos inicial se conserva en `backend/src/main/resources/db/migration/V1__esquema_inicial.sql`. No se añade migración: las tablas actuales ya contienen los datos requeridos por autenticación y propiedad.

## Inicio rápido

1. Configura `JWT_SECRET` con una cadena Base64 generada con `openssl rand -base64 32` y `JWT_EXPIRATION_SECONDS=3600`.
2. Ejecuta el backend desde `backend` con `.\mvnw.cmd spring-boot:run` (PowerShell) o `./mvnw spring-boot:run`.
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
