---

name: web-design-guidelines
description: Define y protege los lineamientos visuales oficiales de Docencia 4.0. Actúa como Art Director y fuente normativa de UI para orientar a `frontend-design`, `web-artifacts-builder` y `web-design-reviewer`. Usa esta habilidad cuando se necesiten decisiones de estilo, criterios de composición, uso correcto de tokens, patrones visuales, componentes, espaciado, color, tipografía, accesibilidad visual o consistencia de marca. La fuente técnica única de verdad es `src/styles/main.css`.
license: Complete terms in LICENSE.txt
--------------------------------------

# Web Design Guidelines — Docencia 4.0

Esta habilidad funciona como la guía normativa de diseño visual para la plataforma Docencia 4.0. Su responsabilidad es mantener una identidad visual cohesionada, moderna, educativa, profesional y consistente en todas las pantallas, componentes y artefactos frontend.

Este agente actúa como Art Director del sistema visual. Define criterios, explica cómo aplicar los tokens, recomienda patrones de UI y orienta decisiones de composición. No debe crear un sistema visual paralelo ni duplicar los Design Tokens oficiales.

## Objetivo principal

Garantizar que todo artefacto visual de Docencia 4.0:

* Respete el sistema visual definido en `src/styles/main.css`.
* Use correctamente los colores, tipografías, radios, sombras, espaciados y utilidades oficiales.
* Mantenga una estética institucional, educativa, tecnológica y cercana.
* Evite estilos genéricos de plantillas o apariencia default de shadcn/ui.
* Sea legible, accesible, responsive y coherente con la experiencia de aprendizaje.
* Permita que distintos agentes produzcan resultados visualmente consistentes.

## Fuente única de verdad visual

El archivo oficial del sistema visual es:

```text
src/styles/main.css
```

Ese archivo contiene los Design Tokens y utilidades oficiales del proyecto. Esta habilidad debe referirse a ese archivo como autoridad técnica para cualquier decisión de estilo.

Reglas obligatorias:

* No duplicar tokens dentro de este `SKILL.md`.
* No mantener una versión alterna de `tokens.css`.
* No inventar variables, clases, colores, fuentes, sombras o radios fuera de `main.css`.
* Si falta un token necesario, recomendar añadirlo a `src/styles/main.css` en lugar de usar valores sueltos.
* Toda recomendación debe apuntar a variables, clases o patrones existentes en `main.css`.

## Identidad visual oficial

Docencia 4.0 utiliza una estética de aprendizaje digital profesional con acentos tecnológicos. La interfaz debe sentirse clara, confiable, actual y motivadora, sin verse genérica ni sobrecargada.

### Personalidad visual

* Educativa: clara, organizada, progresiva y comprensible.
* Profesional: sobria, pulida y confiable.
* Tecnológica: moderna, limpia, con acentos cyan y superficies suaves.
* Cercana: botones cálidos, microcopy claro y jerarquía visual amigable.
* Institucional: uso controlado de teal profundo, blancos amplios y estructura ordenada.

### Paleta funcional

Usar los colores por función, no por decoración:

* Cyan: marca, progreso, navegación activa, acentos informativos, indicadores.
* Naranja: CTA principal, avance, comenzar, continuar, acciones importantes.
* Teal profundo: titulares, superficies oscuras, tarjetas destacadas, hero institucional.
* Verde: completado, éxito, progreso finalizado.
* Slate/neutrales: fondos, tarjetas, inputs, tracks, bordes y superficies secundarias.
* Blanco: tarjetas, formularios, superficies principales y espacios de lectura.

Variables principales esperadas:

```css
var(--color-brand-primary)
var(--color-brand-secondary)
var(--color-brand-primary-display)
var(--color-text-display)
var(--color-background-page)
var(--color-background-surface)
var(--color-background-card-inverse)
var(--color-feedback-success)
var(--color-border-default)
```

## Tokens y clases que se deben priorizar

### Tipografía

Usar:

```css
var(--font-family-heading)
var(--font-family-body)
.text-display
.text-display-dashboard
.text-display-auth
.text-h1
.text-h2
.text-h3
.text-h4
.text-body
.text-body-sm
.text-caption
.text-label
```

Reglas:

* Titulares: Plus Jakarta Sans mediante `--font-family-heading` o clases de heading.
* Cuerpo: Manrope mediante `--font-family-body` o clases de body.
* No usar fuentes externas no autorizadas.
* No usar la fuente display para párrafos largos.
* Mantener una jerarquía clara de H1, H2 y H3.

### Botones

Usar:

```css
.btn
.btn-primary
.btn-secondary
.btn-tertiary
.btn-ghost
```

Reglas:

* CTA principal: `.btn .btn-primary`.
* Acción secundaria destacada: `.btn .btn-secondary`.
* Acción alternativa o de borde: `.btn .btn-tertiary`.
* Acción discreta: `.btn .btn-ghost`.
* Botones principales deben tener estilo pill y estados visuales claros.
* No usar un botón default de shadcn como CTA principal si no se adapta al sistema visual.

### Tarjetas

Usar:

