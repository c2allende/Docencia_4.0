# QA — Actividad 1.1: Rompiendo el Hielo "Hola Mundo Pedagógico"

**Archivo prototipo:** `actividad1_1_ux_carga_cognitiva_prototype.html`
**Fecha:** 2026-05-15
**Última actualización:** Reorganización instruccional con lectura progresiva y reducción de carga cognitiva
**Estado:** Prototipo — no producción

---

## Archivos modificados

| Archivo | Acción | Líneas |
|---------|--------|--------|
| `actividad1_1_ux_carga_cognitiva_prototype.html` | **Creado** desde producción con reorganización instruccional | 1622 líneas |
| `QA_actividad1_1_ux_carga_cognitiva.md` | **Creado** (este reporte) | — |

**Producción intacta:**
- `actividad1_1.html` — sin cambios (`git diff` = vacío)
- `scripts/progress-tracker.js` — sin cambios
- `scripts/auth-guard.js` — sin changes
- `scripts/module-access-guard.js` — sin cambios
- `scripts/interactive-board.js` — sin cambios
- `scripts/institutional-footer.js` — sin cambios
- `styles/main.css` — sin cambios

---

## Cambios de organización instruccional

### 1. Encabezado de la actividad
- **Producción:** título + intro + `technical-grid` con objetivo y duración
- **Prototipo:** título + intro + `activity-meta-grid` con chips de metadatos (duración + requisitos)
- **Mejora:** metadatos visibles como chips compactos en lugar de tarjetas grandes

### 2. Bloque "Propósito de la actividad"
- **Producción:** objetivo y duración mezclados en `technical-grid`
- **Prototipo:** `activity-purpose-card` con grid de 2 columnas:
  - Propósito general
  - Objetivo de la actividad
- **Mejora:** separación clara entre propósito y objetivo, con etiquetas descriptivas

### 3. Bloque "Secuencia de trabajo"
- **Producción:** 4 `instruction-step` con iconos emoji, siempre visibles
- **Prototipo:** 4 `activity-step-card` con `<details>`/`<summary>` progresivos:
  - Paso 1: Activación y acceso (abierto por defecto)
  - Paso 2: La interacción
  - Paso 3: Ejercicio "Hola Mundo Pedagógico"
  - Paso 4: Cierre y reflexión metacognitiva
- **Mejora:** lectura progresiva — el usuario abre solo el paso que necesita, reduciendo carga cognitiva

### 4. Paso 1 — Activación y acceso
- **Producción:** lista ordenada larga + `privacy-note`
- **Prototipo:** 4 subsecciones en grid 2 columnas:
  - Copilot DEPR
  - ChatGPT gratuito
  - Configuración de privacidad
  - Verificación de modelos LLM
- **Regla de oro:** recuadro destacado `activity-golden-rule` con fondo amarillo y borde lateral
- **Mejora:** subsecciones breves y escaneables, regla de oro visualmente prominente

### 5. Paso 2 — La interacción
- **Producción:** texto + `prompt-block` inline
- **Prototipo:** `activity-prompt-box` con etiqueta "Prompt del facilitador" + `activity-cognitive-note` sobre modelaje cognitivo
- **Mejora:** prompt diferenciado visualmente, nota de modelaje cognitivo destacada

### 6. Paso 3 — Ejercicio "Hola Mundo Pedagógico"
- **Producción:** 3 `choice-card` en grid siempre visibles
- **Prototipo:** 3 `activity-option-card` con `<details>` progresivos:
  - Opción A: El Administrativo
  - Opción B: El Creativo (con recordatorio de adaptar `[Tu Materia]` y `[Tu Tema]`)
  - Opción C: El Organizador
- **Mejora:** cada opción se abre independientemente, evitando muro de texto con 3 prompts largos

### 7. Paso 4 — Cierre y reflexión metacognitiva
- **Producción:** lista ordenada + `reflection-card`
- **Prototipo:** `activity-reflection-card` con preguntas etiquetadas:
  - Validación inicial
  - Pregunta clave de tiempo
  - Conclusión reflexiva
- **Idea central:** `activity-golden-rule--idea` con fondo cyan y borde primario
- **Mejora:** preguntas con etiquetas claras, idea central en recuadro destacado

### 8. Reflexión rápida: experiencia con el LLM
- **Producción:** sección con `reflection-card` + tablero interactivo
- **Prototipo:** idéntico a producción — tablero interactivo preservado sin cambios
- **Pregunta guía:** visible en `reflection-card`

---

## Clases CSS nuevas (encapsuladas bajo `.actividad1-1-prototype`)

| Clase | Propósito |
|-------|-----------|
| `.activity-meta-grid` | Grid de chips de metadatos |
| `.activity-meta-chip` | Chip individual con icono + label + valor |
| `.activity-purpose-card` | Tarjeta de propósito de la actividad |
| `.activity-purpose-card__grid` | Grid 2 columnas para propósito/objetivo |
| `.activity-purpose-card__item` | Item individual de propósito |
| `.activity-sequence` | Contenedor de secuencia de pasos |
| `.activity-step-card` | Tarjeta de paso con details/summary |
| `.activity-step-card__summary` | Encabezado del paso (número + label + focus) |
| `.activity-step-card__content` | Contenido del paso |
| `.activity-step-card__subsections` | Grid de subsecciones del Paso 1 |
| `.activity-step-card__subsection` | Subsección individual |
| `.activity-golden-rule` | Recuadro destacado para regla de oro |
| `.activity-golden-rule--idea` | Variante para idea central |
| `.activity-prompt-box` | Caja de prompt sugerido |
| `.activity-prompt-box__label` | Etiqueta de prompt |
| `.activity-cognitive-note` | Nota de modelaje cognitivo |
| `.activity-option-card` | Tarjeta de opción con details/summary |
| `.activity-option-card__badge` | Badge "Opción A/B/C" |
| `.activity-option-card__reminder` | Recordatorio de adaptar placeholders |
| `.activity-reflection-card` | Tarjeta de reflexión guiada |

