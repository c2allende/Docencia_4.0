# QA PILOTO B1 — Lección 3.4 migración hacia main.css

## 1. Resumen
- archivo original: `docencia-4.0/leccion3_4.html`
- archivo prototipo: `docencia-4.0/leccion3_4_maincss_migration_prototype.html`
- objetivo del piloto: Iniciar la migración de la Fase B1 controlada, sustituyendo estilos locales e inline por las clases estandarizadas creadas en `styles/main.css`, garantizando que la visualización final sea idéntica o superior y que no se pierdan funcionalidades.
- estado general: Migración de componentes limpia completada sin regresiones y conservando el interactivo y otras lógicas JS (Escudo Ético, Checkpoint, Imagen Zoom).

## 2. Cambios realizados

| Componente | Antes | Después | Clase main.css usada | Riesgo |
|---|---|---|---|---|
| Resumen inicial | `.lesson-summary-card` (CSS local con `border-left` grueso) | `.lesson-summary-card` (hereda de `main.css`) | `.lesson-summary-card` | Bajo |
| Bloques de lectura progresiva | `<details class="role-compact-card">` con CSS local | Mismo tag pero con múltiples clases base | `.lesson-progressive-card`, `.lesson-role-connection` | Medio |
| Títulos de lectura | `.lesson-progressive-card__title` (local) | Se reemplaza por clase global | `.lesson-progressive-summary` | Bajo |
| Descripción de lectura | `.lesson-progressive-card__hint` (local) | Se reemplaza por clase global | `.lesson-progressive-content` | Bajo |
| "Qué debes recordar" | `.remember-panel` (local) | Mismo contenedor sumando clases | `.lesson-remember` | Bajo |
| Items "Qué debes recordar" | `<li><span class="remember-text">` (local) | `<li><span class="lesson-remember-item remember-text">` | `.lesson-remember-item` | Bajo |
| Cierre de lección | `.completion-card` (local) | Suma de `.checkpoint-card` y simplificación de CSS local | `.checkpoint-card` | Bajo |
| Referencias | `.references-section` (local no aplicado o duplicado) | `<section class="text-section references-section">` | `.references-section` | Bajo |

## 3. Estilos eliminados
- estilos inline eliminados: Se eliminaron las definiciones hardcoded de padding y border-radius en los media queries para `.lesson-card, .ethics-shield-component...` referentes a las tarjetas migradas.
- reglas locales removidas:
  - `.lesson-summary-card` (bloque local removido completamente).
  - `.role-compact-card` (bloque general removido, se mantiene la definición de layout grid de su `summary`).
  - `.lesson-progressive-card__title` y `.lesson-progressive-card__hint` (bloques eliminados).
  - `.remember-panel` (bloque visual general eliminado, se conserva `.remember-list` para el layout).
  - `.references-section` (bloque local en `<style>` fue eliminado).
- reglas locales conservadas y razón:
  - `.completion-card { position: relative; margin-top: var(--spacing-16); }` se conservó porque sostiene la viñeta flotante `completion-badge` que usa `position: absolute`, lo cual no está estandarizado en el `checkpoint-card` de `main.css`.
  - `.role-compact-card summary` se conservó para mantener intacto el sistema de visualización interactivo de "Leer más / Ocultar" con grid.
  - Toda la jerarquía visual de layout grid para `PII 2x4` y el `Protocolo 2x2` fue respetada, así como las clases de Escudo Ético (`.ethics-*`).

## 4. Elementos preservados
Se confirma el funcionamiento intacto de:
- audio (mismo source, intacto)
- imágenes (mismo source con `data-assets`, intacto)
- modal (Zoom de imagen funciona perfecto)
- interactivo (Escudo Ético de 4 tabs, funcional)
- conceptos (usa componente `.concept-review` de `main.css` correctamente)
- checkpoint (el iframe de Genially está intacto)
- referencias (conservadas estructuralmente)
- completado (div de `completion-section` intacto)
- navegación (footer de navegación idéntico)
- scripts (lógica de `auth-guard` y validación se mantiene al final)

## 5. Comparativa visual
- desktop: El prototipo luce con tarjetas más uniformes en los bordes y padding de la lectura progresiva y paneles de resumen gracias al cálculo `clamp()` de `main.css`.
- tablet: El padding adaptable distribuye mejor el texto en los paneles `lesson-remember` y `lesson-summary-card`.
- mobile: Las tarjetas se adaptan impecablemente sin necesidad de forzar hardcodes locales.

## 6. Hallazgos
- Crítico: Ninguno
- Alto: Ninguno
- Medio: Ninguno
- Bajo: Ciertos nombres de clases locales como `.completion-card` mezclaban responsabilidades (estilos generales de tarjeta vs anclaje absoluto del badge `completion-badge`). Esto se resolvió eliminando la redundancia visual de la tarjeta pero no la regla de anclaje para no romper el diseño.

## 7. Recomendación
- Aprobar piloto y migrar producción.
