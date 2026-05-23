# LECCIÓN 1.1 — ORGANIZACIÓN UX-UI, DESARROLLO INSTRUCCIONAL Y CARGA COGNITIVA
## Docencia 4.0 — Prototipo para Antigravity
### Archivo sugerido: `leccion1_1_ux_carga_cognitiva_prototype.html`

---

## 0. Dictamen de auditoría

La estructura trabajada con Perplexity es pertinente como base instruccional, pero necesita una reorganización más controlada para evitar que la Lección 1.1 se convierta en una página excesivamente larga, visualmente fragmentada o cognitivamente pesada.

La Lección 1.1 debe cumplir cuatro funciones:

1. Explicar qué es un LLM en lenguaje pedagógico.
2. Diferenciar LLM, bot/app con LLM y buscador tradicional.
3. Conectar el contenido con la gestión real del facilitador docente.
4. Preparar al participante para completar el checkpoint formativo antes de avanzar.

El contenido actual de producción contiene elementos valiosos que deben preservarse: audio inicial, definiciones citadas, diagramas, simulador de tokenización, evolución histórica, comparaciones LLM/bot/buscador, ecosistema ChatGPT/Copilot, glosario, cierre, checkpoint, referencias, progreso y navegación final.

La intervención debe ser de organización, jerarquía, agrupación visual, lectura progresiva y reducción de carga cognitiva. No debe eliminar citas ni referencias integradas en el contenido.

---

## 1. Principios de diseño instruccional para esta lección

### 1.1 Regla central

La Lección 1.1 no debe presentarse como una lectura extensa continua. Debe organizarse como una experiencia de aprendizaje progresiva:

1. Orientar.
2. Explicar.
3. Visualizar.
4. Practicar.
5. Comparar.
6. Aplicar.
7. Conectar con el rol profesional.
8. Comprobar comprensión.

### 1.2 Carga cognitiva

Reducir carga cognitiva no significa eliminar contenido, sino:

- dividir bloques largos en segmentos;
- colocar recursos visuales cerca del texto que explican;
- usar tarjetas para comparar conceptos;
- usar acordeones solo para información secundaria;
- mantener visibles las ideas esenciales;
- evitar que simuladores, imágenes y glosarios interrumpan la secuencia principal;
- conservar citas dentro del texto académico.

### 1.3 UX-UI

La página debe usar el patrón visual aprobado en `modulo1_intro_ux_carga_cognitiva_prototype.html`:

- contenedor flotante institucional;
- H1 directo;
- audio al inicio;
- secciones con H2 claros;
- tarjetas blancas y superficies slate;
- lectura progresiva estable;
- botones institucionales;
- cierre y navegación final;
- sin rediseñar `main.css` en esta etapa.

---

## 2. Organización final recomendada de la Lección 1.1

La Lección 1.1 debe organizarse en esta secuencia:

1. **Encabezado de la lección**
2. **Audio inicial**
3. **Organizador: ¿Qué voy a aprender en esta lección?**
4. **Sección A — ¿Qué es un Modelo de Lenguaje de Gran Tamaño (LLM)?**
5. **Sección B — ¿Cómo procesa el lenguaje un LLM?**
6. **Simulador de Tokenización**
7. **Sección C — Evolución de los modelos de lenguaje**
8. **Sección D — LLM, bot/app y buscador: ¿qué es cada uno?**
9. **Sección E — ¿Cuándo usar cada uno en la práctica docente?**
10. **Recuadro clave — Regla práctica para docentes**
11. **Sección F — Ecosistema actual: ChatGPT y Microsoft Copilot**
12. **Conexión con tu rol como facilitador docente**
13. **Glosario dinámico**
14. **Cierre de la lección**
15. **Checkpoint de saberes: Lección 1.1**
16. **Referencias**
17. **Estado de progreso**
18. **Navegación final**

---

## 3. Organización detallada

