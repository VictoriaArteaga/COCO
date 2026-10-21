# COCO — Cuaderno de Observación y Cuidado Oportuno

**"Observa. Registra. Cuida."**

Mascota: **Coquito** 🐇

COCO es un sistema de monitoreo preventivo del bienestar de conejos domésticos. Permite registrar y consultar alimentación, agua, sueño, juego y comportamiento. COCO no diagnostica enfermedades, no realiza pronósticos veterinarios y no reemplaza al veterinario.

---

## Arquitectura general

```
               COCO
                │
      ┌─────────┴─────────┐
      │                   │
  SMARTWATCH             WEB
      │                   │
    Room               Next.js
      │                   │
  SyncManager         API Client
      │                   │
      └─────────┬─────────┘
                │
             BACKEND
                │
        Spring Boot REST
                │
            PostgreSQL
```

---

## Componentes del sistema

### Smartwatch (Wear OS)
- Kotlin, Jetpack Compose, Room, Coroutines, Retrofit
- Registro local de los 5 variables de hábitos
- Sincronización offline-first con el backend
- MVVM: `presentation → domain → data`

### Backend (Spring Boot)
- Java 17, Spring Boot 3, Spring Data JPA, Spring Security
- Arquitectura Clean/Hexagonal: `domain → application → infrastructure`
- PostgreSQL, Flyway para migraciones
- API REST: `/api/rabbits`, `/api/habits`, `/api/history`, `/api/trends`, `/api/summary/daily`, `/api/sync/habits`

### Web (Next.js)
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Design System con tokens COCO
- Atomic Design: átomos, moléculas, organismos
- Rutas: `/login`, `/dashboard`, `/history`, `/trends`, `/analysis`, `/profile`, `/reminders`, `/settings`, `/synchronization`

---

## Estructura de carpetas

```
COCO/
├── smartwatch/       # Aplicación Wear OS
├── backend/          # Spring Boot API
├── web/              # Next.js plataforma web
└── README.md
```

---

## Tecnologías

| Componente    | Tecnologías principales                                   |
|---------------|-----------------------------------------------------------|
| Smartwatch    | Kotlin, Compose, Room, Retrofit, OkHttp, Coroutines       |
| Backend       | Java 17, Spring Boot 3, JPA, PostgreSQL, Flyway, Security |
| Web           | Next.js 15, TypeScript, Tailwind CSS, Recharts            |

---

## Configuración local

### Backend

1. Instalar PostgreSQL y crear la base de datos `coco_db`.
2. Copiar `backend/.env.example` como `backend/.env` y rellenar las credenciales.
3. Ejecutar con Maven:

```bash
cd backend
./mvnw spring-boot:run
```

La primera ejecución aplica la migración Flyway automáticamente.

### Smartwatch

1. Abrir el proyecto en Android Studio con JDK 17 y Android SDK 36.
2. Configurar `BACKEND_URL` en el ambiente de build (por defecto `http://10.0.2.2:8080/` para emulador).
3. Ejecutar en un emulador Wear OS o dispositivo.

### Web

```bash
cd web
npm install
cp .env.example .env.local   # Editar con la URL del backend
npm run dev
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable              | Descripción                         |
|-----------------------|-------------------------------------|
| `DB_URL`              | URL JDBC de PostgreSQL              |
| `DB_USERNAME`         | Usuario de la base de datos         |
| `DB_PASSWORD`         | Contraseña de la base de datos      |
| `SERVER_PORT`         | Puerto del servidor (defecto: 8080) |
| `CORS_ALLOWED_ORIGINS`| Orígenes CORS permitidos            |

### Web (`web/.env.local`)

| Variable              | Descripción                         |
|-----------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend                |

### Smartwatch (build)

| Variable      | Descripción                                  |
|---------------|----------------------------------------------|
| `BACKEND_URL` | URL del backend (`BuildConfig.BACKEND_URL`)  |
| `RABBIT_ID`   | ID del conejo (placeholder hasta semana 5)   |

---

## Pruebas

### Backend

```bash
cd backend
./mvnw test
```

### Smartwatch

```bash
./gradlew :smartwatch:app:testDebugUnitTest
```

---

## Endpoints REST

| Método | Ruta                   | Descripción                              |
|--------|------------------------|------------------------------------------|
| GET    | /api/rabbits           | Lista de conejos activos                 |
| GET    | /api/rabbits/{id}      | Detalle de un conejo                     |
| POST   | /api/rabbits           | Crear conejo                             |
| PUT    | /api/rabbits/{id}      | Actualizar nombre del conejo             |
| POST   | /api/habits            | Registrar hábito individual              |
| GET    | /api/habits            | Lista paginada de hábitos                |
| GET    | /api/habits/{id}       | Detalle de un hábito                     |
| GET    | /api/history           | Historial con filtros (rabbit, tipo, fecha) |
| GET    | /api/trends/{tipo}     | Tendencias por tipo de hábito            |
| GET    | /api/summary/daily     | Resumen diario                           |
| POST   | /api/sync/habits       | Sincronización en lote desde smartwatch  |

---

## Progreso por semanas

| Semana | Estado | Descripción                                              |
|--------|--------|----------------------------------------------------------|
| 1      | ✅      | Estructura Wear OS, Room, registro local, design system  |
| 2      | ✅      | Tendencias, resumen, análisis, estados de sync           |
| 3      | ✅      | Backend Spring Boot + PostgreSQL, arquitectura Clean     |
| 4      | ✅      | Sincronización smartwatch↔backend, base Next.js         |
| 5      | 🔜     | Autenticación JWT, dashboard completo, historial web     |
| 6      | 🔜     | Gráficas Recharts, análisis explicable                   |

---

## Modelo de datos

```
User
  └── Rabbit
        └── HabitRecord (FOOD | WATER | SLEEP | PLAY | BEHAVIOR)
```

HabitRecord incluye `clientRecordId` (UUID generado en el cliente) como clave de idempotencia para prevenir duplicados durante la sincronización.

---

## Notas

- COCO **no diagnostica enfermedades**.
- COCO **no reemplaza la valoración veterinaria**.
- La IA se integrará en fases posteriores como herramienta de análisis explicable.
