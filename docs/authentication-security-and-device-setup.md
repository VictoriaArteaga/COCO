# COCO: autenticación, seguridad y conexión de dispositivos

## Arquitectura

- Spring Boot valida cuentas BCrypt y emite JWT HS256 de corta duración.
- La API deriva la identidad del `sub` del JWT. Las consultas de conejos y registros quedan limitadas al propietario.
- Next.js usa Route Handlers como proxy de la API. El navegador recibe una cookie `HttpOnly`, `SameSite=Lax`; en producción la cookie también requiere HTTPS (`Secure`). El JWT no se expone a JavaScript ni se guarda en `localStorage`.
- El middleware comprueba la sesión consultando `GET /api/auth/me`, de modo que la API sigue siendo la autoridad sobre firma, expiración y estado activo de la cuenta.
- Wear OS conserva la cola offline en Room. Guarda token y conejo seleccionado mediante Android Keystore y envía el token con `Authorization: Bearer`.
- `V1__esquema_inicial.sql` se mantiene intacta. No se necesita una migración para autenticación: la tabla `users` ya contiene `password_hash`, `active` y correo único.

## Variables de entorno

Backend:

```text
SPRING_PROFILES_ACTIVE=postgres
DB_URL=jdbc:postgresql://<host>:5432/<database>
DB_USERNAME=<usuario>
DB_PASSWORD=<secreto>
JWT_SECRET=<Base64 de 32 bytes aleatorios como mínimo>
JWT_EXPIRATION_SECONDS=3600
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Genera una clave de desarrollo con `openssl rand -base64 32`. Configura una clave distinta para cada entorno. No uses el ejemplo ficticio de `.env.example` en producción. La aplicación valida que el secreto Base64 decodifique a 32 bytes y que la duración esté entre 60 y 86400 segundos.

Web (`web/.env.local`):

```text
COCO_API_URL=http://localhost:8080
```

Esta variable es de servidor; no la prefijes con `NEXT_PUBLIC_`.

Wear OS: establece `BACKEND_URL` al compilar. El emulador Android normalmente usa `http://10.0.2.2:8080/`; un reloj físico debe alcanzar la dirección HTTPS o IP local del backend. El tráfico HTTP solo está habilitado en builds `debug`.

## Ejecutar

Backend, con H2 efímero:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Para persistencia PostgreSQL configura las variables anteriores y activa el perfil `postgres`. Flyway aplica las migraciones habilitadas en ese perfil; V1 no se modifica.

Web:

```powershell
cd web
npm install
npm run dev
```

Smartwatch: abre el proyecto en Android Studio con JDK 17 o 21 y un SDK Wear OS compatible.

## Endpoints

- `POST /api/auth/register`: `{ "displayName": "Ana", "email": "ana@example.test", "password": "clave-ficticia-123" }`.
- `POST /api/auth/login`: `{ "email": "ana@example.test", "password": "clave-ficticia-123" }`.
- `GET /api/auth/me`: valida el bearer token y devuelve el perfil público mínimo.
- Las rutas de conejos, hábitos, historial, tendencias, resumen y sincronización requieren JWT.
- Registro devuelve `201`; un correo repetido devuelve `409`. Login devuelve `401` con un mensaje genérico ante credenciales erróneas o cuenta inactiva.

Ejemplo con datos ficticios:

```powershell
$body = @{ displayName = 'Ana'; email = 'ana@example.test'; password = 'clave-ficticia-123' } | ConvertTo-Json
$session = Invoke-RestMethod http://localhost:8080/api/auth/register -Method Post -ContentType 'application/json' -Body $body
$headers = @{ Authorization = "Bearer $($session.token)" }
$rabbit = Invoke-RestMethod http://localhost:8080/api/rabbits -Method Post -Headers $headers -ContentType 'application/json' -Body (@{ name = 'Nube' } | ConvertTo-Json)
$habit = @{ clientRecordId = [guid]::NewGuid().ToString(); rabbitId = $rabbit.id; habitType = 'FOOD'; value = 25; recordedAt = [DateTime]::UtcNow.ToString('o'); source = 'WEB' } | ConvertTo-Json
Invoke-RestMethod http://localhost:8080/api/habits -Method Post -Headers $headers -ContentType 'application/json' -Body $habit
```

No registres el token completo en una consola compartida. Para verificar la persistencia, consulta `users`, `rabbits` y `habit_records` en el proyecto PostgreSQL configurado, sin copiar credenciales a comandos o documentación.

## Web y smartwatch

Regístrate e inicia sesión en la web, crea un conejo desde el panel y, en Wear OS, inicia sesión con la misma cuenta y selecciona ese conejo. El reloj conserva el identificador del registro local durante los reintentos. Un `401` no elimina los registros: reautentica el reloj y vuelve a sincronizar. El reloj conserva el conejo asociado al cerrar sesión y solo permite cambiarlo si la cola local no tiene registros pendientes; así no reasigna observaciones históricas durante un reintento.

La cookie expira en una hora, de acuerdo con el valor JWT predeterminado. El frontend no emite tokens, solo guarda la respuesta del backend en cookie. La API proxy web valida el origen en solicitudes que cambian datos; `SameSite=Lax` complementa la protección CSRF.

## Comprobaciones

```powershell
cd backend
.\mvnw.cmd test
cd ..\web
npm run type-check
npm run build
cd ..
.\gradlew.bat :smartwatch:app:testDebugUnitTest
```

Para PostgreSQL de prueba usa una base de datos separada; no apuntes pruebas destructivas a Supabase de producción. H2 mantiene las pruebas locales.

## Limitaciones conocidas

- La cola offline de Room solo se consulta en el reloj, no desde el servidor web.
- La web muestra resúmenes de hábitos y creación de conejo; las otras pantallas que aún no tienen operaciones backend mantienen sus datos de demostración identificados en la interfaz o sus proveedores.
- La sincronización procesa cada registro de forma aislada; los fallos por elemento permanecen pendientes para reintento.