### 3.1 Encabezado de la lección

Usar como H1:

```text
Lección 1.1: Conceptualización y panorama tecnológico
```

Reglas:

- Mantener el H1 dentro de un contenedor flotante institucional.
- No usar breadcrumb superior.
- No añadir subtítulos extensos encima del audio.

---

### 3.2 Audio inicial

Mantener el audio al inicio como alternativa accesible.

Título sugerido:

```text
Escuchar Lección 1.1
```

Debe ubicarse inmediatamente después del H1.

No incluir transcripción si no está funcional.

---

### 3.3 Organizador: ¿Qué voy a aprender en esta lección?

Agregar una tarjeta breve después del audio.

Texto:

```text
En esta lección exploraremos qué es un Modelo de Lenguaje de Gran Tamaño (LLM), cómo se sitúa dentro de la inteligencia artificial, y en qué se diferencia de un bot o aplicación basada en LLM y de un buscador tradicional. Verás ejemplos concretos con ChatGPT y Microsoft Copilot, y cerrarás con un breve checkpoint de saberes.
```

---

### 3.4 Sección A — ¿Qué es un Modelo de Lenguaje de Gran Tamaño (LLM)?

Título:

```text
¿Qué es un Modelo de Lenguaje de Gran Tamaño (LLM)?
```

Organización recomendada:

- Diseño en dos columnas en desktop:
  - izquierda: explicación en párrafos cortos;
  - derecha: diagrama interactivo “¿Dónde se sitúan los LLM?”.
- En móvil: texto primero, diagrama después.

Dividir el bloque explicativo en tres partes:

#### Definición básica y propósito

Preservar el contenido con la cita a Zhao et al. (2023).

#### Arquitectura y lugar en la IA

Preservar la explicación sobre Transformer, IA generativa y Deep Learning, conectándola con el diagrama de capas.

#### Lógica de predicción y limitaciones

Preservar la explicación de predicción probabilística, “alucinaciones” y la referencia a Russell & Norvig (2020).

Recurso lateral:

```text
¿Dónde se sitúan los LLM?
```

Mantener el diagrama interactivo con capas:

- Inteligencia Artificial
- Machine Learning
- Deep Learning
- IA Generativa
- LLM

---

### 3.5 Sección B — ¿Cómo procesa el lenguaje un LLM?

Título:

```text
¿Cómo procesa el lenguaje un LLM?
```

Esta sección debe agrupar tokenización y generación de texto. Debe percibirse como “profundización técnica en lenguaje llano”.

#### Tokenización en lenguaje llano

Preservar el texto citado sobre tokens y tokenización con Oyarzo Espinosa & Usero Aragonés (2024).

Después del párrafo citado, presentar las aplicaciones en bullets:

- Proponer actividades y materiales.
- Sugerir explicaciones alternativas.
- Redactar borradores de retroalimentación.

Preservar el párrafo sobre automatización de tareas repetitivas, corrección preliminar, planes de aprendizaje, generación de preguntas y apoyo a investigación.

---

### 3.6 Simulador de Tokenización

El simulador debe mantenerse, pero no debe interrumpir abruptamente la lectura.

Ubicación:

Después de explicar tokenización.

Título:

```text
Simulador de Tokenización
```

Microinstrucción a añadir:

```text
Escribe una frase típica de tu gestión docente, por ejemplo, una instrucción de actividad, y observa cómo el modelo la descompone en tokens. No necesitas comprender la matemática detrás; solo reconoce que el modelo trabaja con piezas de texto más pequeñas.
```

Reglas:

- Mantener el simulador existente.
- No alterar su JavaScript.
- No romper sus IDs ni clases funcionales.
- Asegurar que funcione en móvil.
- Si el simulador ocupa mucho espacio, colocarlo dentro de una tarjeta de práctica.

---

### 3.7 Sección C — Evolución de los modelos de lenguaje

Título:

```text
La evolución de los modelos de lenguaje
```

