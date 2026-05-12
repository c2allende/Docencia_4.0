# Plan de Implementación — Alt E3: Panel colapsado + micro-repaso adaptativo

## 1. Páginas afectadas y densidad de conceptos

| # | Página | Conceptos | Regla adaptativa | Etiqueta cita |
|---|---|---:|---|---|
| 1 | leccion1_1.html | 5 | 3 visibles + "Ver más conceptos" | `<small>` |
| 2 | leccion1_2.html | 5 | 3 visibles + "Ver más conceptos" | `<small>` |
| 3 | leccion1_3.html | 6 | 3 visibles + "Ver más conceptos" | `<small>` |
| 4 | leccion2_1.html | 3 | Todos visibles | `<small>` |
| 5 | leccion2_2.html | 4 | 3 visibles + "Ver más conceptos" | `<small>` |
| 6 | leccion2_3.html | 6 | 3 visibles + "Ver más conceptos" | `<small>` |
| 7 | leccion3_1.html | 7 | 3 visibles + "Ver todos los conceptos" | `<span class="concept-ref">` |
| 8 | leccion3_2.html | 3 | Todos visibles | `<span class="concept-ref">` |
| 9 | leccion3_3.html | 4 | 3 visibles + "Ver más conceptos" | `<span class="concept-ref">` (parcial) |
| 10 | leccion3_4.html | 2 | Todos visibles | `<span class="concept-ref">` |

**Total:** 10 páginas de producción. **45 conceptos** a migrar.

> [!IMPORTANT]
> El archivo `leccion1_1_prototype.html` NO se modifica; contiene la misma estructura que `leccion1_1.html` y es solo de referencia.

---

## 2. Estructura HTML propuesta (Alt E3)

```html
<!-- ===== CONCEPT REVIEW PANEL — ALT E3 ===== -->
<section class="concept-review" aria-labelledby="concept-review-title">
  <div class="concept-review__header">
    <div class="concept-review__icon" aria-hidden="true">📖</div>
    <div class="concept-review__meta">
      <h2 id="concept-review-title" class="concept-review__title">Conceptos a repasar</h2>
      <p class="concept-review__subtitle">Antes de continuar, repasa estas ideas clave.</p>
    </div>
    <span class="concept-review__count">X conceptos disponibles</span>
  </div>

  <button type="button"
          class="concept-review__toggle"
          aria-expanded="false"
          aria-controls="concept-review-panel">
    Repasar conceptos
  </button>

  <div id="concept-review-panel"
       class="concept-review__panel"
       role="region"
       aria-label="Conceptos a repasar"
       hidden>

    <div class="concept-review__list">

      <!-- Cada concepto usa <details>/<summary> nativo -->
      <details class="concept-review__item">
        <summary class="concept-review__summary">
          Título exacto del concepto
        </summary>
        <div class="concept-review__body">
          <p>Texto completo original, sin modificar.</p>
          <cite class="concept-review__citation">Referencia completa original.</cite>
        </div>
      </details>

      <!-- Si hay más de 3 conceptos, los adicionales van ocultos -->
      <div class="concept-review__overflow" hidden>
        <details class="concept-review__item"> ... </details>
      </div>

    </div>

    <!-- Botón "Ver más" / "Ver todos" (solo si > 3 conceptos) -->
    <button type="button" class="concept-review__more" hidden>
      Ver más conceptos
    </button>

  </div>
</section>
```

### Notas semánticas

- **`<details>/<summary>`**: HTML nativo, accesible por teclado sin JS.
- **`<cite>`**: Semántica correcta para citas bibliográficas. Reemplaza el uso actual mixto de `<small>` y `<span class="concept-ref">`.
- **`hidden`**: Atributo nativo controlado por JS mínimo. Sin clases de visibilidad custom.
- **`aria-expanded`** y **`aria-controls`**: En el botón principal del panel.
- **`role="region"`**: En el panel expandible, con `aria-label` descriptivo.

---

## 3. Cambios requeridos en `main.css`

### 3.1 Estilos nuevos a añadir (bloque nuevo al final de main.css)

Se añade un bloque completo nuevo **sin modificar ningún estilo existente**.

