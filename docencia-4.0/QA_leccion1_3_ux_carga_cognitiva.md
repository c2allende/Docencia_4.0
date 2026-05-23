# QA — Lección 1.3: Ética, seguridad y responsabilidad (Human in the Loop)

**Archivo prototipo:** `leccion1_3_ux_carga_cognitiva_prototype.html`
**Fecha:** 2026-05-15
**Última actualización:** Versión final — tarjetas de transferencia con grid independiente y CSS limpio
**Estado:** Prototipo — no producción

---

## Archivos modificados

| Archivo | Acción | Líneas |
|---------|--------|--------|
| `styles/main.css` | **Reemplazo** de bloque LESSON TRANSFER PROGRESSIVE CARDS + eliminación de CSS muerto (`.lesson-role-grid`, `.lesson-role-card`, `.lesson-progressive-card`) | 4376 → 4485 |
| `leccion1_3_ux_carga_cognitiva_prototype.html` | **Reemplazo completo** de sección "Conexión con tu rol" (HTML válido, sin duplicados, sin empty summary) | 922 líneas |
| `QA_leccion1_3_ux_carga_cognitiva.md` | **Actualizado** (este reporte) | — |

**Producción intacta:**
- `leccion1_3.html` — sin cambios (`git diff` = vacío)
- `scripts/progress-tracker.js` — sin cambios
- `scripts/auth-guard.js` — sin cambios
- `scripts/firebase-config.js` — sin cambios
- `scripts/genially-checkpoint.js` — sin cambios
- `scripts/concept-review.js` — sin cambios

---

## Tarea A: Lesson Editorial Flex System en main.css

Bloque añadido al final de `main.css` sin alterar reglas existentes:

```css
/* =========================================================
   DOCENCIA 4.0 — LESSON EDITORIAL FLEX SYSTEM
   Componentes flexibles para lecciones rediseñadas.
   No sustituye tokens globales ni altera componentes existentes.
   ========================================================= */
```

### Clases reutilizables creadas

| Clase | Propósito |
|-------|-----------|
| `.lesson-floating-shell` | Contenedor principal despegado del banner |
| `.lesson-section` | Espaciado compacto entre secciones |
| `.lesson-split` | Grid texto + imagen (2 columnas desktop) |
| `.lesson-split.reverse` | Grid imagen + texto (orden invertido) |
| `.lesson-media-card` | Tarjeta compacta para imágenes con zoom |
| `.lesson-media-card img` | Imagen responsiva con max-height clamp |
| `.lesson-compact-note` | Nota compacta con borde lateral |
| `.lesson-transfer-section` | Sección de tarjetas de transferencia progresiva |
| `.lesson-transfer-grid` | Grid responsivo (3 → 2 → 1 columnas) |
| `.lesson-transfer-card` | Tarjeta individual con lectura progresiva |
| `.lesson-transfer-details` | Contenedor details/summary para "Leer más/Ocultar" |

### Características técnicas
- **Solo tokens existentes:** `--color-background-surface`, `--color-border-subtle`, `--shadow-*`, `--border-radius-*`, `--spacing-*`, `--font-*`, `--motion-*`
- **Sin colores hardcoded**
- **Sin afectar páginas existentes** (clases nuevas, no modifican existentes)
- **Responsive:** colapsa a 1 columna en ≤720px, sin overflow horizontal
- **Imágenes:** `max-height: clamp(220px, 34vw, 340px)`, `object-fit: contain`
- **Zoom:** usa el mismo sistema `openZoom()` existente
- **CSS limpio:** eliminadas clases muertas (`.lesson-role-grid`, `.lesson-role-card`, `.lesson-progressive-card`)

---

## Tarea B: Corrección del prototipo

### Cambios estructurales
1. **Contenedor principal:** `.m1-floating-shell` → `.lesson-floating-shell` (clase global)
2. **CSS local eliminado:** ~200 líneas de CSS redundante eliminadas
3. **Namespace local mínimo:** `.leccion1-3-prototype` solo para ajustes específicos (títulos, audio, listas, highlight-box, recommendations-box, comparison-grid, footer nav)
4. **Layout split editorial:**
   - Marco legal: `lesson-split` (texto izq + imagen der)
   - Human in the Loop: `lesson-split.reverse` (imagen izq + texto der)
   - Móvil: texto primero (`order: 1`), imagen después (`order: 2`)
5. **Imágenes compactas:** `.lesson-media-card` con `max-height: clamp(220px, 34vw, 340px)`
6. **Espaciado vertical reducido:** `clamp(2rem, 4vw, 3.25rem)` entre secciones

### Sección "Conexión con tu rol"
- Tres tarjetas `.lesson-transfer-card` en `.lesson-transfer-grid`
- Texto completo preservado sin resumir
- Lectura progresiva con `<details>`/`<summary>` nativo
- Frases gancho visibles, texto explicativo oculto hasta interacción

---

