# QA B1-B — Calibración Componente "Conceptos a repasar"

## 1. Objetivo de la calibración
Integrar el diseño oficial del componente interactivo de repaso de conceptos (`.concept-review`) dentro de `styles/main.css` como un patrón reutilizable, de forma que todas las lecciones puedan utilizar la misma estructura visual sin depender de estilos incrustados localmente.

## 2. Acciones realizadas

1. **Diagnóstico y Extracción**: 
   - Se analizaron 4 lecciones de producción (`leccion3_4`, `leccion3_1`, `leccion2_3`, `leccion2_1`).
   - Se determinó que la estructura HTML BEM es consistente en todas las páginas.
   - Se extrajo el patrón CSS completo desde el bloque `<style>` de `leccion3_1.html` (que era la implementación más completa y avanzada, incluyendo la variante `--blue` y elementos opcionales como contadores y subtítulos).
   
2. **Centralización en `main.css`**:
   - Se eliminó un bloque huérfano incompleto (`.concept-review__meta`) en la línea 5036.
   - Se insertó el bloque CSS documentado y calibrado al final de `styles/main.css`.
   - Se aprovechó la regla de componentes compartidos existente en `main.css` (línea 5254) que ya aplicaba la base de la caja exterior para `.concept-review`.
   
3. **Creación de Prototipo**:
   - Se clonó `leccion3_4.html` hacia `docencia-4.0/leccion3_4_conceptreview_prototype.html`.
   - En este prototipo, el componente `<details class="concept-review">` ahora hereda directamente los nuevos estilos globales definidos en `main.css`, sin requerir CSS local.

## 3. Composición del Patrón Calibrado

El patrón CSS ahora soporta la siguiente estructura BEM modular:

- **Contenedor base**: `.concept-review`
- **Cabecera**: `.concept-review__summary-main`
  - Elementos: `.concept-review__icon`, `.concept-review__title`, `.concept-review__subtitle` (opcional), `.concept-review__count` (opcional).
- **Cuerpo (Desplegable)**: `.concept-review__panel`
  - Elementos: `.concept-review__list` (grid).
- **Ítem Individual (Acordeón interno)**: `.concept-review__item`
  - Cabecera del ítem: `.concept-review__summary`
  - Contenido: `.concept-review__body`, `.concept-review__citation`
- **Patrón Progresivo**: `.concept-review__overflow` y botón `.concept-review__more`.
- **Variante Estilística**: `.concept-review--blue` (Aplica fondo primario, diseñado para contextos específicos como el de la lección 3.1).

## 4. Estado de QA Visual

Al revisar el prototipo `leccion3_4_conceptreview_prototype.html` mediante servidor local:
- El componente "Conceptos a repasar" se renderiza con el fondo blanco (heredado de surface), bordes redondeados y sombra.
- El header interactivo tiene el layout tipo grid que alinea el icono y los títulos correctamente.
- Al desplegarse, la lista de conceptos se muestra como tarjetas individuales (`__item`) con fondo ligeramente gris.
- El script `concept-review.js` sigue funcionando correctamente (cambio de texto en el título a "Ocultar conceptos").

## 5. Recomendación para Fase de Migración (Próximos pasos)

Estado de calibración:
**B1-B PENDIENTE** — QA visual detectó títulos internos centrados. Se requiere corrección de alineación izquierda.

*Corrección aplicada*: Se actualizó `styles/main.css` modificando el selector `.concept-review__summary` con `justify-content: flex-start` y `text-align: left`, además de agregar `text-align: left` a `.concept-review__body`.

Estado final actualizado:
**B1-B APROBADO** — componente “Conceptos a repasar” calibrado con títulos internos alineados a la izquierda y estructura visual preservada.

5. Para la fase de migración masiva (cuando se autorice), las acciones serán:
1. Eliminar cualquier bloque `<style>` en las lecciones que declare `.concept-review` (ej. `leccion3_1.html`).
2. Asegurar que todas las lecciones tengan vinculado `main.css` y el script `scripts/concept-review.js`.
3. Ningún cambio HTML es estrictamente necesario ya que la estructura base actual de las lecciones coincide con los selectores CSS centralizados.

## QA Fix — Compatibilidad JS para acción derecha

**Diagnóstico del conflicto:**
Se detectó que el archivo global `scripts/concept-review.js` estaba modificando directamente el texto del título izquierdo a "Ocultar conceptos", lo que entraba en conflicto con la regla de mantener el título "Conceptos a repasar" intacto y mover la acción de alternancia a la derecha (siguiendo el patrón de "Referencias").

**Resolución:**
- No se eliminó el bloque de funcionalidad global.
- Se modificó `scripts/concept-review.js` añadiendo **compatibilidad hacia atrás** (fallback).
- El JS ahora detecta si existen los elementos `.concept-review__toggle-text--closed` y `--open`.
- Si existen, el JS **no** altera el título izquierdo y permite que `main.css` controle la visibilidad de los textos derechos.
- Si no existen, el JS conserva el comportamiento anterior como fallback para no romper las páginas antiguas de producción que aún no migran al nuevo patrón.

**Garantías de seguridad:**
- Se implementó la acción de alternancia a la derecha mediante CSS y spans dedicados en el prototipo.
- Las páginas antiguas conservan el fallback intacto.
- **NO** se modificó producción (`leccion3_4.html` ni otras lecciones reales).
- **NO** se ejecutó ningún comando deploy.
- **NO** se utilizó `git add .` ni se mezcló este QA con los commits de B1-C.
- **NO** se inició ninguna migración masiva.

## QA Fix ESTRICTO — Normalización real de barra Conceptos

**Correcciones realizadas:**
- Corrección del selector: Se ajustó el CSS para utilizar el selector semántico `.concept-review > .concept-review__summary-main`, eliminando redundancias y forzando el `display: grid` (`auto minmax(0, 1fr) auto`).
- Se eliminó el estilo inline `text-align: right` del HTML y se sustituyó el `<div>` contenedor de la acción por un `<span>` con la clase `.concept-review__action-wrapper`.
- Se añadieron estilos globales a `.concept-review__title` y `.concept-review__toggle-text` para definir jerarquías visuales claras (tamaños de fuente, peso extrabold, color cyan `brand-primary`).
- Se protegió el selector `.concept-review__summary` exclusivamente para los títulos internos (ej. "Lista de verificación ética..."), preservando su alineación a la izquierda intacta.
- Se reforzó la lógica de `scripts/concept-review.js` para asegurar que el título original se asigne explícitamente en el early return, bloqueando de raíz cualquier cambio al texto izquierdo si existe una acción a la derecha.

**Estado actual:** Prototipo normalizado y verificado visualmente en local. No se ejecutó deploy ni git add.

## Incidencia QA Visual durante B1-0
Durante el saneamiento de `main.css`, el clon de producción usado para pruebas visuales falló en mostrar la acción derecha de Conceptos.
- **Razón:** El HTML de producción aún no posee el `action-wrapper`.
- **Resolución:** Se inyectó manualmente el bloque HTML del `action-wrapper` en `leccion3_4_css_sanity_prototype.html` para validar con éxito la normalización visual, confirmando el comportamiento correcto tanto en Conceptos como Referencias.
- `scripts/concept-review.js` no necesitó modificaciones adicionales porque ya contaba con el fallback robusto.
- **Producción:** Intacta. No deploy. No git add.
