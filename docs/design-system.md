# Design System COCO

## Variables oficiales

| Hábito | Color |
| --- | --- |
| Alimentación | `#5B8E69` |
| Agua | `#4387A8` |
| Sueño | `#70659A` |
| Juego | `#C4778C` |
| Comportamiento | `#C87945` |

Los tokens de superficie, marca y estado semántico están en `web/app/globals.css` y `web/tailwind.config.ts`; las etiquetas de variables se centralizan en `web/types/index.ts`. Componentes reutilizables: `components/atoms`, `components/molecules` y `components/organisms`.

La web usa sidebar adaptable, tablas y gráficos amplios. Los controles tienen etiquetas y foco visible; los estados no dependen únicamente del color. En pantallas estrechas la navegación se distribuye en varias filas y el contenido conserva scroll vertical.
