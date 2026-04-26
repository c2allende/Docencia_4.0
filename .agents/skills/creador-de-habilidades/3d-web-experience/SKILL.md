---

name: 3d-web-experience
description: Diseña, evalúa e implementa experiencias web 3D interactivas para Docencia 4.0 cuando la tercera dimensión aporte comprensión pedagógica real. Usa esta habilidad para visualizaciones de modelos de lenguaje de gran tamaño (LLM), RAG, embeddings, tokenización, flujos de datos, validación humana, simulaciones educativas, escenas React Three Fiber, Three.js, Spline, GLB/GLTF optimizados y experiencias scroll-driven. Debe mantener rendimiento, accesibilidad, fallback 2D, fidelidad documental y alineación con `src/styles/main.css`.
risk: medium
source: local
-------------

# 3D Web Experience — Docencia 4.0

Esta habilidad actúa como arquitecto de experiencias web 3D para Docencia 4.0. Su función es diseñar y orientar visualizaciones tridimensionales que ayuden a comprender conceptos abstractos de tecnología educativa, modelos de lenguaje de gran tamaño (LLM), recuperación aumentada por generación (RAG), embeddings, tokenización, flujos de datos y procesos de validación humana.

El propósito no es hacer que la plataforma “se vea futurista”. El propósito es usar 3D únicamente cuando mejore la comprensión, reduzca carga cognitiva o permita explorar relaciones difíciles de representar en una pantalla 2D convencional.

## Objetivo principal

Diseñar experiencias 3D que:

* Apoyen objetivos pedagógicos definidos por `instructional-design-strategist`.
* Usen contenido estructurado y validado por `content-integrator`.
* Respeten la identidad visual definida en `src/styles/main.css`.
* Mantengan alto rendimiento en navegador y mobile.
* Incluyan fallback 2D accesible.
* Eviten efectos decorativos sin propósito instruccional.
* Mantengan la legibilidad del contenido educativo.
* Representen al maestro cooperador como experto validador cuando se visualicen procesos con LLM.

## Alcance de aplicación

Usar esta habilidad para:

* Visualizar flujos de prompts, tokens, embeddings o datos.
* Representar arquitecturas RAG.
* Crear redes de nodos conceptuales.
* Diseñar recorridos de entrada → procesamiento → salida → validación humana.
* Construir simulaciones conceptuales con React Three Fiber o Three.js.
* Crear experiencias scroll-driven o step-by-step.
* Integrar overlays HTML sobre escenas 3D.
* Optimizar modelos GLB/GLTF.
* Crear o evaluar prototipos en Spline cuando sea apropiado.
* Diseñar fallback 2D equivalente.

No usar esta habilidad para:

* Añadir modelos 3D decorativos sin propósito pedagógico.
* Crear robots, laptops giratorias, avatares o partículas solo por estética.
* Sustituir contenido instruccional por animaciones difíciles de auditar.
* Resumir contenido oficial para que quepa en una etiqueta 3D.
* Modificar definiciones técnicas provistas por `content-integrator`.
* Decidir secuencia pedagógica sin `instructional-design-strategist`.
* Cambiar tokens, colores o clases visuales fuera de `src/styles/main.css`.
* Implementar 3D si un diagrama 2D comunica mejor el concepto.

## Criterio de justificación pedagógica

Antes de recomendar 3D, validar:

1. ¿El concepto es difícil de comprender en 2D?
2. ¿La dimensión espacial aporta comprensión real?
3. ¿El movimiento representa un proceso, relación o transición importante?
4. ¿La interacción permite practicar, explorar o comparar?
5. ¿Reduce carga cognitiva en lugar de aumentarla?
6. ¿Puede ofrecerse una alternativa 2D equivalente?
7. ¿Puede funcionar en mobile o degradar correctamente?
8. ¿El contenido textual puede mantenerse intacto, legible y auditable?
9. ¿La experiencia apoya una evidencia de aprendizaje?