## Tarea C: Checkpoint restaurado desde producción

Estructura copiada exactamente de `leccion1_3.html`:

```html
<section class="genially-checkpoint" data-genially-checkpoint aria-labelledby="checkpoint-title">
    <div class="genially-checkpoint__content">
        <span class="genially-checkpoint__eyebrow">Cierre de la lección</span>
        <h2 id="checkpoint-title" class="genially-checkpoint__title">Checkpoint de saberes: Lección 1.3</h2>
        <p class="genially-checkpoint__description">...</p>
        <div class="genially-checkpoint__actions">
            <button type="button" class="btn btn-primary genially-checkpoint__toggle" data-genially-toggle ...>
                Realizar checkpoint aquí
            </button>
            <a href="https://view.genially.com/69adcaa514c7191a9da873a6" class="genially-checkpoint__fallback">
                Abrir en Genially en nueva pestaña
            </a>
        </div>
        <p class="genially-checkpoint__note">...</p>
    </div>
    <div id="checkpoint-panel-1-3" class="genially-checkpoint__panel" data-genially-panel role="region" hidden>
        <div class="genially-checkpoint__frame-wrap">
            <iframe data-src="https://view.genially.com/69adcaa514c7191a9da873a6" ...></iframe>
        </div>
    </div>
</section>
```

- ✅ Mismo título
- ✅ Mismo texto descriptivo
- ✅ Mismos botones (`btn btn-primary` + fallback link)
- ✅ Mismo iframe Genially con `data-src` y `loading="lazy"`
- ✅ Mismas clases funcionales (`data-genially-checkpoint`, `data-genially-toggle`, `data-genially-panel`)
- ✅ Mismo comportamiento de apertura (controlado por `genially-checkpoint.js`)
- ✅ Mismo estilo general (usa `--gradient-orange` de main.css)

---

## Tarea D: Glosario y Referencias restaurados desde producción

### Glosario dinámico
- Copiado exactamente de producción: 6 términos, misma estructura `details/summary`
- Mismas clases: `concept-review`, `concept-review__summary-main`, `concept-review__panel`, `concept-review__overflow`, `concept-review__more`
- Mismos textos y citas
- Colapsado por defecto
- Controlado por `concept-review.js`

### Referencias
- Copiadas exactamente de producción: 6 fuentes, mismo orden, mismo formato APA
- Mismas clases: `references-compact`, `references-compact__summary`, `references-compact__body`
- Mismo mecanismo "Ver referencias" (`details/summary`)
- Mismo contador "6 fuentes consultadas"

### Completado y Navegación
- `completion-card` con badge "Meta alcanzada" — igual a producción
- `#completion-section` placeholder para progress-tracker.js
- Navegación final: `← Volver a la Lección 1.2` | `Ir a Actividad 1.1 del Módulo →`

---

## Preservación de citas académicas

| Cita | Ubicación | Estado |
|------|-----------|--------|
| Im y Chee (2012) | Marco legal básico | ✅ Preservada exactamente |
| Russell & Norvig (2020) | Sesgos algorítmicos | ✅ Preservada exactamente |
| Hargreaves y Fullan (2012) | Dependencia tecnológica | ✅ Preservada exactamente |
| Valli y Zafiropoulos (2024) | Dependencia tecnológica | ✅ Preservada exactamente |
| Alhalthli et al. (2025) | Human in the Loop | ✅ Preservada exactamente |
| Seufert et al. (2022) | Human in the Loop | ✅ Preservada exactamente |
| Hargreaves & Fullan (2012) | Curador/editor experto | ✅ Preservada exactamente |

---

## Pruebas responsivas

### Desktop (≥1024px)
- [x] Página flota separada del banner (`margin-top: clamp(2.5rem, 5vw, 4.5rem)`)
- [x] H1 completo y sin recorte (`clamp(2.2rem, 5.5vw, 3rem)`)
- [x] Imágenes legibles, no enormes (`max-height: clamp(220px, 34vw, 340px)`)
- [x] Texto e imagen conectados visualmente (split layout)
- [x] Sin espacios verticales excesivos (`clamp(2rem, 4vw, 3.25rem)`)
- [x] Checkpoint coincide con producción
- [x] Glosario coincide con producción
- [x] Referencias coinciden con producción
- [x] Botones mantienen diseño institucional

### Móvil (≤768px)
- [x] Sin overflow horizontal
- [x] H1 visible completo (`clamp(1.7rem, 7vw, 2.2rem)`)
- [x] Imágenes debajo del texto (order: 2 en split)
- [x] Tarjetas apiladas correctamente (1 columna)
- [x] Checkpoint funcional (botones táctiles legibles)
- [x] Botones táctiles legibles (`width: 100%`, `padding: 16px`)

---

## Corrección progresiva: tarjetas "Conexión con tu rol"

### Objetivo
Reducir carga cognitiva mostrando solo una frase gancho visible en cada tarjeta, con el texto explicativo completo oculto hasta que el usuario decida abrirlo.

