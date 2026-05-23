# Lección 2.1: El arte de pedir — Ingeniería de prompts aplicada a educación

## 🎧 Audio inicial

<strong>Escuchar Lección 2.1</strong> — (Reproducir audio)

Acompaña la lectura con la narración guiada. Esta lección te enseñará a formular <strong>instrucciones efectivas</strong> que conviertan al LLM en una herramienta verdaderamente útil para tu rol como <strong>facilitador docente</strong>.

---

## 📌 Resumen inicial

En esta lección descubrirás qué es un <strong>prompt</strong> y cómo estructurarlo estratégicamente para obtener respuestas <strong>precisas</strong>, <strong>relevantes</strong> y <strong>útiles</strong> desde los <strong>Modelos de Lenguaje de Gran Tamaño (LLM)</strong>.

Aprenderás la fórmula <strong>R-C-T-F-R</strong> —<strong>Rol + Contexto + Tarea + Formato + Restricciones</strong>—, técnicas de iteración como <strong>Chain-of-Thought</strong> y <strong>few-shot prompting</strong>, y cómo adaptar <strong>plantillas reutilizables</strong> al contexto del <strong>Departamento de Educación de Puerto Rico (DEPR)</strong>.

Al finalizar, contarás con una competencia profesional clave: <strong>dirigir la IA con intención pedagógica</strong>.

---

## 🎯 Concepto central

El <strong>prompt</strong> es el “puente” entre la <strong>intención pedagógica del docente</strong> y el resultado que produce la IA.

Pasar de <strong>“probar la IA”</strong> a <strong>“dirigir la IA”</strong> es lo que diferencia al docente usuario del <strong>docente experto validador</strong>.

La calidad de tu prompt determina la calidad de la respuesta.

---

## 1️⃣ ¿Qué es un prompt en el contexto de los LLM?

En el contexto de los <strong>Modelos de Lenguaje de Gran Tamaño (LLM)</strong>, un <strong>prompt</strong> es la instrucción en lenguaje natural que el usuario introduce para activar y guiar la respuesta del modelo.

Los LLM responden a <strong>instrucciones en lenguaje natural</strong> y su desempeño depende fuertemente de cómo se formula esa instrucción.

Desde la perspectiva educativa, un prompt es el <strong>“puente”</strong> entre la intención pedagógica del docente —por ejemplo, <strong>planificar una clase</strong>, <strong>generar preguntas</strong> o <strong>adaptar un texto</strong>— y el resultado que produce la IA.

Con bots o aplicaciones basadas en LLM, como ChatGPT, el contenido generado puede variar significativamente en <strong>calidad</strong> y <strong>relevancia</strong> dependiendo de la claridad y especificidad del prompt proporcionado por el usuario.

### 💡 Implicación profesional

Los <strong>prompts bien estructurados</strong> son esenciales para obtener respuestas útiles, precisas y apropiadas al contexto.

Por eso, aprender a escribir buenos prompts se convierte en una <strong>competencia profesional clave</strong> para docentes que integran LLM en su práctica.

---

## 2️⃣ La fórmula del prompt efectivo: R-C-T-F-R

En educación, los prompts “estándar” producen respuestas aceptables, pero la calidad mejora cuando el docente explicita el <strong>rol del modelo</strong>, ofrece <strong>contexto suficiente</strong>, define con claridad la <strong>tarea</strong>, pide un <strong>formato específico</strong> y establece <strong>límites o criterios de calidad</strong>.

Los patrones de prompt representan <strong>soluciones reutilizables</strong> a problemas recurrentes y pueden ayudar a los usuarios a diseñar mejores prompts de manera sistemática.

Adaptando estas ideas al contexto docente, podemos organizar la fórmula del prompt efectivo en cinco componentes clave:

| Componente | Función | Ejemplo |
|---|---|---|
| <strong>R — Rol</strong> | Indica el papel que debe asumir el modelo. | “Actúa como maestro de matemáticas de 7mo grado en Puerto Rico…” |
| <strong>C — Contexto</strong> | Proporciona información sobre grupo, nivel, currículo o situación escolar. | “Trabajo con un grupo de 30 estudiantes, muchos con dificultad en la lectura comprensiva…” |
| <strong>T — Tarea</strong> | Acción específica que se le pide al modelo. | “Diseña una clase de 45 minutos sobre ecuaciones lineales…” |
| <strong>F — Formato</strong> | Indica cómo debe presentarse la respuesta. | “…organizada en una tabla con columnas de inicio, desarrollo y cierre…” |
| <strong>R — Restricciones</strong> | Señalan límites, criterios o condiciones que debe respetar la respuesta. | “…usa ejemplos contextualizados a Puerto Rico y evita lenguaje técnico complejo.” |

### 🔎 Evidencia investigativa

El uso de técnicas estándar de ingeniería de prompts —como la <strong>asignación de roles</strong> y los <strong>seed-word prompts</strong>— ha demostrado mejorar la pertinencia y la estructura de los planes de lección generados.

### 💡 Ejemplo de prompt efectivo — R-C-T-F-R integrado