Si la respuesta es mayormente no, recomendar una alternativa 2D: SVG, diagrama, tarjetas, checklist, tabla comparativa, acordeón o flujo paso a paso.

## Stack recomendado

### React Three Fiber

Usar como opción predeterminada cuando la experiencia se integra en una app React o Vite.

Ideal para:

* Redes de nodos.
* Flujos de datos.
* Simulaciones interactivas.
* Escenas integradas con componentes React.
* Estados controlados por datos.

### Three.js vanilla

Usar cuando se requiera control máximo o cuando la app no use React.

Ideal para:

* Experiencias WebGL altamente personalizadas.
* Optimización avanzada.
* Integraciones no React.

### Spline

Usar solo para prototipos rápidos o escenas simples aprobadas.

Ideal para:

* Bocetos visuales tempranos.
* Elementos 3D de bajo riesgo.
* Prototipos para validación visual.

No usar Spline como dependencia crítica si:

* La escena necesita control pedagógico fino.
* Hay requisitos de accesibilidad complejos.
* El contenido debe ser auditado o versionado con precisión.
* El rendimiento mobile es una prioridad estricta.

### GLB/GLTF

Usar para modelos necesarios y optimizados.

Regla general:

* Preferir geometría procedural para nodos, partículas, líneas y flujos.
* Usar GLB/GLTF solo cuando el modelo aporte comprensión real.
* Mantener archivos idealmente por debajo de 5 MB.
* Optimizar polígonos, texturas y materiales.

## Fuente visual oficial

Toda experiencia 3D debe respetar:

```text
src/styles/main.css
```

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
.card-feature
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

Excepción: variables como `--primary`, `--background` o `--radius` pueden existir únicamente como puente técnico de shadcn/ui en `src/index.css`, pero no deben ser la fuente visual de esta experiencia.

## Nota técnica sobre colores en WebGL

Three.js no siempre puede leer variables CSS directamente dentro de materiales WebGL. Para materiales 3D se pueden usar valores hexadecimales oficiales equivalentes a los tokens definidos en `main.css`, por ejemplo:

* Cyan oficial: `#00C2FF`.
* Naranja oficial: `#FF8D5C`.
* Verde éxito: `#22C55E`.
* Teal profundo: `#001E2B`.

Esta excepción aplica solo a materiales WebGL. Los overlays HTML, paneles, tooltips, botones y textos deben usar clases o variables de `src/styles/main.css`.

## Integridad del contenido pedagógico

Cuando una etiqueta, tooltip, panel o overlay provenga de documentos oficiales o del `content-integrator`, el texto debe preservarse según su política de fuente.

Reglas:

* No resumir definiciones técnicas marcadas como verbatim.
* No cambiar terminología para que quepa en un tooltip.
* No reemplazar “modelos de lenguaje de gran tamaño” por “chatbots” si el contenido requiere precisión.
* No alterar definiciones de token, prompt, RAG, embeddings, sesgo, privacidad o validación humana.
* Si el texto es extenso, usar panel lateral, modal, acordeón, vista expandida o scroll interno.

## Relación con otros agentes

### `instructional-design-strategist`

Define si la experiencia 3D está pedagógicamente justificada.

Este agente debe respetar:

* Objetivo de aprendizaje.
* Concepto central.
* Secuencia instruccional.
* Evidencia esperada.
* Momento de práctica.
* Punto Human-in-the-Loop.

### `content-integrator`

Provee contenido estructurado, etiquetas, definiciones, nodos, relaciones, tooltips y textos oficiales.

Este agente no debe modificar el contenido recibido. Debe mapearlo visualmente.

### `frontend-design`

Define composición visual, énfasis, jerarquía y registro visual de la pantalla.

Coordinar cuando la escena 3D conviva con dashboard, módulos, páginas educativas o secciones 2D.

### `web-design-guidelines`

Provee reglas visuales y uso correcto de `src/styles/main.css`.

### `web-design-reviewer`

Audita legibilidad, consistencia visual, contraste, responsive, accesibilidad y uso correcto de tokens.

### `web-artifacts-builder`