### Estructura de cada tarjeta

```html
<article class="lesson-transfer-card">
    <h3>Acompañamiento curricular</h3>
    <p class="lesson-transfer-hook">Lleva la IA al aula de forma segura...</p>
    <details class="lesson-transfer-details">
        <summary>
            <span class="summary-more">Leer más</span>
            <span class="summary-less">Ocultar</span>
        </summary>
        <div class="lesson-transfer-content">
            <p>El marco de privacidad, sesgos y Human in the Loop...</p>
        </div>
    </details>
</article>
```

### Frases gancho visibles

| Tarjeta | Frase gancho |
|---------|-------------|
| Acompañamiento curricular | "Lleva la IA al aula de forma segura: conviértete en el guía que tu equipo necesita para evitar sesgos y proteger la privacidad." |
| Diseño y capacitación docente | "El verdadero valor del docente no lo reemplaza un algoritmo. Inspira a tu equipo a desarrollar un criterio crítico frente a la IA." |
| Gestión de documentación y procesos | "Automatizar no significa sustituir tu juicio. Establece las reglas del juego para el uso de LLM para tu trabajo." |

### Texto oculto (lectura progresiva)
- Cada tarjeta contiene el texto explicativo original dentro de `<details>`.
- Se abre con "Leer más", se cierra con "Ocultar".
- Sin JavaScript — usa HTML `<details>`/`<summary>` nativo.
- Estilos en bloque global LESSON TRANSFER PROGRESSIVE CARDS en `main.css`.

### CSS global en main.css

```css
.lesson-transfer-section { width: 100%; }
.lesson-transfer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.25rem, 2vw, 1.75rem);
  align-items: start;
}
.lesson-transfer-card {
  align-self: start;
  height: auto;
  min-height: 0;
  padding: clamp(1.35rem, 2.2vw, 1.75rem);
  border-radius: var(--border-radius-xl);
  background: var(--color-background-surface-low);
  border: var(--border-width-1) solid var(--color-border-subtle);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.lesson-transfer-details summary {
  display: inline-flex;
  cursor: pointer;
  list-style: none;
  color: var(--color-brand-primary);
  font-weight: 700;
  text-decoration: underline;
}
.lesson-transfer-details .summary-less { display: none; }
.lesson-transfer-details[open] .summary-more { display: none; }
.lesson-transfer-details[open] .summary-less { display: inline; }
```

### QA de la corrección

**Desktop:**
- [x] Las tres tarjetas se ven equilibradas en altura inicial
- [x] Solo aparece la frase gancho visible
- [x] "Leer más" despliega el texto completo
- [x] "Ocultar" cierra el contenido
- [x] Abrir una tarjeta NO estira las demás (grid con `align-items: start`)
- [x] No se altera el glosario
- [x] No se altera el checkpoint
- [x] No se altera referencias

**Móvil (≤720px):**
- [x] Las tarjetas se apilan correctamente (1 columna)
- [x] No hay texto cortado
- [x] No hay overflow horizontal
- [x] El botón "Leer más/Ocultar" funciona

---

## Validación técnica

```bash
# Producción intacta
git diff docencia-4.0/leccion1_3.html
# (sin salida — archivo sin cambios)

# main.css: bloque LESSON TRANSFER PROGRESSIVE CARDS + CSS muerto eliminado
git diff docencia-4.0/styles/main.css
# (+109 líneas netas tras limpieza)

# Prototipo: sección "Conexión con tu rol" corregida
# - Sin empty <summary> tags
# - Sin texto duplicado
# - Sin </div> sueltos
# - Estructura HTML válida
```

---

## Estructura del prototipo

1. Top nav existente
2. Contenedor `.lesson-floating-shell` (separado del banner)
3. H1: Lección 1.3: Ética, seguridad y responsabilidad (el "Human in the Loop")
4. Audio: Escuchar Lección 1.3
5. Caja introductoria breve
6. **Marco legal básico** (split: texto izq + imagen der)
7. **Sesgos algorítmicos y dependencia tecnológica** (tarjetas + highlight + recomendaciones)
8. **El docente como "experto validador"** (split reverse: imagen izq + texto der)
9. **Conexión con tu rol como facilitador docente** (3 tarjetas con hook + lectura progresiva)
10. Glosario dinámico: Conceptos a repasar (6 términos — igual a producción)
11. Cierre: ¡Felicidades! Meta alcanzada
12. Checkpoint de saberes: Lección 1.3 (igual a producción)
13. Referencias (6 fuentes — igual a producción)
14. Marcar como completado
15. Navegación final

---

## Enlaces locales

- **Prototipo:** `http://127.0.0.1:5000/leccion1_3_ux_carga_cognitiva_prototype.html`
- **QA:** `http://127.0.0.1:5000/QA_leccion1_3_ux_carga_cognitiva.md`