<strong>“Actúa como maestro de 5to grado de ciencias en Puerto Rico. Trabajo con un grupo heterogéneo según los Estándares y Expectativas del DEPR para 5to grado. Diseña una clase de 45 minutos sobre ecosistemas, con actividades de inicio, desarrollo y cierre. Presenta el plan en formato de tabla e incluye una breve descripción de cada actividad. Usa ejemplos relacionados con bosques y costas de Puerto Rico y lenguaje accesible para estudiantes de 10–11 años.”</strong>

---

## 3️⃣ Iteración y refinamiento: “conversar” con el modelo

Un aspecto clave de la ingeniería de prompts es entender que <strong>el primer resultado no suele ser el definitivo</strong>.

En lugar de aceptar la primera respuesta, el docente puede <strong>iterar</strong>: pedir aclaraciones, ajustes, más ejemplos o cambios de enfoque.

El uso de bots basados en LLM en educación se beneficia de un proceso iterativo de <strong>refinamiento de prompts</strong>, en el que los usuarios ajustan progresivamente sus consultas para obtener respuestas más precisas y relevantes.

De forma similar, se ha documentado un proceso en tres etapas con ChatGPT —<strong>lluvia de ideas</strong>, <strong>refinamiento</strong> y <strong>redacción</strong>— donde el uso de <strong>few-shot prompting</strong> permitió una mejora progresiva en la coherencia y relevancia.

### 🔄 Tres técnicas clave para iterar

| Técnica | En qué consiste | Ejemplo |
|---|---|---|
| <strong>Reformular el prompt</strong> | Ajustar la instrucción cuando la respuesta es muy general o no cumple las expectativas. | “Hazlo más breve”, “usa ejemplos de ciencias para 4to grado”, “incluye solo actividades que se puedan hacer sin laboratorio”. |
| <strong>Paso a paso (Chain-of-Thought)</strong> | Pedir al modelo que explique su razonamiento secuencialmente para mejorar la lógica. | “Explica tu razonamiento step-by-step para diseñar esta evaluación.” |
| <strong>Uso de ejemplos (Few-shot)</strong> | Proporcionar dos o tres ejemplos reales antes de que el modelo genere el contenido. | “Te mostraré tres ejemplos de rúbricas mías; ahora genera una similar para este texto.” |

### 💡 Ejemplo de few-shot en educación

<strong>“Te mostraré un ejemplo de pregunta de comprensión lectora que necesito: Ejemplo 1: ‘¿Qué motivación tenía el personaje principal al inicio del cuento?’ Ejemplo 2: ‘¿Cómo cambió la actitud del protagonista después del conflicto?’ Ahora genera cinco preguntas similares para el siguiente texto: [pegar texto].”</strong>

---

## 4️⃣ Entrenando a tu Asistente IA: tres niveles de instrucción

---

## 5️⃣ Few-shot learning y aprendizaje en contexto

Se ha demostrado que los LLM pueden aprender nuevos patrones <strong>“en contexto”</strong> con solo unos pocos ejemplos, sin necesidad de reentrenamiento, lo que se denomina <strong>few-shot learning</strong>.

Los modelos de lenguaje pueden realizar tareas especificadas solo mediante <strong>descripciones en lenguaje natural</strong> o con unas pocas demostraciones, enfatizando la importancia de cómo se formula el prompt y los ejemplos incluidos.

### 💡 Implicación práctica

No necesitas conocimientos técnicos avanzados.

Con <strong>buenos ejemplos en el prompt</strong>, el modelo replica patrones complejos.

---

## 6️⃣ Plantillas de prompts adaptadas al contexto DEPR

Para los docentes, no se trata de memorizar teoría sobre LLM, sino de disponer de <strong>estructuras de prompts reutilizables</strong> que luego puedan adaptar a su nivel, materia y realidad escolar.

Los patrones de prompt funcionan como <strong>plantillas conceptuales</strong> que los usuarios pueden llenar con su propio contenido.

Estudios recientes muestran que es posible ayudar a maestros a generar proyectos <strong>culturalmente pertinentes</strong> usando únicamente modificaciones en el lenguaje de los prompts, sin programación adicional.

Los docentes pudieron ajustar iterativamente sus prompts para orientar al modelo hacia ideas de proyectos más culturalmente pertinentes, lo que refuerza la importancia de plantillas que incluyan referencias explícitas al <strong>contexto local</strong>.

### 📋 Campos esenciales en una plantilla DEPR

| Campo | Qué incluir |
|---|---|
| <strong>Grado y materia</strong> | Nivel académico y asignatura específica. |
| <strong>Estándar(es) del DEPR</strong> | Alineación con el currículo oficial. |
| <strong>Tiempo lectivo disponible</strong> | Duración de la lección o unidad. |
| <strong>Características del grupo</strong> | Heterogeneidad, educación especial, ELL. |
| <strong>Contexto sociocultural</strong> | Referencias explícitas a Puerto Rico, comunidad rural/urbana, etc. |

### 📝 Plantilla de Prompt para Planificación