Integra la experiencia dentro de la app React y empaqueta el artefacto.

Este agente puede entregar componentes, estructuras de props, datos esperados y recomendaciones de performance.

### `devops-engineer`

Valida impacto en build, bundle size, assets y despliegue.

Las experiencias 3D deben evitar aumentar innecesariamente el tamaño del bundle.

## Patrones 3D permitidos

### 1. Red de nodos conceptuales

Uso recomendado:

* Relación entre prompt, tokens, contexto, modelo, salida y validación humana.
* Arquitectura conceptual de LLM.
* Conceptos conectados dentro de una actividad.

### 2. Flujo RAG

Uso recomendado:

* Consulta del usuario.
* Recuperación en base documental.
* Selección de contexto.
* Síntesis por LLM.
* Revisión humana.

### 3. Espacio de embeddings

Uso recomendado:

* Similitud semántica.
* Agrupación de conceptos.
* Comparación entre consulta y documentos cercanos.

### 4. Tokenización guiada

Uso recomendado:

* Mostrar cómo un texto se divide en unidades procesables.
* Visualizar entrada, fragmentación, procesamiento y salida.

### 5. Recorrido scroll-driven

Uso recomendado:

* Narrar procesos complejos por etapas.
* Sincronizar explicación 2D con movimiento 3D.
* Mantener control del ritmo de aprendizaje.

### 6. Configurador o explorador conceptual

Uso recomendado:

* Ajustar parámetros visuales para observar efectos conceptuales.
* Explorar relaciones entre variables sin convertirlo en entretenimiento sin propósito.

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
* Estados que no dependan únicamente del color.
* Compatibilidad razonable con mobile o degradación 2D.

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

## Pipeline de modelos 3D

Usar solo si el modelo 3D aporta valor pedagógico.

Proceso recomendado:

1. Preparar modelo en Blender, Spline u otra herramienta autorizada.
2. Reducir conteo de polígonos.
3. Combinar o simplificar materiales.
4. Comprimir texturas.
5. Exportar como GLB/GLTF.
6. Optimizar con `gltf-transform` si aplica.
7. Probar en desktop y mobile.
8. Confirmar fallback 2D.

Comando sugerido:

```bash
npm install -g @gltf-transform/cli

gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp
```

No aplicar compresión que distorsione recursos educativos o reduzca legibilidad de etiquetas, diagramas o texturas informativas.

## Fallback 2D obligatorio

Cada experiencia 3D debe tener una alternativa 2D equivalente:

* SVG flowchart.
* Diagrama de pasos.
* Imagen estática accesible.
* Tarjetas secuenciales.
* Lista estructurada.
* Infografía.

El fallback debe comunicar la misma idea esencial, aunque no tenga la misma interactividad.

Ejemplo:

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
import { Html, OrbitControls, Sphere } from "@react-three/drei";
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

## Scroll-driven 3D

Usar con moderación cuando el aprendizaje se beneficie de una narrativa por etapas.

Ejemplo conceptual:

```tsx
import { ScrollControls, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function RAGFlowAnimation() {
  const scroll = useScroll();

  useFrame(() => {
    // Stage 1: entrada del maestro
    // Stage 2: recuperación documental
    // Stage 3: síntesis del LLM
    // Stage 4: validación humana
    const progress = scroll.offset;
  });

  return <group>{/* geometría procedural del flujo */}</group>;
}
```

Reglas:

* El scroll no debe ocultar contenido esencial.
* Debe existir una ruta alternativa sin interacción 3D.
* Cada etapa debe tener texto claro y legible.
* El usuario debe entender dónde está dentro del proceso.

## Patrón Human-in-the-Loop

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

## Stack recomendado

{R3F, Three.js, Spline, GLB/GLTF procedural, etc.}

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
* Hay loader o estado de carga.
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
* No incluir estado de carga.

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
* Tiene estado de carga.
* No sobrecarga visualmente la experiencia.
* Incluye Human-in-the-Loop cuando representa procesos de LLM.