Recomendación:

- Mantener imagen/infografía histórica si ya existe.
- Colocar la imagen a la derecha en desktop y debajo en móvil.
- Presentar las etapas como una línea de tiempo o lista segmentada.

Etapas:

1. Modelos Basados en Reglas (Pre-1990)
2. Modelos estadísticos (1990–2000s)
3. Modelos de Lenguaje Neuronales (2000s–2017)
4. Era de los Transformers y LLMs (2017–Presente)

Cada etapa debe mantenerse en 2–3 líneas máximo. Si el texto original es más largo, dividir visualmente sin eliminar contenido.

---

### 3.8 Sección D — LLM, bot/app y buscador: ¿qué es cada uno?

Título:

```text
LLM vs. bot/app vs. buscador: roles distintos, que se complementan
```

Iniciar con el párrafo conceptual:

```text
Es importante que el docente distinga entre LLM, bot y buscador, ya que cumplen roles distintos y se complementan. Un LLM es el “cerebro de lenguaje”; el bot es la aplicación que usa ese “cerebro” para interactuar con el usuario, y el buscador es el “localizador de fuentes en la web”.
```

Luego usar tres tarjetas comparativas compactas:

#### LLM

- Modelo de IA que genera texto a partir de instrucciones.
- No es, por sí mismo, una app de uso docente; es la tecnología base.

#### Bot o app con LLM

- Recurso tecnológico concreto como ChatGPT, Copilot o un asistente en un LMS.
- Usa un LLM y añade interfaz, configuraciones, accesos a datos y reglas de uso.

#### Buscador tradicional

- Servicio que indexa la web y responde con enlaces.
- Muestra fuentes, fechas y procedencia.

Mantener el diagrama “LLM vs buscador tradicional: ¿cuándo usar cuál?” como recurso visual complementario, no como bloque dominante.

---

### 3.9 Sección E — ¿Cuándo usar cada uno en la práctica docente?

Usar tres bloques o tarjetas:

#### ¿Cuándo usar el LLM como capacidad?

Introducción:

```text
Usa la capacidad de LLM cuando necesites principalmente trabajar texto:
```

Bullets:

- Generar borradores de textos: cartas a familias, rúbricas, instrucciones, descripciones de actividades.
- Reformular o adaptar: simplificar un texto, ajustar a distintos niveles de lectura, traducir con matiz pedagógico.
- Crear ideas y variaciones: ejemplos, preguntas, casos, explicaciones alternativas.

Cerrar con la frase clave sobre el LLM como motor de lenguaje que siempre requiere revisión crítica docente.

#### ¿Cuándo usar un bot o app con LLM?

Bullets:

- Un bot conversacional como ChatGPT para explorar ideas en diálogo, pedir aclaraciones e iterar una planificación.
- Un asistente integrado como Copilot en Word, PowerPoint, LMS, etc. para trabajar directamente sobre documentos, informes y listas de tareas.
- Generar presentaciones, esquemas o tablas usando archivos y datos que ya tienes en la plataforma.

#### ¿Cuándo usar un buscador tradicional?

Bullets:

- Buscar información actualizada.
- Localizar y citar fuentes primarias.
- Verificar datos que el bot/LLM ha generado.

Preservar el comentario sobre la combinación de enfoques en contextos educativos.

---

### 3.10 Recuadro clave — Regla práctica para docentes

Título:

```text
Regla práctica para docentes
```

Contenido:

```text
Si necesitas información comprobable y citada — empieza por el buscador.

Si necesitas texto, ideas o adaptaciones — usa un bot/app con LLM.

Si quieres entender la tecnología y sus límites — piensa en el LLM como el “motor” que está detrás y en cómo se integra en las aplicaciones que tus estudiantes y tú ya usan.
```

Debe estar bien separado visualmente.

---

### 3.11 Sección F — Ecosistema actual: ChatGPT y Microsoft Copilot