<strong>“Actúa como [ROL: maestro/a de ___ grado de ___ en Puerto Rico].</strong>

<strong>Estoy planificando una clase para [CONTEXTO: grupo de ___ estudiantes, con ___ características].</strong>

<strong>Según el estándar [copia y pega el estándar del DEPR], [TAREA: diseña una clase de ___ minutos] con actividades de inicio, desarrollo y cierre.</strong>

<strong>[FORMATO: Presenta la planificación en formato de tabla con columnas de objetivos, actividades, recursos y tiempo estimado].</strong>

<strong>[RESTRICCIONES: Usa ejemplos contextualizados a Puerto Rico, lenguaje accesible para estudiantes de ___ años y no inventes estándares adicionales.]”</strong>

### 🔎 Evidencia investigativa

El uso de técnicas estándar como <strong>asignación de roles</strong> y <strong>seed-word prompts</strong> ha mostrado mejorar la pertinencia y la estructura de los planes de lección generados, respaldando el uso de <strong>plantillas sistemáticas</strong> como las que este módulo propone.

---

## Conexión con tu rol como facilitador docente

Como facilitador o facilitadora docente del DEPR, esta lección impacta directamente tus funciones de <strong>acompañamiento curricular</strong>, <strong>capacitación</strong> y <strong>gestión administrativa</strong>:

- <strong>Optimización de la planificación didáctica:</strong> podrás generar borradores de planes de clase alineados a los <strong>Estándares y Expectativas del DEPR</strong> en una fracción del tiempo actual, dejando más espacio para el acompañamiento real al maestro.

- <strong>Capacitación docente más efectiva:</strong> la fórmula <strong>R-C-T-F-R</strong> es un contenido directamente transferible a tus talleres y MECPA, donde podrás enseñar a maestros a <strong>dirigir la IA con criterio profesional</strong>.

- <strong>Diseño de materiales culturalmente pertinentes:</strong> podrás guiar a docentes para que adapten sus prompts al <strong>contexto puertorriqueño</strong> —bosques, costas, referentes culturales, lenguaje local—, alineado con la evidencia investigativa sobre proyectos culturalmente pertinentes.

- <strong>Banco de plantillas institucional:</strong> desde tu rol de mentoría, puedes co-construir con maestros un repositorio de <strong>plantillas reutilizables</strong> —planificación, rúbricas, comunicación a familias, PEI—, multiplicando el impacto del programa.

- <strong>Modelaje de la iteración profesional:</strong> al demostrar cómo se itera y refina un prompt, refuerzas la identidad del docente como <strong>experto validador</strong> y no como simple receptor de la salida de la IA.

- <strong>Aporte directo a la investigación:</strong> esta lección desarrolla competencias clave para el plan de acción del estudio, particularmente en la fase de acción del modelo <strong>Carr & Kemmis</strong> —talleres y modelaje del uso de recursos basados en LLM—.

---

## 🏁 Qué debes recordar

✅ Un <strong>prompt</strong> es el puente entre tu <strong>intención pedagógica</strong> y el resultado de la IA: la calidad del prompt determina la calidad de la respuesta.

✅ La fórmula <strong>R-C-T-F-R</strong> —<strong>Rol + Contexto + Tarea + Formato + Restricciones</strong>— estructura prompts profesionales y efectivos.

✅ El primer resultado no es el definitivo: <strong>itera</strong>, <strong>refina</strong> y <strong>conversa con el modelo</strong>.

✅ Las técnicas <strong>Chain-of-Thought</strong> y <strong>Few-shot prompting</strong> mejoran la lógica y la precisión de las respuestas.

✅ Las <strong>plantillas reutilizables adaptadas al DEPR</strong> —estándar, grado, contexto, Puerto Rico— ahorran tiempo y elevan la pertinencia cultural.

✅ Tu nuevo lugar es estratégico: <strong>el LLM trabaja a tu servicio, no al revés</strong>.

---

## 📖 Conceptos a repasar

---

## 🎉 Meta alcanzada — ¡Felicidades!

Has culminado la <strong>Lección 2.1</strong> del programa de formación profesional.

Al completar este contenido, has pasado de <strong>“probar” la IA</strong> a entender cómo <strong>dirigirla</strong>: sabes qué es un <strong>prompt</strong>, cómo estructurarlo con <strong>Rol</strong>, <strong>Contexto</strong>, <strong>Tarea</strong>, <strong>Formato</strong> y <strong>Restricciones</strong>, y cómo iterar hasta obtener respuestas realmente útiles para tu aula.

Esta competencia te coloca en un lugar estratégico, porque convierte al LLM en una <strong>herramienta a tu servicio y no al revés</strong>, alineando lo que pides con tus <strong>objetivos curriculares</strong> y con la <strong>realidad de tu estudiantado</strong>.

---

## ✏️ Checkpoint de saberes: Lección 2.1

---

## 📚 Referencias

---

## 🔁 Navegación

[ ← Volver a Introducción del Módulo 2 ] [ Marcar como completado ] [ Ir a la Lección 2.2 → ]