```css
/* ==========================================================================
   COMPONENT — CONCEPT REVIEW (Alt E3)
   Panel colapsado + micro-repaso progresivo adaptativo
   ========================================================================== */

.concept-review {
  margin: var(--spacing-16) 0;
  padding: var(--spacing-6);
  background: var(--color-slate-50);
  border: var(--border-width-1) solid var(--color-slate-200);
  border-radius: var(--border-radius-xl);
}

.concept-review__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.concept-review__icon {
  font-size: var(--font-size-2xl);
  line-height: 1;
}

.concept-review__meta {
  flex: 1;
  min-width: 0;
}

.concept-review__title {
  margin: 0;
  color: var(--color-teal-900);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
}

.concept-review__subtitle {
  margin: var(--spacing-1) 0 0;
  color: var(--color-slate-600);
  font-size: var(--font-size-sm);
}

.concept-review__count {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--color-cyan-50);
  color: var(--color-teal-700);
  border-radius: var(--border-radius-full);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.concept-review__toggle {
  display: block;
  width: 100%;
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--color-white);
  color: var(--color-teal-700);
  border: var(--border-width-2) solid var(--color-slate-300);
  border-radius: var(--border-radius-lg);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color var(--motion-duration-fast),
              border-color var(--motion-duration-fast),
              color var(--motion-duration-fast);
}

.concept-review__toggle:hover {
  background: var(--color-cyan-50);
  border-color: var(--color-cyan-400);
  color: var(--color-teal-900);
}

.concept-review__toggle:focus-visible {
  outline: var(--border-width-2) solid var(--color-cyan-500);
  outline-offset: var(--spacing-1);
}

.concept-review__toggle[aria-expanded="true"] {
  background: var(--color-slate-100);
  border-color: var(--color-slate-400);
}

.concept-review__panel {
  margin-top: var(--spacing-4);
}

.concept-review__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.concept-review__item {
  background: var(--color-white);
  border: var(--border-width-1) solid var(--color-slate-200);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.concept-review__item[open] {
  border-color: var(--color-cyan-200);
}

.concept-review__summary {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-teal-900);
  cursor: pointer;
  list-style: none;
  transition: background-color var(--motion-duration-fast);
}

.concept-review__summary::-webkit-details-marker {
  display: none;
}

.concept-review__summary::before {
  content: "▸";
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  color: var(--color-slate-500);
  transition: transform var(--motion-duration-fast);
}

.concept-review__item[open] > .concept-review__summary::before {
  transform: rotate(90deg);
}

.concept-review__summary:hover {
  background: var(--color-slate-50);
}

.concept-review__body {
  padding: 0 var(--spacing-4) var(--spacing-4) var(--spacing-4);
  border-top: var(--border-width-1) solid var(--color-slate-100);
}

.concept-review__body p {
  margin: var(--spacing-3) 0 0;
  color: var(--color-slate-700);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.concept-review__citation {
  display: block;
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-2);
  border-top: var(--border-width-1) solid var(--color-slate-100);
  color: var(--color-slate-500);
  font-size: var(--font-size-xs);
  font-style: normal;
  line-height: var(--line-height-relaxed);
}

.concept-review__more {
  display: block;
  width: 100%;
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-4);
  background: transparent;
  color: var(--color-cyan-700);
  border: var(--border-width-1) dashed var(--color-cyan-300);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color var(--motion-duration-fast),
              color var(--motion-duration-fast);
}

.concept-review__more:hover {
  background: var(--color-cyan-50);
  color: var(--color-teal-900);
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .concept-review {
    padding: var(--spacing-4);
  }
  .concept-review__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  .concept-review__count {
    align-self: flex-start;
  }
}
```

### 3.2 Estilos existentes del slider que NO se eliminan

> [!WARNING]
> Las clases `.slider-section`, `.slider-header`, `.slider-controls`, `.control-btn`, `.slider-container`, `.slider-track`, `.slider-item` permanecen en los `<style>` inline de cada lección hasta que se confirme la migración exitosa y se complete el QA. Solo después de confirmación se podrán eliminar como parte de un paso de limpieza.

---

## 4. Script complementario

**Sí, se necesita un script mínimo.** Se creará un archivo dedicado:

**`scripts/concept-review.js`** (~40 líneas)

```js
/**
 * Concept Review — Alt E3
 * Panel colapsado + micro-repaso progresivo adaptativo
 * NO depende de librerías externas.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.concept-review').forEach(section => {
    const toggle = section.querySelector('.concept-review__toggle');
    const panel = section.querySelector('.concept-review__panel');
    const moreBtn = section.querySelector('.concept-review__more');
    const overflow = section.querySelector('.concept-review__overflow');

    if (!toggle || !panel) return;

    // Toggle principal: abrir/cerrar panel
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      toggle.textContent = expanded ? 'Repasar conceptos' : 'Ocultar conceptos';
    });

    // Botón "Ver más" / "Ver todos"
    if (moreBtn && overflow) {
      moreBtn.addEventListener('click', () => {
        overflow.hidden = false;
        moreBtn.hidden = true;
      });
    }
  });
});
```

**Inclusión en las lecciones:**
```html
<script src="scripts/concept-review.js"></script>
```
Se añade al final del `<body>`, junto a los demás scripts.

---

## 5. Plan de backups

Antes de editar **cualquier** archivo de producción:

| Paso | Acción | Destino |
|---:|---|---|
| 1 | Copiar cada archivo HTML a intervenir | `docs/backups/conceptos_repasar/leccionX_X.html.bak` |
| 2 | Copiar `styles/main.css` | `docs/backups/conceptos_repasar/main.css.bak` |
| 3 | Verificar que los backups son idénticos al original | Comparación byte a byte |

---

## 6. QA visual y funcional

### 6.1 Automatizado (por lección)

