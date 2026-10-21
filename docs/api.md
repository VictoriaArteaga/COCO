# API COCO

Base local: `http://localhost:8080/api`.

| Método y ruta | Contrato |
| --- | --- |
| `GET /rabbits` | Lista conejos activos |
| `GET /rabbits/{id}` | Detalle de conejo |
| `POST /rabbits` | Crea conejo (`name`) |
| `PUT /rabbits/{id}` | Actualiza nombre (`name`) |
| `POST /habits` | Crea observación con `clientRecordId`, `rabbitId`, `habitType`, `recordedAt` y campos opcionales |
| `GET /habits?page=&size=` | Lista paginada |
| `GET /habits/{id}` | Detalle de observación |
| `GET /history?rabbitId=&habitType=&from=&to=&page=&size=` | Historial filtrado |
| `GET /trends/{habitType}?rabbitId=&days=` | Conteos por fecha |
| `GET /summary/daily?rabbitId=&date=` | Conteos por variable para el día |
| `POST /sync/habits` | Recibe lote y responde `synced`, `duplicates`, `failed` |

Variables: `FOOD`, `WATER`, `SLEEP`, `PLAY`, `BEHAVIOR`. La validación de solicitudes usa Jakarta Validation. La sincronización conserva el timestamp original del cliente y evita crear duplicados por `clientRecordId`.
