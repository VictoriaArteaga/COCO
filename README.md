# COCO — Cuaderno de Observación y Cuidado Oportuno

Aplicación Wear OS para observar y registrar hábitos de Coquito: alimentación, agua, sueño, juego y comportamiento. COCO es preventivo, no diagnostica ni reemplaza la valoración veterinaria.

## Alcance actual

Fundación de las semanas 1 y 2: Inicio, registro local de las cinco variables, confirmación háptica, opción para deshacer, gráficas simples de una variable, análisis breve de estados y resumen diario. Los registros quedan pendientes localmente para sincronización futura; el servicio remoto todavía no está conectado. La interfaz del reloj usa modo claro por defecto conforme al requisito del proyecto.

## Tecnologías y arquitectura

Kotlin, Android, Jetpack Compose, Wear Compose, Material 3, Room, Coroutines, StateFlow y MVVM con capas ligeras `presentation`, `domain`, `data` y `design`.

```text
smartwatch/app/src/main/java/com/coco/smartwatch/
├── data/local/       # Room, DAO y entidades
├── data/repository/  # Implementación del repositorio
├── design/           # Tokens y tema COCO claro
├── domain/model/     # Observaciones y variables
├── domain/repository/
├── domain/usecase/   # Registro, consulta y deshacer
└── presentation/     # ViewModel y experiencia Wear OS
```

## Ejecutar

Abre el repositorio en Android Studio con JDK 17 y Android SDK 36 instalados. Ejecuta la configuración `smartwatch.app` en un emulador Wear OS o un reloj. La instalación local de Gradle puede generar el wrapper desde Android Studio si no está incluido.

Pruebas unitarias: `gradle :smartwatch:app:testDebugUnitTest`.

## Estado

Semana 1: estructura Wear OS, design system claro, registro local Room y undo. Semana 2: selector de variables, tendencias sencillas, resumen y estados iniciales de análisis/sincronización offline. La sincronización real y el análisis con IA se reservan para fases posteriores.