- [ ] Verificar que el panel inicia **cerrado** (`hidden` presente, `aria-expanded="false"`).
- [ ] Verificar que el botón dice "Repasar conceptos".
- [ ] Verificar que el badge muestra la cantidad correcta de conceptos.
- [ ] Click en "Repasar conceptos" → panel se abre, botón cambia a "Ocultar conceptos".
- [ ] Verificar que **todos los `<details>`** inician cerrados.
- [ ] Si > 3 conceptos: verificar que el overflow está oculto y que "Ver más" / "Ver todos" aparece.
- [ ] Click en "Ver más" → conceptos restantes aparecen, botón "Ver más" desaparece.
- [ ] Cada `<summary>` se puede abrir con clic y con teclado (Enter/Space).
- [ ] Click en "Ocultar conceptos" → panel vuelve a cerrarse.

### 6.2 Visual

- [ ] Altura inicial del panel cerrado: **≤ 130px** en desktop.
- [ ] Responsive: probar en 375px, 768px, 1280px.
- [ ] Contraste de texto cumple WCAG AA (4.5:1 mínimo).
- [ ] No hay overflow horizontal.
- [ ] Las citas se muestran completas sin truncar.

### 6.3 Regresión

- [ ] El `progress-tracker.js` sigue funcionando (no se altera).
- [ ] Los Genially Checkpoints siguen funcionando (no se tocan).
- [ ] La navegación lateral sigue funcionando.
- [ ] El footer institucional se renderiza correctamente.

---

## 7. Confirmación de preservación textual

Cada lección se auditará contra el inventario (`docs/reports/conceptos_repasar_inventory.md`):

| Check | Criterio |
|---|---|
| ✅ | Título del concepto: **idéntico** al original |
| ✅ | Texto explicativo: **idéntico** al original (incluye "human." al final del andamiaje en 1.1) |
| ✅ | Cita/referencia: **idéntica** al original (incluyendo URLs, ampersands HTML, itálicas) |
| ✅ | Cantidad de conceptos: **misma** que la original |
| ❌ | Ningún concepto fue resumido, parafraseado, combinado o eliminado |

---

## 8. Riesgos técnicos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Estilos inline del slider antiguo colisionan con nuevos estilos | Bajo | Los nuevos usan namespace `.concept-review` completamente separado |
| Script JS del slider antiguo (`sliderTrack`, `prevBtn`, `nextBtn`) lanza errores al no encontrar elementos | Medio | Eliminar las referencias al slider en el `<script>` inline de cada lección al migrar |
| Etiqueta de cita cambia de `<small>` / `<span>` a `<cite>` | Bajo | Solo semántico, sin impacto visual si se estiliza correctamente |
| Inconsistencia entre `<small>` (M1, M2) y `<span class="concept-ref">` (M3) | Bajo | La migración unifica todo a `<cite class="concept-review__citation">` |
| El atributo `hidden` no es soportado en navegadores muy antiguos | Nulo | El LMS ya requiere navegadores modernos (CSS custom properties) |

---

## 9. Estrategia de rollback

### Rollback rápido (< 5 min)
1. Restaurar backups desde `docs/backups/conceptos_repasar/`.
2. No se necesita revertir `main.css` porque los estilos nuevos son aditivos (no sobreescriben nada).
3. Eliminar `scripts/concept-review.js`.
4. Redesplegar a Firebase.

### Rollback vía Git
1. `git revert` del commit de implementación.
2. Redesplegar.

---

## 10. Orden de ejecución propuesto

| Fase | Acción | Archivos |
|---:|---|---|
| 1 | Crear backups de todas las lecciones + main.css | `docs/backups/conceptos_repasar/` |
| 2 | Crear `scripts/concept-review.js` | Archivo nuevo |
| 3 | Añadir bloque CSS al final de `styles/main.css` | Append only |
| 4 | Migrar lección piloto: `leccion3_4.html` (2 conceptos, caso más simple) | Reemplazar `<section class="slider-section">` → Alt E3 |
| 5 | QA local de leccion3_4 | Visual + funcional |
| 6 | Migrar `leccion2_1.html` y `leccion3_2.html` (3 conceptos, sin "Ver más") | |
| 7 | QA local de ambas | |
| 8 | Migrar lecciones con 4–6 conceptos: 2_2, 1_1, 1_2, 1_3, 2_3, 3_3 | |
| 9 | QA local de cada una | |
| 10 | Migrar `leccion3_1.html` (7 conceptos, "Ver todos") | |
| 11 | QA completo final de las 10 lecciones | |
| 12 | Limpieza: eliminar CSS inline del slider antiguo en cada lección + JS del slider | |
| 13 | Commit + Deploy a Firebase | |

> [!CAUTION]
> No ejecutar la Fase 13 (deploy) sin autorización explícita del usuario.

---

## 11. Confirmación de contención

- ✅ El inventario fue creado fuera de producción.
- ✅ Este plan fue creado fuera de producción.
- ✅ No se ha modificado `docencia-4.0/`.
- ✅ No se ha modificado `styles/main.css`.
- ✅ No se han modificado lecciones HTML.
- ✅ No se ha hecho commit.
- ✅ No se ha hecho deploy.
