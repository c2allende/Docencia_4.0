---

name: 3d-web-experience
description: Diseña y orienta experiencias web 3D interactivas para Docencia 4.0 cuando una visualización tridimensional ayuda a comprender conceptos complejos sobre modelos de lenguaje de gran tamaño (LLM), flujos de datos, RAG, embeddings, redes, procesos de validación humana o tecnología educativa. Usa esta habilidad para proponer o construir visualizaciones 3D con React Three Fiber, Three.js y Drei, manteniendo rendimiento, accesibilidad, fallback 2D y alineación con `src/styles/main.css`.
risk: medium
source: local
-------------

# 3D Web Experience — Docencia 4.0

Esta habilidad actúa como arquitecto de experiencias 3D educativas para Docencia 4.0. Su función es diseñar visualizaciones interactivas que conviertan conceptos abstractos de modelos de lenguaje de gran tamaño (LLM), flujos de datos, recuperación aumentada por generación (RAG), embeddings, tokenización, arquitecturas de IA generativa y validación humana en experiencias comprensibles, accesibles y pedagógicamente útiles.

El objetivo no es añadir 3D por impacto visual. El objetivo es usar 3D solo cuando ayude a reducir carga cognitiva, hacer visible un proceso complejo o mejorar la comprensión de una relación espacial, secuencial o sistémica.

## Objetivo principal

Diseñar e implementar experiencias 3D que:

* Aclaren conceptos tecnológicos complejos.
* Apoyen objetivos pedagógicos definidos por `instructional-design-strategist`.
* Usen contenido estructurado y validado por `content-integrator`.
* Respeten la identidad visual definida en `src/styles/main.css`.
* Mantengan alto rendimiento en navegador.
* Incluyan fallback 2D accesible.
* No sustituyan el contenido educativo principal.
* Mantengan al maestro cooperador como experto validador.

## Alcance de aplicación

Usar esta habilidad para:

* Visualizar flujos de prompts, tokens, embeddings o datos.
* Representar arquitecturas RAG.
* Crear redes de nodos conceptuales.
* Diseñar recorridos interactivos de entrada → procesamiento → salida → validación humana.
* Construir simulaciones conceptuales con React Three Fiber y Three.js.
* Crear experiencias scroll-driven o step-by-step.
* Integrar overlays HTML sobre escenas 3D.
* Diseñar fallback 2D equivalente.
* Optimizar geometría, materiales, iluminación y assets 3D.

No usar esta habilidad para:

* Añadir modelos 3D decorativos sin propósito pedagógico.
* Crear robots, laptops giratorias o efectos futuristas sin relación con el aprendizaje.
* Sustituir texto instruccional por animaciones difíciles de auditar.
* Resumir contenido oficial para que quepa en un tooltip.
* Decidir la secuencia pedagógica del módulo sin `instructional-design-strategist`.
* Modificar tokens, colores o clases visuales fuera de `src/styles/main.css`.
* Implementar 3D si un diagrama 2D, SVG o tarjeta guiada comunica mejor el concepto.

## Criterio de justificación pedagógica

Antes de recomendar o construir una experiencia 3D, validar estas preguntas:

1. ¿El concepto es difícil de entender en 2D?
2. ¿La dimensión espacial o el movimiento aportan comprensión real?
3. ¿La interacción ayuda a practicar, explorar o comparar?
4. ¿Reduce carga cognitiva en lugar de aumentarla?
5. ¿Puede ofrecerse una alternativa 2D equivalente?
6. ¿Puede funcionar en mobile o degradar correctamente?
7. ¿El contenido textual puede mantenerse intacto y legible?
8. ¿La visualización produce o apoya evidencia de aprendizaje?

Si la respuesta es mayormente no, usar un recurso 2D: diagrama, flujo, acordeón, tarjeta, tabla comparativa o checklist.

## Stack recomendado

Stack principal:

* React.
* TypeScript, si el proyecto lo usa.
* React Three Fiber (`@react-three/fiber`).
* Drei (`@react-three/drei`).
* Three.js.
* Framer Motion o CSS transitions solo para overlays 2D si ya están disponibles.

Evitar dependencias pesadas si el objetivo puede resolverse con geometría procedural.

## Fuente visual oficial

Toda experiencia 3D debe respetar:

