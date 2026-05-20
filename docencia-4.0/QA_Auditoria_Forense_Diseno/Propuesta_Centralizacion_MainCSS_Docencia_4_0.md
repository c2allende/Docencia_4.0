# PROPUESTA DE CENTRALIZACIÓN EN main.css — DOCENCIA 4.0

## 1. Resumen
Se ha completado con éxito la creación del nuevo bloque maestro **"COMPONENTES REUTILIZABLES LMS"** al final del archivo `styles/main.css`. 
Este bloque estandariza la presentación de los patrones recurrentes en lecciones, introducciones, foros, actividades y recursos utilizando exclusivamente tokens preexistentes de diseño (colores, espaciados, tipografías y sombras). **No se ha alterado ningún archivo HTML en esta fase, ni se ha roto la cascada actual.**

## 2. Clases añadidas a main.css
El bloque inyectado define las siguientes familias de componentes:

- **1. Lecciones:** `.lesson-summary-card`, `.lesson-objective-card`, `.lesson-progressive-card`, `.lesson-progressive-summary`, `.lesson-progressive-content`, `.lesson-remember`, `.lesson-remember-item`, `.lesson-role-connection`, `.lesson-toolbox`, `.lesson-toolbox-summary`, `.lesson-media-card`, `.concept-review`, `.checkpoint-card`, `.checkpoint-iframe`, `.references-section`, `.completion-section-wrap`.
- **2. Introducciones de módulo:** `.module-intro-hero`, `.module-intro-title`, `.module-key-message`, `.module-reflection-card`, `.module-route-card`, `.module-objective-card`, `.module-outcomes-card`, `.module-research-connection`, `.module-role-transfer`, `.module-audio-card`, `.module-closing-card`, `.module-learning-route`.
- **3. Actividades:** `.activity-summary-card`, `.activity-purpose-card`, `.activity-objective-card`, `.activity-phase-card`, `.activity-tab-card`, `.activity-evidence-card`, `.activity-ethics-card`, `.activity-meta-grid`, `.activity-steps`, `.padlet-steps-list`, `.padlet-step-item`, `.padlet-cta`.
- **4. Foros:** `.forum-shell`, `.forum-intro-card`, `.forum-purpose-card`, `.forum-participation-card`, `.forum-reminder-card`, `.forum-dynamic-section`, `.forum-alert`, `.forum-alert-warning`, `.forum-guide-question`.
- **5. Recursos:** `.resource-bank-shell`, `.resource-summary-card`, `.resource-guidance-card`, `.resource-section-card`, `.resource-video-card`, `.resource-infographic-card`, `.professional-kit-card`, `.commitment-card`, `.resource-index`, `.bibliographic-resources`, `.bibliographic-resource`, `.professional-kit-grid`.

## 3. Componentes del inventario atendidos
Estas clases dan solución directa a todos los hallazgos del inventario:
- Estandarización de las tarjetas de contenido con `clamp(1.25rem, 3vw, 2rem)` para un padding responsive (`.lesson-summary-card`, etc.).
- Consolidación del contenedor del foro con anchos máximos consistentes (`.forum-shell`).
- Eliminación futura del color hardcoded `#fff3cd` mediante el uso de `var(--color-feedback-warning-container)` en `.forum-alert-warning`.
- Separación de los márgenes en los iframes (`.checkpoint-iframe`).
- Mejora de los encabezados de introducción que dependían de un `font-size: 1.5rem` inline (`.module-key-message`).

## 4. Componentes pendientes
Ningún componente visual repetido detectado en la Fase 2 ha quedado fuera de esta consolidación en CSS. Lo que queda pendiente es **la aplicación** de estas clases en los archivos HTML (Paso 2).

## 5. Páginas impactadas
**Actualmente: Ninguna.**
Al no haberse modificado los archivos HTML, la plataforma mantiene su aspecto original (aprobado por QA). Las clases están disponibles y dormidas en el archivo `main.css`.

En la fase de migración, se impactarán los **23 archivos del LMS**, permitiendo la eliminación drástica de bloques `<style>` y reglas inline.

## 6. Riesgos
- **Cascada y Especificidad:** Al aplicar estas clases en el HTML, es posible que algunas reglas antiguas alojadas en bloques `<style>` locales tengan mayor prioridad que las de `main.css` si no se eliminan.
- **Rompimiento de Layout:** Cambiar un `<div>` que antes no tenía padding a una clase `.lesson-summary-card` que sí lo tiene podría generar saltos de línea imprevistos. Se requiere validación atómica por cada tipo de página.

## 7. Recomendación de migración HTML por fases
Se recomienda seguir el orden de migración más seguro para evitar regresiones visuales. El avance será atómico:
1. **Fase B1 — Lecciones:** (10 archivos). El bloque más grande. Requiere atención especial a `.lesson-toolbox` y `.lesson-progressive-card`.
2. **Fase B2 — Actividades:** (4 archivos). Limpieza de listas, pasos y el botón de Padlet.
3. **Fase B3 — Foros:** (3 archivos). Reemplazo urgente de la alerta hardcoded.
4. **Fase B4 — Recursos:** (3 archivos). Implementar el contenedor `resource-bank-shell`.
5. **Fase B5 — Introducciones:** (3 archivos). Reemplazo del Hero actual y el ajuste tipográfico de H1.

## 8. Confirmación técnica
✅ Se modificó solo y exclusivamente `styles/main.css`.
✅ Se ha validado vía `git status` que no hay archivos HTML modificados.
✅ No se hizo deploy al entorno de staging ni producción.
✅ No se ejecutó `git add .` para retener el control del estado.
✅ No se alteraron los scripts (`forum-handler.js`).
✅ No se alteró Firebase.
✅ No se alteró la lógica de progreso.
