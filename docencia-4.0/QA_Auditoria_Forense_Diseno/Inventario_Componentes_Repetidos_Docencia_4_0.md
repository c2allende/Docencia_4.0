# INVENTARIO DE COMPONENTES REPETIDOS — DOCENCIA 4.0

| Componente | Páginas donde aparece | Clases actuales | Variaciones encontradas | Debe centralizarse en main.css | Severidad | Recomendación |
|------------|-----------------------|-----------------|-------------------------|--------------------------------|-----------|---------------|
| **Resumen inicial (Lección)** | Todas las lecciones | `.lesson-card`, `<p>` | Espaciados distintos, algunas usan negritas locales | Sí | Media | Crear `.lesson-summary-card` |
| **Objetivo / Propósito** | Lecciones y Actividades | `.lesson-card`, `.activity-card` | Títulos `H2` vs `H3`, márgenes inferiores variables | Sí | Alta | Crear `.lesson-objective-card` y estandarizar tipografía |
| **Bloques de lectura progresiva** | Lecciones | `<details>`, `<summary>` | Colores de fondo hardcoded o repetidos en `<style>` | Sí | Alta | Crear `.lesson-progressive-card` |
| **Qué debes recordar** | Lecciones | `.concept-review`, `.lesson-card` | Íconos distintos, bordes diferentes | Sí | Media | Crear `.lesson-remember` |
| **Conexión con rol docente** | Lecciones | `.lesson-card` | Títulos varían, uso de `style` inline para fondo | Sí | Media | Crear `.lesson-role-connection` |
| **Toolbox / Ejemplos prompt** | Lecciones (ej. 2.1, 2.3) | `.lesson-card`, `.diff-output` | Mucho CSS inline, clases exclusivas por archivo | Sí | Alta | Crear `.lesson-toolbox` |
| **Conceptos a repasar** | Todas las lecciones | `.concept-review` | Padding y márgenes definidos en `<style>` local | Sí | Baja | Consolidar `.concept-review` en `main.css` |
| **Meta alcanzada** | Lecciones | `.checkpoint-card`, `.lesson-card` | Alineación centrada vs izquierda | Sí | Baja | Crear `.lesson-meta-achieved` |
| **Checkpoint de saberes** | Lecciones | `.checkpoint-section` | Estilos del `iframe` embebido en HTML | Sí | Alta | Centralizar `.checkpoint-card` y `.checkpoint-iframe` |
| **Referencias** | Lecciones | `.references-section`, `.lesson-card` | En algunas páginas es parte del card, en otras es sección suelta | Sí | Media | Consolidar `.references-section` |
| **#completion-section** | Todas las páginas | `#completion-section`, `.btn-primary` | Márgenes distintos antes del botón | Sí | Baja | Crear `.completion-section-wrap` |
| **Introducción de módulo** | modulo1_intro, modulo2_intro, modulo3_intro | `.hero-section`, `H1` | `H1` forzado a 30px con inline style | Sí | Alta | Crear `.module-key-message` y `.module-route-card` |
| **Muro colaborativo / Padlet** | Actividades | `.activity-card`, `.padlet-cta` | Estilos de botón CTA repetidos en `<style>` | Sí | Media | Crear `.padlet-cta` y `.activity-steps` |
| **Foro dinámico** | Foros | `.forum-card`, `.alert` | Colores de alerta hardcoded (`#fff3cd`) | Sí | Alta | Crear `.forum-shell` y `.forum-purpose-card` |
| **Recursos y plantillas** | Recursos | `.resource-card`, `.btn` | Tarjetas con anchos inconsistentes | Sí | Media | Crear `.resource-section-card` y `.resource-bank-shell` |