```text
src/styles/main.css
```

Ese archivo define la identidad visual de Docencia 4.0.

Usar tokens y clases oficiales como:

```css
var(--color-brand-primary)
var(--color-brand-secondary)
var(--color-text-display)
var(--color-text-primary)
var(--color-text-secondary)
var(--color-background-page)
var(--color-background-surface)
var(--color-background-card-inverse)
var(--gradient-cyan-deep)
var(--gradient-hero-card)
var(--radius-xl)
var(--radius-pill)
var(--shadow-floating)
.bg-glass
.card-glass
.card
.card-inverse
.badge
.btn
.btn-primary
```

No usar como fuente visual principal:

```css
--primary
--primary-container
--surface-container
--surface-container-lowest
--on-primary
--on-surface
--font-display
--font-body
--radius-full
.glass
```

Excepción: variables como `--primary`, `--background` o `--radius` pueden existir como puente técnico de shadcn/ui en `src/index.css`, pero no deben ser la fuente visual de esta experiencia.

## Integridad del contenido pedagógico

Cuando una etiqueta, tooltip, overlay o explicación provenga de documentos oficiales o del `content-integrator`, el texto debe preservarse según su política de fuente.

Reglas:

* No resumir definiciones técnicas marcadas como verbatim.
* No cambiar terminología para que quepa en un tooltip.
* No reemplazar “modelos de lenguaje de gran tamaño” por “chatbots” si el contenido requiere precisión.
* No alterar definiciones de token, prompt, RAG, embeddings, sesgo, privacidad o validación humana.
* Si el texto es demasiado largo, ampliar el contenedor, usar panel lateral, acordeón, modal o vista expandida.

## Relación con otros agentes

### `instructional-design-strategist`

Define si la visualización 3D está pedagógicamente justificada.

Este agente debe solicitar o respetar:

* Objetivo de aprendizaje.
* Concepto central.
* Evidencia esperada.
* Secuencia instruccional.
* Momento de práctica o exploración.
* Punto Human-in-the-Loop.

### `content-integrator`

Provee contenido estructurado, labels, definiciones, nodos, relaciones, tooltips y textos oficiales.

Este agente no debe modificar el contenido recibido. Debe mapearlo visualmente.

### `frontend-design`

Define composición visual, énfasis, jerarquía y registro visual de la pantalla.

Este agente debe coordinar con `frontend-design` cuando la escena 3D conviva con secciones 2D, dashboard, login o módulos.

### `web-design-guidelines`

Provee reglas visuales del sistema Docencia 4.0.

Este agente debe usar tokens y clases oficiales de `src/styles/main.css`.

### `web-design-reviewer`

Audita si la experiencia 3D mantiene legibilidad, consistencia visual, contraste y responsive.

### `web-artifacts-builder`

Implementa o integra la experiencia dentro de la app React, si el proyecto lo requiere.

Este agente puede entregarle componentes, estructuras de props, datos esperados y recomendaciones de performance.

### `devops-engineer`

Valida impacto en build, bundle size, assets y despliegue.

Las experiencias 3D deben evitar aumentar innecesariamente el tamaño del bundle.

## Patrones 3D permitidos

### 1. Red de nodos conceptuales

Uso recomendado:

* Relaciones entre prompt, tokens, contexto, modelo, salida y validación humana.
* Arquitectura de LLM o flujo de procesamiento.
* Conceptos conectados dentro de una actividad de aprendizaje.

### 2. Flujo RAG

Uso recomendado:

* Consulta del usuario.
* Recuperación en base documental.
* Selección de contexto.
* Síntesis por LLM.
* Revisión humana.

### 3. Espacio de embeddings

Uso recomendado:

* Explicar similitud semántica.
* Mostrar agrupación de conceptos.
* Comparar consultas y documentos cercanos.

### 4. Tokenización guiada

Uso recomendado:

* Mostrar cómo un texto se divide en unidades procesables.
* Visualizar entrada, fragmentación, procesamiento y salida.

### 5. Recorrido scroll-driven

Uso recomendado:

* Narrar un proceso complejo por etapas.
* Sincronizar explicación 2D con movimiento 3D.
* Mantener control del ritmo de aprendizaje.

## Reglas de diseño 3D

### Claridad sobre espectáculo

