# Design System COCO

## Variables oficiales

| Hábito | Color |
| --- | --- |
| Alimentación | `#0B8A72` |
| Agua | `#2A78AE` |
| Sueño | `#6B4C9A` |
| Juego | `#D0406A` |
| Comportamiento | `#B85F0E` |

Los tokens de superficie, marca y estado semántico están en `web/app/globals.css` y `web/tailwind.config.ts`; las etiquetas de variables se centralizan en `web/types/index.ts`. Componentes reutilizables: `components/atoms`, `components/molecules` y `components/organisms`.

La web usa sidebar adaptable, tablas y gráficos amplios. Los controles tienen etiquetas y foco visible; los estados no dependen únicamente del color. En pantallas estrechas la navegación se distribuye en varias filas y el contenido conserva scroll vertical.