---

## Criterios UX/UI cumplidos

### Reducción de carga cognitiva
- [x] Secciones claras con títulos jerárquicos
- [x] Tarjetas breves y escaneables
- [x] Lectura progresiva con `<details>`/`<summary>`
- [x] Recuadros destacados solo para ideas clave (regla de oro, idea central)
- [x] Prompts visualmente diferenciados con etiquetas
- [x] Sin muros de texto

### Jerarquía visual
- [x] Título principal → subtítulos → pasos numerados → prompts → reflexión final
- [x] Números de paso en badges cyan
- [x] Prompts en cajas con fondo diferenciado
- [x] Regla de oro en amarillo, idea central en cyan

### Responsive
- [x] Desktop: grid 2 columnas para propósito y subsecciones
- [x] Tablet (≤900px): colapsa a 1 columna
- [x] Móvil (≤768px): chips apilados, focus label oculto
- [x] Móvil pequeño (≤520px): padding reducido, números más pequeños
- [x] Sin overflow horizontal
- [x] Botones visibles y accesibles
- [x] Tarjetas con altura automática

### Consistencia
- [x] Mismos tokens de diseño que Lección 1.1, 1.2, 1.3
- [x] Mismos colores de marca (cyan primario, naranja CTA)
- [x] Mismas familias tipográficas (Plus Jakarta Sans + Manrope)
- [x] Mismos bordes, sombras, radios

---

## Criterios técnicos cumplidos

### Preservación de producción
- [x] `actividad1_1.html` sin cambios (`git diff` = vacío)
- [x] Header, navegación, sidebar intactos
- [x] Footer navigation intacto
- [x] Botón "Marcar como completado" (`#completion-section`) intacto
- [x] Scripts intactos: `progress-tracker.js`, `auth-guard.js`, `module-access-guard.js`, `interactive-board.js`, `institutional-footer.js`
- [x] Tablero interactivo nativo preservado sin cambios

### CSS
- [x] `main.css` sin cambios
- [x] CSS nuevo encapsulado bajo `.actividad1-1-prototype`
- [x] Sin colores hardcoded (usa tokens existentes)
- [x] Clases nuevas con namespace específico
- [x] CSS al final del bloque `<style>` existente

### Rutas
- [x] Rutas relativas correctas (`styles/main.css`, `scripts/*.js`)
- [x] Enlaces de navegación intactos (`leccion1_3.html`, `actividad1_2.html`)

---

## Contenido obligatorio verificado

| Bloque | Estado |
|--------|--------|
| Actividad 1.1 – Rompiendo el hielo: "Hola Mundo Pedagógico" | ✅ Presente |
| Propósito de la actividad (propósito general, objetivo, duración, requisitos) | ✅ Presente |
| Secuencia de trabajo (instrucciones generales + 4 pasos) | ✅ Presente |
| Paso 1. Activación y acceso (Copilot, ChatGPT, privacidad, verificación) | ✅ Presente |
| Paso 2. La interacción (prompt del facilitador + modelaje cognitivo) | ✅ Presente |
| Paso 3. Ejercicio "Hola Mundo Pedagógico" (Opciones A, B, C) | ✅ Presente |
| Paso 4. Cierre y reflexión metacognitiva | ✅ Presente |
| Reflexión rápida: experiencia con el LLM (pregunta guía + tablero) | ✅ Presente |
| Regla de oro destacada | ✅ Presente |
| Idea central destacada | ✅ Presente |

---

## Validación técnica

```bash
# Producción intacta
git diff docencia-4.0/actividad1_1.html
# (sin salida — archivo sin cambios)

# Prototipo creado
ls docencia-4.0/actividad1_1_ux_carga_cognitiva_prototype.html
# 1622 líneas

# main.css sin cambios
git diff docencia-4.0/styles/main.css
# (sin salida del prototipo)
```

---

## Estructura del prototipo

1. Top nav existente (sin cambios)
2. Sidebar existente (sin cambios)
3. Contenedor `.content-wrapper.actividad1-1-prototype`
4. **Encabezado:** título + intro + meta chips
5. **Propósito:** tarjeta con propósito general + objetivo
6. **Secuencia:** 4 pasos progresivos
   - Paso 1: subsecciones + regla de oro
   - Paso 2: prompt + nota cognitiva
   - Paso 3: 3 opciones progresivas
   - Paso 4: reflexión + idea central
7. **Reflexión rápida:** pregunta guía + tablero interactivo (sin cambios)
8. `#completion-section` (sin cambios)
9. Footer nav (sin cambios)
10. Scripts existentes (sin cambios)

---

## Enlaces locales

- **Prototipo:** `http://127.0.0.1:5000/actividad1_1_ux_carga_cognitiva_prototype.html`
- **QA:** `http://127.0.0.1:5000/QA_actividad1_1_ux_carga_cognitiva.md`