Título:

```text
Ecosistema actual: ChatGPT y Microsoft Copilot
```

Mantener el párrafo introductorio que explica la relevancia de ambas herramientas en entornos educativos y administrativos.

Usar dos tarjetas paralelas:

#### ChatGPT (OpenAI)

Preservar el contenido sobre ChatGPT como asistente conversacional general basado en LLM de la familia GPT y sus referencias.

Para UX, dividir internamente en tres microbloques:

- Qué hace.
- Cuál es su contexto.
- Qué señalan los estudios en educación.

#### Microsoft Copilot (Microsoft 365)

Preservar el contenido sobre Copilot como asistente basado en LLM conectado a documentos, correos y archivos, con referencias.

Dividir internamente en tres microbloques:

- Cómo orquesta diferentes modelos GPT.
- Qué aporta a la gestión administrativa docente.
- Qué implica para control, revisión y seguridad institucional.

Cerrar con el párrafo comparativo:

```text
En resumen, tanto ChatGPT como Copilot comparten la misma familia de modelos de lenguaje (GPT), pero se presentan al docente de formas diferentes: ChatGPT como espacio generalista de conversación y creación de texto, y Copilot como asistente incrustado en las herramientas de trabajo diario que usa datos institucionales bajo las políticas de seguridad de Microsoft.
```

---

### 3.12 Conexión con tu rol como facilitador docente

Esta sección debe estar visible antes del glosario y antes del cierre.

Título:

```text
Conexión con tu rol como facilitador docente
```

Usar tres tarjetas:

#### Acompañamiento curricular

Preservar el texto sobre orientar a maestras y maestros en el distrito sobre qué herramienta usar según necesidad.

#### Diseño y capacitación docente

Preservar el texto sobre modelar prompts, revisión de respuestas y diferencia entre usar LLM para pensar y buscador para verificar.

#### Gestión de documentación y procesos

Preservar el texto sobre borradores de cartas, informes, rúbricas y guías de observación sin perder control final.

---

### 3.13 Glosario dinámico

Ubicación:

Cerca del final, después de la conexión con el rol y antes del cierre.

Título:

```text
Glosario dinámico: Conceptos a repasar
```

Debe mantenerse plegable o como panel compacto.

Términos clave:

- Modelo de Lenguaje de Gran Tamaño (LLM).
- Bot o aplicación basada en LLM.
- Buscador tradicional.
- Chain of Thought (CoT).
- Andamiaje (scaffolding) con LLM.

No debe interrumpir la lectura principal.

---

### 3.14 Cierre textual

Título:

```text
¡Felicidades!
```

Texto:

```text
Has culminado la lección 1.1 del programa de formación profesional.

Al completar este contenido, has dado un paso clave al comprender qué es un LLM, cómo funciona como motor de lenguaje y cuándo conviene usarlo frente a un buscador tradicional. Este conocimiento te coloca en una posición estratégica para tomar decisiones pedagógicas más informadas y éticas sobre el uso de IA en tu práctica docente, manteniendo siempre tu criterio profesional en el centro.
```

---

### 3.15 Checkpoint de saberes: Lección 1.1

Mantener el bloque actual de checkpoint con botón principal destacado y enlace secundario a Genially.

Añadir línea antes del botón:

```text
Completa este checkpoint formativo para verificar que distingues claramente entre LLM, bots y buscadores antes de avanzar a la siguiente lección.
```

---

### 3.16 Referencias

Mantener sección de referencias al final.

Recomendación:

- Acordeón o bloque colapsable.
- Mostrar número de fuentes consultadas.
- Mantener citas y referencias existentes sin alterar.

---

### 3.17 Estado de progreso y navegación final

Mantener:

- botón o estado de completado;
- mensaje “¡Has completado esta sección!” si ya existe;
- navegación final.

Navegación sugerida:

```text
← Volver al módulo
Continuar a Lección 1.2 →
```

