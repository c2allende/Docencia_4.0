---
name: ui-ux-pedagogico-avanzado
description: Especialista en diseño UI/UX pedagógico para herramientas educativas, plantillas rellenables, instrumentos digitales y materiales didácticos exportables a PDF dentro del ecosistema visual Docencia 4.0. Optimiza estética institucional, accesibilidad, DUA, flujo pedagógico y fidelidad visual usando main.css como fuente única de verdad.
---

# Skill: UI/UX Pedagógico Avanzado — Docencia 4.0

Esta habilidad capacita al agente para diseñar, revisar y mejorar interfaces educativas de alta fidelidad, plantillas rellenables, validadores, generadores de prompts, instrumentos didácticos y recursos descargables en PDF profesional, manteniendo siempre la identidad visual oficial de Docencia 4.0.

El objetivo principal es lograr materiales funcionales, accesibles, pedagógicamente claros y visualmente consistentes con el sistema de diseño del proyecto.

---

## Fuente única de verdad visual

El agente debe usar obligatoriamente:

`styles/main.css`

como fuente única de verdad para colores, tipografías, espaciado, sombras, bordes, radios, componentes y patrones visuales.

No debe crear un sistema visual paralelo ni redefinir tokens dentro de cada HTML si ya existen en `main.css`.

### Tokens y clases prioritarias

El agente debe priorizar:

- `--color-brand-primary`
- `--color-brand-secondary`
- `--color-text-display`
- `--color-background-page`
- `--color-background-surface`
- `--color-background-surface-low`
- `--color-text-primary`
- `--color-text-secondary`
- `--font-family-heading`
- `--font-family-body`
- `--spacing-*`
- `--radius-*`
- `--shadow-*`

Clases base recomendadas:

- `.top-nav`
- `.module-sidebar`
- `.lesson-card`
- `.activity-card`
- `.page-card`
- `.forum-shell`
- `.btn`
- `.btn-primary`
- `.btn-secondary`
- `.btn-tertiary`
- `.card`
- `.card-module`
- `.card-feature`
- `.card-glass`
- `.input`
- `.searchbar`
- `.badge`
- `.progress`
- `.audio-player-container`
- `.genially-frame-wrap`
- `.image-zoom-trigger`
- `.modal-zoom`
- `.references-section`
- `.footer-nav`
- `.btn-scroll-top`

---

## Principios de diseño maestro

### 1. Identidad visual institucional

El diseño debe proyectar una estética profesional, limpia, moderna e institucional, alineada con Docencia 4.0.

Debe usar:

- cyan como color primario de marca,
- naranja como CTA principal,
- teal profundo para títulos display,
- superficies claras tipo slate,
- tarjetas blancas o glass controlado,
- sombras suaves,
- bordes redondeados amplios,
- jerarquía visual clara.

No debe usar colores primarios genéricos, paletas nuevas, gradientes externos, modo oscuro no aprobado o valores hardcoded como primera opción.

### 2. Tipografía

El agente debe usar las familias oficiales:

- `var(--font-family-heading)` para títulos, encabezados, botones destacados y etiquetas principales.
- `var(--font-family-body)` para párrafos, instrucciones, formularios y contenido extenso.

No debe sustituir la identidad tipográfica por Inter, Roboto, Arial u otra fuente, salvo instrucción explícita del director del proyecto.

### 3. Microinteracciones

Las microinteracciones deben ser sutiles y funcionales:

- hover suave,
- focus visible,
- transición controlada,
- estados activos,
- estados deshabilitados,
- retroalimentación visual clara.

Deben usar los tokens de movimiento existentes:

- `--motion-duration-default`
- `--motion-duration-emphasis`
- `--motion-easing-standard`

No deben añadirse animaciones excesivas que distraigan del propósito pedagógico.

---

## UX pedagógica

### 1. Flujo lógico del docente

Las herramientas deben estructurarse siguiendo flujos pedagógicos naturales, por ejemplo:

1. Comprender
2. Planificar
3. Crear
4. Validar
5. Refinar
6. Descargar o entregar

Cuando aplique, el agente debe presentar el flujo en pasos visibles, tarjetas, secciones numeradas o bloques progresivos.

### 2. Reducción de carga cognitiva

El agente debe:

- agrupar información relacionada en tarjetas,
- evitar pantallas densas,
- usar espacios en blanco generosos,
- separar instrucciones de campos rellenables,
- destacar acciones principales,
- limitar la cantidad de decisiones simultáneas.

### 3. Feedback visual

Debe usar estados consistentes:

- éxito: tokens de success,
- advertencia: tokens de warning,
- error: tokens de error,
- información: tokens de info/cyan.

El feedback debe ser claro, no alarmista y pedagógicamente útil.

### 4. Rol Human-in-the-Loop

Cuando la herramienta incluya generación, revisión o validación con IA, debe recordar que el docente o administrador conserva la responsabilidad final de revisar, adaptar, validar y aprobar el producto.

---

## Accesibilidad y DUA

El agente debe aplicar principios de accesibilidad y Diseño Universal para el Aprendizaje.

Debe verificar:

- contraste suficiente,
- foco visible,
- navegación por teclado,
- estructura semántica HTML5,
- etiquetas `label` asociadas a inputs,
- textos alternativos en imágenes,
- botones con `aria-label` cuando sea necesario,
- modales con `role="dialog"` y `aria-modal="true"`,
- cierre de modales con tecla Escape,
- diseño responsive para móvil, tablet y laptop.

El contenido debe ser claro, segmentado y usable en talleres presenciales o virtuales.

---

## Patrones técnicos obligatorios para PDF

### Técnica Mirror Div

Cuando una herramienta incluya `textarea` extensos y se exporte a PDF con `html2pdf.js`, el agente debe evitar que el contenido se trunque.

Debe implementar:

1. Un `div` espejo oculto en pantalla con clase `.print-mirror`.
2. Sincronización en tiempo real entre el `textarea` y el `div`.
3. En impresión o durante `onclone`, ocultar el `textarea` y mostrar el `div`.
4. Preservar saltos de línea con `white-space: pre-wrap`.

Ejemplo conceptual:

```html
<textarea id="respuesta"></textarea>
<div id="respuestaMirror" class="print-mirror" aria-hidden="true"></div>