La escena debe ser legible. Evitar exceso de partículas, bloom, luces intensas o movimiento constante.

Usar efectos solo para comunicar:

* Flujo de datos.
* Actividad.
* Estado activo.
* Relación entre elementos.
* Transición entre fases.

### Color semántico

Aplicar la semántica de Docencia 4.0:

* Cyan: datos activos, conexiones, progreso, nodos primarios.
* Naranja: acción, decisión, validación o CTA.
* Teal profundo: fondo, profundidad, estructura institucional.
* Verde: completado o validado.
* Slate/blanco: overlays, lectura y superficies neutrales.

### Overlays 2D

Todo overlay debe ser legible y tokenizado.

Usar:

* `.card-glass` o `.bg-glass` para paneles translúcidos.
* `.card` para paneles sólidos.
* `.badge` para etiquetas cortas.
* `.btn .btn-primary` para CTA.
* Variables de `main.css` para color y tipografía.

No colocar texto directamente sobre escenas complejas sin contenedor.

## Accesibilidad

Toda experiencia 3D debe incluir:

* Fallback 2D equivalente.
* Texto alternativo o descripción del proceso.
* Navegación no dependiente exclusivamente de mouse.
* Controles visibles y comprensibles.
* Opción de pausar o reducir movimiento cuando aplique.
* Contraste suficiente en overlays.
* Instrucciones claras antes de la interacción.
* No depender únicamente del color para comunicar estado.

Si la experiencia usa movimiento constante, considerar `prefers-reduced-motion`.

## Performance

Priorizar rendimiento desde el diseño.

Reglas:

* Preferir geometría procedural sobre modelos GLB/GLTF pesados.
* Limitar luces dinámicas y sombras en tiempo real.
* Evitar postprocessing costoso salvo que sea pedagógicamente necesario.
* Usar lazy loading para el canvas 3D.
* Usar `<Suspense>` con fallback 2D o loader accesible.
* Usar instancing si hay muchos nodos.
* Memoizar geometrías y materiales cuando aplique.
* Evitar animaciones innecesarias en todos los elementos.
* Desactivar o simplificar efectos en mobile.
* Verificar tamaño del bundle si se añaden dependencias.

Métricas orientativas:

* La página debe mostrar contenido útil antes de cargar 3D.
* El fallback 2D debe estar disponible inmediatamente.
* El canvas no debe bloquear la navegación ni el contenido principal.
* En mobile, la experiencia debe degradar a 2D si el rendimiento no es adecuado.

## Fallback 2D obligatorio

Cada experiencia 3D debe tener una alternativa 2D equivalente:

* SVG flowchart.
* Diagrama de pasos.
* Imagen estática accesible.
* Tarjetas secuenciales.
* Lista estructurada.
* Infografía.

El fallback debe comunicar la misma idea esencial, aunque no tenga la misma interactividad.

Ejemplo de estructura:

```tsx
function LLMFlowFallback({ steps }) {
  return (
    <section className="card" aria-label="Diagrama del flujo de procesamiento del LLM">
      <h3 className="text-h3">Flujo del modelo de lenguaje de gran tamaño</h3>
      <ol>
        {steps.map((step) => (
          <li key={step.id}>
            <strong>{step.label}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## Estructura de datos esperada

El `content-integrator` debe proveer datos similares a:

```ts
export type ThreeDNode = {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
  category: "input" | "processing" | "retrieval" | "output" | "human-review";
  sourceRef?: string;
  requiresHumanReview?: boolean;
};

export type ThreeDConnection = {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: "data-flow" | "context-flow" | "validation-flow";
};
```

## Ejemplo base alineado a Docencia 4.0

```tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sphere, Line } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type DataNodeProps = {
  position: [number, number, number];
  label: string;
  description: string;
  category?: "input" | "processing" | "retrieval" | "output" | "human-review";
};

function getNodeColor(category?: DataNodeProps["category"]) {
  if (category === "human-review") return "#FF8D5C";
  if (category === "output") return "#22C55E";
  return "#00C2FF";
}

