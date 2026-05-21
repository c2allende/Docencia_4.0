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

Para la fase de migración masiva (cuando se autorice), las acciones serán:
1. Eliminar cualquier bloque `<style>` en las lecciones que declare `.concept-review` (ej. `leccion3_1.html`).
2. Asegurar que todas las lecciones tengan vinculado `main.css` y el script `scripts/concept-review.js`.
3. Ningún cambio HTML es estrictamente necesario ya que la estructura base actual de las lecciones coincide con los selectores CSS centralizados.