No romper lógica de progreso.

---

## 4. Instrucción técnica para Antigravity

Copiar y pegar en Antigravity:

```text
Necesito rediseñar la organización de la Lección 1.1 del LMS Docencia 4.0 aplicando UX-UI, desarrollo instruccional y reducción de carga cognitiva.

Usa como referencia visual el modelo aprobado de:

modulo1_intro_ux_carga_cognitiva_prototype.html

Pero adapta la estructura a una lección, no a una introducción.

Archivo de producción a revisar:

leccion1_1.html

Crear prototipo:

leccion1_1_ux_carga_cognitiva_prototype.html

No modificar producción.

No modificar:
- leccion1_1.html
- main.css
- progress-tracker.js
- Firebase
- autenticación
- scripts globales
- rutas globales

No hacer deploy.
No usar git add .

Regla de contenido:
Conservar todas las partes del contenido de producción.
No eliminar citas.
No eliminar referencias.
No eliminar audio.
No eliminar simulador de tokenización.
No eliminar diagramas ni infografías existentes.
No eliminar glosario dinámico.
No eliminar checkpoint.
No eliminar botones de progreso ni navegación final.
Puedes reorganizar, segmentar y agrupar contenido, pero no borrar contenido académico con citas.

Estructura obligatoria del prototipo:
1. Encabezado de la lección
2. Audio inicial
3. Organizador: ¿Qué voy a aprender en esta lección?
4. Sección A — ¿Qué es un Modelo de Lenguaje de Gran Tamaño (LLM)?
5. Sección B — ¿Cómo procesa el lenguaje un LLM?
6. Simulador de Tokenización
7. Sección C — Evolución de los modelos de lenguaje
8. Sección D — LLM, bot/app y buscador: ¿qué es cada uno?
9. Sección E — ¿Cuándo usar cada uno en la práctica docente?
10. Recuadro clave — Regla práctica para docentes
11. Sección F — Ecosistema actual: ChatGPT y Microsoft Copilot
12. Conexión con tu rol como facilitador docente
13. Glosario dinámico
14. Cierre textual
15. Checkpoint de saberes: Lección 1.1
16. Referencias
17. Estado de progreso
18. Navegación final

Diseño y CSS:
Usar styles/main.css como fuente principal.
Se permite CSS local controlado en el prototipo bajo namespace:
.leccion1-1-prototype
si hace falta para adaptar componentes.
El CSS local debe usar tokens de main.css, no usar colores hardcoded, no redefinir tipografías globales, no crear sistema visual paralelo y documentarse en QA.

Accesibilidad:
Verificar un solo H1, H2 jerárquicos, imágenes con alt, diagramas accesibles, details/summary navegables por teclado, botones con texto claro, foco visible, contraste suficiente y responsive desktop/tablet/móvil.

QA:
Crear reporte:
QA_leccion1_1_ux_carga_cognitiva.md

Debe incluir:
1. Lista de secciones preservadas.
2. Confirmación de que no se eliminaron citas.
3. Confirmación de que no se eliminaron referencias.
4. Confirmación de audio funcional.
5. Confirmación de simulador funcional.
6. Confirmación de glosario funcional.
7. Confirmación de checkpoint funcional.
8. Confirmación de progreso funcional.
9. Confirmación de navegación final.
10. QA responsive.
11. QA consola sin errores.
12. Git status.
13. Confirmación de que producción no fue modificada.
```

---

## 5. Criterio de aprobación

El prototipo de Lección 1.1 solo debe aprobarse si:

- conserva todas las partes de producción;
- conserva citas y referencias;
- mejora la organización sin resumir indebidamente;
- reduce carga cognitiva mediante segmentación;
- mantiene funcionalidad de audio, simulador, glosario, checkpoint, progreso y navegación;
- respeta el patrón visual aprobado de Módulo 1 Intro;
- no modifica producción.
