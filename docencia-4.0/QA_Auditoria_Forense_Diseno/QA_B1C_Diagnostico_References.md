# QA B1-C — Diagnóstico “Referencias”

## 1. Objetivo
Diagnosticar el componente reutilizable "Referencias" en las lecciones aprobadas para documentar su estructura HTML real y su estado de CSS, con el fin de calibrar su centralización en `main.css` de forma controlada sin perder el patrón original.

## 2. Páginas revisadas
Se analizaron las siguientes páginas de producción:
- `leccion3_4.html`
- `leccion3_3.html`
- `leccion3_1.html`
- `leccion2_3.html`
- `leccion2_1.html`
- `leccion1_1.html`

## 3. Tabla comparativa del patrón actual

| Página | Clase principal | Título | Botón/acción | Contador | Panel desplegable | Formato de lista | Fondo/borde | Observaciones |
|---|---|---|---|---|---|---|---|---|
| 3.4 | `.references-compact` | "Referencias" | "Ver referencias" | No | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Patrón base limpio. |
| 3.3 | `.references-compact` | "Referencias" | "Ver referencias" | No | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Igual al base. |
| 3.1 | `.references-compact` | "Referencias" | "Ver referencias" | Sí (`__count`) | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Incluye contador. |
| 2.3 | `.references-compact` | "Referencias" | "Ver referencias" | No | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Igual al base. |
| 2.1 | `.references-compact` | "📚 Referencias" | "Ver referencias" | No | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Añade emoji al título. |
| 1.1 | `.references-compact` | "Referencias" | "Ver referencias" | No | Sí (`details/summary`) | `.reference-list` > `li` | En `main.css` | Igual al base. |

## 4. Diferencias detectadas
- **Contador**: La `leccion3_1` añade un span `.references-compact__count` para indicar el número de fuentes. Las demás no lo tienen.
- **Emoji en título**: La `leccion2_1` añade un emoji de libros al texto del título.
- **CSS Local vs Global**:
  - El componente **ya se encuentra centralizado de manera efectiva** en `main.css` (líneas 3147 a 3250), utilizando el patrón BEM completo (`.references-compact`, `__summary`, `__title`, `__count`, `__action`, `__body`).
  - La lección `leccion3_4.html` contiene código CSS local muerto (`.references-section`) que no se utiliza en el HTML.
  - En `main.css` existe la clase `.references-section` (agrupada en la línea 5252) que no se utiliza en el HTML de las referencias.
  - Hay un selector huérfano/conflictivo en `main.css` (línea 5038): `.references-compact__summary { grid-template-columns: minmax(0, 1fr) auto; }`, lo cual entra en conflicto conceptual ya que la regla principal en la línea 3156 usa `display: flex`.

## 5. Patrón aprobado recomendado
El patrón aprobado es el componente `details.references-compact` anidado dentro de `<section class="text-section">`. Este componente incluye:
- `summary.references-compact__summary`
  - `span.references-compact__title` (ID: referencias-title)
  - `span.references-compact__count` (Opcional, según lección)
  - `span.references-compact__action` (Texto: "Ver referencias", cambia dinámicamente con pseudo-clases en `main.css`)
- `div.references-compact__body`
  - `ul.reference-list`

No se usa, ni es necesario usar `.references-section`.

## 6. Riesgos de centralización
- **Romper panel desplegable**: Modificar el `details`/`summary` podría afectar el funcionamiento de mostrar/ocultar ("Ver referencias" -> "Ocultar referencias").
- **Afectar el contador**: Si se cambian las reglas de alineación (`display: flex`) en `main.css`, el contador (cuando existe, como en 3.1) podría desalinearse.
- **Perder formato APA**: Las `<li>` dentro de `.reference-list` o `.references-compact__body ul` pueden perder la sangría u otros estilos si se alteran.
- No hay riesgo de afectar la "Conceptos a repasar" o "Qué debes recordar" ya que el espacio de nombres BEM es completamente independiente (`.references-compact`).

## 7. Recomendación
- **Calibrar `main.css` ahora**:
  1. Limpiar el CSS local muerto (`.references-section`) de las lecciones si se hace migración, pero para este componente **el CSS BEM principal ya está centralizado** en `main.css`.
  2. Eliminar en `main.css` el selector conflictivo de la línea 5038 (`.references-compact__summary { grid-template-columns... }`) ya que la regla principal usa `display: flex` correctamente y el `grid` es inoperante.
  3. No se requiere agregar reglas nuevas de CSS, solo limpiar el conflicto menor para garantizar robustez, y validar mediante un prototipo que el patrón ya funciona de manera limpia.