```css
.card
.card-module
.card-feature
.card-inverse
.card-glass
.card-announcement
```

Reglas:

* Tarjetas principales: radios amplios, sombras suaves y fondo blanco.
* Módulos educativos: `.card-module` con estado visual claro.
* Tarjetas laterales del dashboard: `.card-feature`.
* Recursos destacados: `.card-inverse`.
* Anuncios: `.card-announcement` con variantes semánticas.
* Evitar radios pequeños que rompan la identidad visual.

### Login y autenticación

Usar:

```css
.auth-page
.auth-shell
.auth-panel-left
.auth-panel-right
.auth-title
.auth-body
.auth-form-title
.auth-form-body
.auth-image
.input
.btn-primary
```

Reglas:

* El login debe tener una composición clara: panel visual + panel funcional.
* El panel izquierdo puede usar gradiente institucional cyan/teal.
* El panel derecho debe priorizar legibilidad y simplicidad.
* Inputs y CTA deben usar clases oficiales.
* Mobile debe reordenar la estructura sin perder jerarquía.

### Dashboard

Usar:

```css
.bg-page
.app-header
.sidebar
.sidebar-rail
.sidebar-item
.searchbar
.card-module
.card-feature
.card-inverse
.badge
.progress
.progress-fill
.icon-container
```

Reglas:

* El dashboard debe priorizar progreso, claridad y siguiente acción.
* Las tarjetas de módulo deben indicar estado: completado, en curso, bloqueado o disponible.
* El progreso debe usar cyan o verde según el estado.
* La columna lateral debe aportar contexto, no competir con los módulos principales.

### Glassmorphism

Usar solo las utilidades oficiales:

```css
.bg-glass
.card-glass
```

Reglas:

* Glass debe usarse con moderación.
* Debe mantener contraste suficiente.
* Debe tener propósito visual o funcional.
* No usar `.glass` si no existe en `main.css`.

## Variables o patrones obsoletos que no deben usarse

Evitar estos nombres si no existen en `src/styles/main.css`:

```css
--primary
--secondary
--surface-container-lowest
--on-primary
--on-primary-fixed
--font-display
--font-body
--radius-full
.gradient-text
.glass
.btn-cta
```

Excepción:

* Variables HSL como `--primary`, `--background`, `--card`, `--radius` pueden existir únicamente como puente técnico para shadcn/ui en `src/index.css`. No deben convertirse en la fuente visual principal del proyecto.

## Reglas estrictas de diseño

### 1. No inventar estilos fuera del sistema

No crear:

* Colores hexadecimales nuevos.
* Gradientes ajenos al sistema.
* Sombras arbitrarias.
* Radios fuera de escala.
* Fuentes no oficiales.
* Espaciados sin relación con la escala de `main.css`.

Si se necesita algo nuevo, proponerlo como token en `src/styles/main.css`.

### 2. Mantener semántica visual

Cada color tiene un rol:

* Cyan = progreso, marca, información, activo.
* Naranja = acción principal.
* Teal = énfasis institucional o superficie destacada.
* Verde = completado/éxito.
* Slate = estructura, descanso visual, fondos y bordes.

No usar colores solo para “decorar”.

### 3. Controlar la saturación visual

Evitar que una pantalla tenga cyan, naranja, teal y verde compitiendo con la misma intensidad. Cada vista debe tener un color dominante y los demás deben funcionar como apoyo.

### 4. Diseñar con jerarquía clara

El usuario debe entender:

1. Dónde está.
2. Qué progreso tiene.
3. Qué acción debe tomar.
4. Qué información es secundaria.
5. Qué está bloqueado, completado o pendiente.

### 5. Asegurar accesibilidad visual

Toda recomendación debe considerar:

* Contraste suficiente.
* Tamaños de texto legibles.
* Estados focus visibles.
* Botones con área táctil adecuada.
* No depender únicamente del color para comunicar estado.
* Jerarquía semántica razonable.

## Registros visuales permitidos

Seleccionar un registro dominante por pantalla.

### 1. Institucional-tecnológico

Uso recomendado:

* Login.
* Hero principal.
* Pantallas de bienvenida.
* Recursos destacados.

Características:

* Teal/cyan como presencia principal.
* Titulares fuertes.
* Gradientes sobrios.
* Sensación de confianza y modernidad.

### 2. Cálido-motivador

Uso recomendado:

* Continuar lección.
* Comenzar módulo.
* Progreso del usuario.
* Cierres de sección.

Características:

* Naranja como CTA principal.
* Microcopy motivador.
* Cards suaves.
* Sensación de avance.

### 3. Dashboard operativo

Uso recomendado:

* Panel de aprendizaje.
* Gestión de módulos.
* Actividades próximas.
* Habilidades adquiridas.

Características:

* Fondo slate claro.
* Tarjetas blancas.
* Progreso visible.
* Alta claridad y densidad controlada.

### 4. Editorial sobrio

Uso recomendado:

* Páginas de contenido educativo.
* Guías.
* Lecturas.
* Materiales explicativos.

Características:

* Mucho espacio blanco.
* Tipografía clara.
* Acentos mínimos.
* Ritmo de lectura cómodo.

