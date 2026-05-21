# QA Fase B1-A — Calibración Visual: "Qué debes recordar"

## 1. Problema Detectado
Durante la inspección del piloto B1, se evidenció que la clase `.lesson-remember` fue agrupada erróneamente en `main.css` junto a un bloque de tarjetas genéricas que imponen fondo blanco (`var(--color-background-surface)`). Esto ocasionó una regresión visual en la página `leccion3_4.html`, perdiendo el patrón de diseño original aprobado que establece un fondo azul/gris suave con tarjetas internas blancas para cada ítem.

## 2. Causa Raíz
La regla CSS en `main.css` compartía un selector múltiple (junto a `.lesson-summary-card`, `.lesson-objective-card`, etc.), forzando a `.lesson-remember` a heredar propiedades base que no coinciden con su naturaleza de panel agrupador con contraste.

## 3. Cambios Realizados en main.css
- **Desvinculación:** Se eliminó el selector `.lesson-remember` del bloque genérico.
- **Definición Específica:** Se añadió una nueva regla al final de la sección "DOCENCIA 4.0 - COMPONENTES REUTILIZABLES LMS" que define correctamente el componente siguiendo la metodología BEM:
  - `.lesson-remember`: contenedor con fondo suave (`var(--color-background-surface-low)`).
  - `.lesson-remember__list`: grilla de elementos sin list-style.
  - `.lesson-remember__item`: tarjetas internas blancas (`var(--color-background-surface)`).
  - `.lesson-remember__check`: color verde/cyan para el check.
- **Compatibilidad Temporal:** Se establecieron reglas vacías (`.remember-panel`, `.remember-card`, `.lesson-remember-card`) listas para alojar retrocompatibilidad si es necesario, sin forzar migraciones en otras páginas.

## 4. Comparación con leccion3_4.html (Baseline vs Prototipo)
- **Fondo:** El prototipo recupera exitosamente el tono azul/gris suave del contenedor principal.
- **Ítems:** Las tarjetas de la lista recuperan su fondo blanco, bordes redondeados y separación (gap), mejorando drásticamente la legibilidad frente al fondo suave.
- **Iconos:** Los checks vuelven a lucir el color de éxito (`success-text`/`brand-primary`).
- **Título:** Conserva su tono cyan institucional.

## 5. Pruebas de Regresión
Se confirma que los siguientes elementos **NO** sufrieron daños:
- Contenido académico (intacto).
- Interactivos (Escudo Ético funciona perfecto).
- Componentes adjuntos (Checkpoint y Conceptos a repasar sin alteraciones).
- Consola (limpia de errores).
- Navegación (operativa).

## 6. Cierre y Aprobación Final

### 6.1 Revisión Humana

Tras revisión visual humana del prototipo `leccion3_4_maincss_migration_prototype.html`, se confirma que el componente reproduce fielmente el patrón aprobado original de la sección "Qué debes recordar".

**Hallazgo final:** El patrón original aprobado usa emoji nativo "✅" mediante pseudo-elemento, no una cajita CSS reinterpretada.

### 6.2 Tabla de Comparación: Reset Metodológico (Referencia Histórica)
| Propiedad | Valor aprobado original (`leccion3_4.html`) | Valor actual prototipo previo | Acción (Reset) |
|---|---|---|---|
| **Selector exacto** | `.remember-list li::before` | `.lesson-remember .lesson-remember__item .lesson-remember__check` | Restaurar lógica de pseudo-elemento BEM `.lesson-remember__item::before` |
| **Contenido/Check** | `content: "✅";` | `✓` (texto en HTML) + diseño CSS | Ocultar texto (`display: none`) y usar `content: "✅"` nativo |
| **Flex** | `flex: 0 0 auto;` | `flex: 0 0 auto;` | Mantener |
| **Border-radius** | *(Ninguno, emoji nativo)* | `var(--border-radius-sm)` | Eliminar |
| **Background / Color**| *(Ninguno, emoji nativo)* | `var(--color-feedback-...);` | Eliminar |
| **Tamaño / Box** | *(Heredado, en línea)* | `width: 1.05rem; height: ...` | Eliminar caja artificial |

### 6.3 Decisiones de Diseño Vinculantes

Las siguientes decisiones fueron confirmadas por revisión humana y son **vinculantes** para cualquier migración futura del componente:

| # | Decisión | Justificación |
|---|---|---|
| 1 | Mantener fondo azul/gris suave en el contenedor | Contraste visual con el resto de la página; fidelidad al patrón original |
| 2 | Mantener tarjetas internas blancas | Legibilidad y jerarquía visual aprobada |
| 3 | Mantener título cyan | Color institucional Docencia 4.0 |
| 4 | Usar "✅" nativo como checkmark oficial | Reproducción exacta del patrón original; emoji nativo, no CSS |
| 5 | **NO** usar cajitas reinterpretadas, círculos ni checkmarks CSS alternativos | Cualquier variante CSS fue rechazada por no coincidir con el original |

### 6.4 Restricciones Explícitas

> ⛔ **NO** hacer deploy.
> ⛔ **NO** iniciar migración masiva a otras lecciones.
> ⛔ **NO** modificar producción.
> ⛔ **NO** usar `git add .`

---

## Estado Final

**🟢 B1-A APROBADO** — Componente "Qué debes recordar" calibrado en main.css replicando el patrón aprobado original basado en emoji nativo "✅".

- **Fecha de aprobación:** 2026-05-21
- **Método de validación:** Revisión visual humana del prototipo
- **Archivo de referencia:** `docencia-4.0/leccion3_4_maincss_migration_prototype.html`
