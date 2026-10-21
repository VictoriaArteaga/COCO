# COCO Web

Plataforma web del sistema COCO — Cuaderno de Observación y Cuidado Oportuno.

## Tecnologías

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (preparado para semana 5)

## Estructura

```
web/
├── app/              # App Router — rutas y layouts
├── components/       # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── features/         # Lógica por funcionalidad (semana 5+)
├── lib/
│   ├── api/          # API client para el backend
│   ├── config/       # Variables de configuración
│   ├── mock/         # Datos mock de semana 4 (eliminar en semana 5)
│   └── utils/
└── types/            # Tipos TypeScript compartidos
```

## Variables de entorno

Copia `.env.example` como `.env.local` y configura:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Ejecución

```bash
npm install
npm run dev
```

## Verificación TypeScript

```bash
npm run type-check
```