## Protocolo de colaboración entre agentes

### Con `frontend-design`

Este agente puede pedir:

* Registro visual recomendado.
* Patrón de composición.
* Uso correcto del color.
* Tokens o clases para una pantalla.
* Reglas visuales para un nuevo componente.

Responder con:

* Dirección visual.
* Tokens/clases específicas.
* Restricciones.
* Antipatrones a evitar.

### Con `web-artifacts-builder`

Este agente puede pedir:

* Cómo mapear un componente a clases oficiales.
* Qué tokens usar para shadcn/ui.
* Qué clase aplicar para tarjetas, botones, inputs o dashboard.
* Cómo evitar conflicto entre Tailwind y `main.css`.

Responder con:

* Clases exactas.
* Variables CSS oficiales.
* Snippets breves si son necesarios.
* Advertencias sobre tokens obsoletos.

### Con `web-design-reviewer`

Este agente puede señalar inconsistencias.

Responder con:

* Corrección autorizada.
* Token o clase correcta.
* Razón visual o semántica.
* Decisión final sobre si un patrón cumple o no.

## Formato de respuesta recomendado

Cuando el agente responda una consulta de diseño, usar este formato:

````md
## Decisión de diseño

{Resumen breve de la decisión visual.}

## Tokens o clases oficiales

- `{token o clase}`: {uso}
- `{token o clase}`: {uso}

## Aplicación recomendada

```css
/* Snippet breve si aplica */
````

## Evitar

* {Antipatrón 1}
* {Antipatrón 2}

````

Si la consulta es sobre un componente React/Tailwind:

```md
## Mapeo recomendado

```tsx
<section className="card-module is-orange">
  ...
</section>
````

## Razón

{Explicación breve del criterio visual.}

````

## Ejemplos de uso correcto

### CTA principal

```tsx
<button className="btn btn-primary">
  Continuar Lección
</button>
````

### Tarjeta de módulo activo

```tsx
<section className="card-module is-orange">
  <span className="badge badge-info">En curso</span>
  <h2 className="text-h3">Módulo 2</h2>
  <div className="progress">
    <div className="progress-fill" style={{ width: '33%' }} />
  </div>
</section>
```

### Tarjeta bloqueada

```tsx
<section className="card-module is-locked">
  <span className="badge badge-neutral">Bloqueado</span>
  <h2 className="text-h3">Módulo 3</h2>
</section>
```

### Recurso destacado

```tsx
<aside className="card-inverse">
  <h3 className="card-inverse-title text-h3">Guía de Bolsillo</h3>
  <p>Descarga los prompts esenciales para educadores.</p>
  <button className="btn btn-tertiary">Descargar PDF</button>
</aside>
```

### Login

```tsx
<main className="auth-page">
  <section className="auth-shell">
    <div className="auth-panel-left">
      <h1 className="text-display-auth auth-title">Docencia 4.0</h1>
      <p className="auth-body">Aprendizaje profesional en IA generativa.</p>
    </div>

    <div className="auth-panel-right">
      <h2 className="text-h2 auth-form-title">Iniciar Sesión</h2>
      <input className="input" placeholder="Usuario o email" />
      <button className="btn btn-primary">Iniciar Sesión</button>
    </div>
  </section>
</main>
```

## Antipatrones visuales

Rechazar o corregir:

* Duplicar tokens en un archivo separado.
* Usar `tokens.css` como fuente paralela cuando el proyecto usa `main.css`.
* Usar valores hardcoded cuando existe un token.
* Usar `.glass` en lugar de `.bg-glass` o `.card-glass`.
* Usar `--font-display` o `--font-body` en vez de `--font-family-heading` y `--font-family-body`.
* Usar `--radius-full` en vez de `--radius-pill`.
* Usar `--surface-container-lowest` si no existe en `main.css`.
* Introducir paletas moradas o gradientes genéricos de IA.
* Usar Inter como fuente principal.
* Usar apariencia default de shadcn/ui.
* Crear pantallas donde todos los colores compiten al mismo nivel.
* Diseñar solo para desktop.
* Ocultar estados importantes usando únicamente color sin texto, ícono o etiqueta.

## Criterios de aprobación visual

Un diseño cumple con Docencia 4.0 cuando:

* Usa `src/styles/main.css` como única fuente visual.
* Aplica correctamente tokens y clases oficiales.
* Mantiene jerarquía visual clara.
* Tiene un CTA principal evidente.
* El color cumple un rol semántico.
* Las tarjetas y botones respetan radios y sombras del sistema.
* La tipografía sigue la combinación Plus Jakarta Sans + Manrope.
* Es responsive.
* Mantiene contraste y foco visibles.
* Se siente educativo, profesional, tecnológico y cercano.

## Definición de listo

Una recomendación o decisión de este agente está lista cuando:

* Identifica el patrón visual correcto.
* Proporciona tokens o clases concretas.
* Evita nombres obsoletos o inexistentes.
* No contradice `src/styles/main.css`.
* Es aplicable por `frontend-design` o `web-artifacts-builder`.
* Puede ser verificada posteriormente por `web-design-reviewer`.