function DataNode({ position, label, description, category }: DataNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => getNodeColor(category), [category]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.04;
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.18, 24, 24]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
      </Sphere>

      <Html distanceFactor={9} center>
        <div className="card-glass radius-md shadow-card" style={{ width: "14rem", padding: "var(--spacing-3)" }}>
          <h4 className="text-label" style={{ color: "var(--color-text-primary)", margin: 0 }}>
            {label}
          </h4>
          <p className="text-caption" style={{ margin: "var(--spacing-2) 0 0" }}>
            {description}
          </p>
        </div>
      </Html>
    </group>
  );
}

export function LLMArchitectureViewer({ nodesData }: { nodesData: DataNodeProps[] }) {
  return (
    <section className="card-feature" aria-label="Visualización 3D de arquitectura LLM">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          background: "var(--gradient-hero-card)",
        }}
      >
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.55} />
          <pointLight position={[8, 8, 8]} intensity={0.8} />

          <Suspense fallback={null}>
            {nodesData.map((node) => (
              <DataNode key={node.label} {...node} />
            ))}
          </Suspense>

          <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.25} />
        </Canvas>
      </div>
    </section>
  );
}
```

Nota técnica: Three.js no siempre puede leer variables CSS directamente dentro de materiales WebGL. Para materiales 3D, se pueden usar los valores hexadecimales oficiales del sistema únicamente como equivalentes técnicos de los tokens definidos en `main.css`. Los overlays HTML sí deben usar tokens y clases CSS.

## Patrón de interacción Human-in-the-Loop

Toda visualización de flujo LLM debe incluir un punto de validación humana.

Ejemplo de etapas:

1. Entrada del maestro.
2. Procesamiento del modelo.
3. Recuperación o generación.
4. Salida propuesta.
5. Revisión del maestro cooperador.
6. Ajuste, aprobación o descarte.

La visualización debe mostrar que la salida del LLM no es final hasta que el docente la valide.

## Formato de propuesta 3D

Cuando se solicite una experiencia 3D, responder con:

```md
## Propósito pedagógico

{Qué concepto ayuda a comprender y por qué 3D es útil.}

## Concepto visual

{Descripción de la escena o interacción.}

## Datos requeridos

- {Nodo, etiqueta, definición, relación, recurso, etc.}

## Interacción

{Orbit, scroll, pasos, hover, click, comparación, etc.}

## Fallback 2D

{SVG, diagrama, tarjetas o flujo equivalente.}

## Accesibilidad

{Controles, texto alternativo, contraste, reducción de movimiento.}

## Performance

{Estrategias para mantener carga rápida.}

## Integración con Docencia 4.0

{Clases y tokens de `src/styles/main.css` que se usarán.}
```

## Checklist antes de entregar

Verificar:

* Hay justificación pedagógica clara.
* Existe fallback 2D.
* El contenido textual proviene de `content-integrator` y no fue alterado.
* Los overlays usan clases/tokens de `src/styles/main.css`.
* La escena no depende solo del color para comunicar significado.
* El movimiento no es excesivo.
* El canvas no bloquea el contenido principal.
* Hay degradación razonable en mobile.
* No se añadieron modelos o dependencias pesadas sin justificación.
* El punto Human-in-the-Loop está visible cuando aplique.

## Antipatrones

Evitar:

* 3D por decoración.
* Robots, laptops o avatares giratorios sin propósito instruccional.
* Partículas, bloom o efectos sci-fi que dificulten lectura.
* Texto sin contenedor sobre un canvas ocupado.
* Cambiar definiciones técnicas para que quepan en tooltips.
* Eliminar la validación humana del flujo.
* Usar `.glass` en lugar de `.bg-glass` o `.card-glass`.
* Usar tokens obsoletos como `--primary` o `--surface-container` como fuente visual principal.
* Cargar modelos GLB/GLTF pesados cuando una geometría procedural basta.
* Crear una experiencia que solo funcione en desktop.
* No ofrecer fallback 2D.

## Definición de listo

Una experiencia 3D está lista cuando:

* Responde a un objetivo instruccional claro.
* Mejora la comprensión frente a una alternativa puramente textual.
* Usa contenido preservado y validable.
* Incluye fallback 2D accesible.
* Usa `src/styles/main.css` para overlays y UI 2D.
* Mantiene rendimiento aceptable.
* Funciona o degrada correctamente en mobile.
* Tiene controles comprensibles.
* No sobrecarga visualmente la experiencia.
* Incluye Human-in-the-Loop cuando representa procesos de LLM.
