# QA B1-B — Diagnóstico "Conceptos a repasar"

## 1. Objetivo

Extraer el patrón aprobado real del componente "Conceptos a repasar" (`<details class="concept-review">`) desde las páginas de producción, identificar variaciones y determinar si es viable centralizar el CSS en `styles/main.css`.

## 2. Páginas revisadas

| Página | Ubicación del componente | Línea HTML |
|---|---|---|
| `leccion3_4.html` | L1754–L1781 | `<details class="concept-review" data-concept-review>` |
| `leccion3_1.html` | L2447–L2543 | `<details class="concept-review" data-concept-review>` |
| `leccion2_3.html` | L1583–L1694 | `<details class="concept-review" data-concept-review>` |
| `leccion2_1.html` | L1613–L1645 | `<details class="concept-review" data-concept-review="">` |

**Presencia global:** El componente existe en **todas** las lecciones (1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4) + prototipos.

## 3. Tabla comparativa del patrón actual

| Propiedad | leccion3_4 | leccion3_1 | leccion2_3 | leccion2_1 |
|---|---|---|---|---|
| **Clase principal** | `.concept-review` | `.concept-review` (+ variante `--blue`) | `.concept-review` | `.concept-review` |
| **Fondo exterior** | Sin CSS local; hereda de `main.css` (no definido) | Variante `--blue`: `var(--color-brand-primary)` con `box-shadow: focus-primary` | Sin CSS local visible | Sin CSS local visible |
| **Contenedor interno (panel)** | `.concept-review__panel` | `.concept-review__panel`: fondo blanco, border-radius xl, shadow flat | `.concept-review__panel` (misma estructura) | `.concept-review__panel` |
| **Título** | "Conceptos a repasar" vía `__title` | "Conceptos a repasar" + `__subtitle` + `__count` (7 conceptos) | "Conceptos a repasar" | "Conceptos a repasar" |
| **Icono** | 📖 vía `__icon` | 📖 vía `__icon` | 📖 vía `__icon` | 📖 vía `__icon` |
| **Botón/indicador** | `<summary>` nativo | `<summary>` nativo | `<summary>` nativo | `<summary>` nativo |
| **Contador** | No | Sí: `__count` "7 conceptos disponibles" | No | No |
| **Subtítulo** | No | Sí: `__subtitle` "Antes de continuar..." | No | No |
| **Botón "Ver más"** | No | No | Sí: `__more` + `__overflow` | No |
| **Ítems internos** | `<details class="concept-review__item">` | Igual | Igual (con `__overflow` wrapper) | Igual |
| **Cuerpo de ítem** | `__body` con `<p>` + `<cite class="__citation">` | Igual | Igual | Igual |
| **Comportamiento abierto/cerrado** | `<details>` nativo + JS toggle title | Igual | Igual | Igual |
| **Script** | `scripts/concept-review.js` | Igual | Igual | Igual |

## 4. Diferencias detectadas

### 4.1 Variante visual `--blue` (solo leccion3_1)
- `leccion3_1.html` define una variante `concept-review--blue` con fondo `var(--color-brand-primary)` y sombra `var(--shadow-focus-primary)`.
- Los ítems internos en esta variante usan fondo `var(--color-background-surface-low)` en lugar del blanco estándar.
- **Esta variante NO se usa en ninguna otra lección.** El HTML de leccion3_1 no aplica la clase `--blue` al `<details>` principal (usa solo `concept-review`), por lo que el CSS extra parece **preparatorio o legado**.

### 4.2 Elementos adicionales opcionales
- **Contador (`__count`)**: Solo en leccion3_1 ("7 conceptos disponibles").
- **Subtítulo (`__subtitle`)**: Solo en leccion3_1 ("Antes de continuar, repasa estas ideas clave.").
- **Botón "Ver más" (`__more` + `__overflow`)**: Solo en leccion2_3 (patrón progresivo para lecciones con muchos conceptos).

### 4.3 CSS actual en main.css
**No existe ninguna definición de `.concept-review` en `styles/main.css`.** Todo el CSS está definido localmente en cada `<style>` de cada lección. Esto significa que:
- Cada lección duplica las reglas CSS.
- No hay garantía de consistencia visual entre lecciones.
- El componente funciona solo porque los estilos están embebidos.

## 5. Patrón aprobado recomendado

Basado en la intersección de **todas** las lecciones, el patrón base aprobado es:

| Propiedad | Valor aprobado |
|---|---|
| **Elemento raíz** | `<details class="concept-review" data-concept-review>` |
| **Summary principal** | `.concept-review__summary-main` — clickable, con icono + título |
| **Icono** | 📖 vía `<span class="concept-review__icon">` |
| **Título** | "Conceptos a repasar" vía `<span class="concept-review__title">` |
| **Panel** | `.concept-review__panel` — contenedor del listado de conceptos |
| **Lista** | `.concept-review__list` — contenedor grid de ítems |
| **Ítem** | `<details class="concept-review__item">` — acordeón individual |
| **Summary de ítem** | `.concept-review__summary` — título del concepto |
| **Cuerpo de ítem** | `.concept-review__body` — definición + cita |
| **Cita** | `<cite class="concept-review__citation">` |
| **Fondo exterior (summary)** | `var(--color-background-surface-low)` con border y shadow |
| **Fondo panel** | `var(--color-background-surface)` con border-radius xl y shadow |
| **Fondo ítems** | Heredado de panel (blanco) |
| **Comportamiento** | `<details>` nativo + JS para toggle de texto del título |

**Elementos opcionales (no obligatorios para base):**
- `__subtitle` — texto secundario bajo el título
- `__count` — badge con número de conceptos
- `__more` / `__overflow` — patrón progresivo para muchos conceptos

## 6. Riesgos si se centraliza sin calibrar

1. **Pérdida de la variante `--blue`**: Si no se incluye como variante opcional, leccion3_1 podría perder su estilo futuro.
2. **Incompatibilidad con `__overflow` / `__more`**: El patrón progresivo de leccion2_3 necesita reglas específicas que deben incluirse.
3. **Especificidad CSS**: Si `main.css` define reglas demasiado rígidas, los estilos locales remanentes podrían entrar en conflicto.
4. **Falta de definición base**: Actualmente el componente **no tiene estilos en main.css**, lo que significa que la centralización es una **adición**, no una modificación, reduciendo el riesgo de regresión.

## 7. Recomendación

**✅ Calibrar `main.css` ahora.**

Justificación:
- El patrón HTML es **100% consistente** en estructura BEM entre todas las lecciones.
- La única variación es cosmética (variante `--blue`, extras opcionales).
- No hay CSS actual en `main.css` que entre en conflicto → la adición es limpia.
- El script `concept-review.js` ya es compartido, lo que confirma la intención de componente reutilizable.
- Se puede agregar el bloque base + la variante `--blue` como modificador opcional.

**Requiere revisión visual humana** para confirmar que el prototipo iguala el original antes de aprobar.
