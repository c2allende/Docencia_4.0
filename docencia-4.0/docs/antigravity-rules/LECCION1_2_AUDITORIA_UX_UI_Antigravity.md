# LECCIÓN 1.2 — AUDITORÍA UX-UI, DESARROLLO INSTRUCCIONAL Y CARGA COGNITIVA  
## Docencia 4.0 — Documento final para Antigravity  
### Archivo sugerido: `leccion1_2_ux_carga_cognitiva_prototype.html`

---

## 0. Dictamen general de auditoría

La estructura trabajada para la **Lección 1.2: Aplicaciones estratégicas por áreas de contenido** es pertinente y debe mantenerse como base, pero necesita organizarse con el mismo patrón aprobado en la **Lección 1.1**: contenedor flotante institucional, secuencia progresiva, integración texto–imagen, preservación de citas, glosario, checkpoint, referencias y navegación final.

La página debe evitar una lectura extensa y lineal. La experiencia debe guiar al participante por un flujo instruccional claro:

**comprender aplicaciones por área → comparar usos estratégicos → interactuar con el recurso → conectar con el rol del facilitador → verificar comprensión.**

La intervención debe enfocarse en estructura, jerarquía, espaciado, responsividad y reducción de carga cognitiva. No debe eliminar contenido académico ni citas.

---

## 1. Reglas no negociables

### 1.1 No modificar producción

Trabajar únicamente en prototipo:

```text
leccion1_2_ux_carga_cognitiva_prototype.html
```

No modificar:

```text
leccion1_2.html
main.css
progress-tracker.js
Firebase
auth
scripts globales
rutas globales
```

No hacer deploy.  
No usar `git add .`.

---

### 1.2 Preservar contenido académico

No eliminar, resumir ni reescribir contenido con citas.

Conservar las citas integradas en el cuerpo del texto, incluyendo, pero sin limitarse a:

- Zhang et al. (2024)
- Yao et al. (2023)
- Wei et al. (2022)
- Damiano et al. (2024)
- Valli & Zafiropoulos (2024)
- Kohnke et al. (2023)
- Hockly (2023)
- Huang et al. (2022)
- Warschauer et al. (2023)
- Godwin-Jones (2023)
- Sarkar et al. (2024)
- Dahri et al. (2025)

Las citas deben permanecer asociadas al párrafo o idea correspondiente.

---

### 1.3 Glosario, Checkpoint y Referencias

Estas tres secciones **no forman parte del rediseño creativo**.

Deben copiarse y mantenerse con la misma estructura funcional y visual de producción:

1. `Glosario dinámico: Conceptos a repasar`
2. `Checkpoint de saberes: Lección 1.2`
3. `Referencias`

Regla:

- No resumir.
- No reescribir.
- No cambiar orden.
- No convertir en tarjetas nuevas.
- No modificar comportamiento.
- No eliminar fuentes.
- No añadir fuentes.
- No cambiar el formato de producción.

Solo se permite ajuste externo mínimo para que encajen dentro del contenedor flotante aprobado.

---

## 2. Modelo visual obligatorio

Usar como patrón aprobado:

```text
leccion1_1_ux_carga_cognitiva_prototype.html
```

La Lección 1.2 debe usar el mismo lenguaje visual:

- contenedor flotante separado del top-nav;
- H1 directo;
- audio al inicio;
- organizador breve;
- secciones H2 claras;
- tarjetas blancas y superficies claras;
- imágenes integradas al lado del texto cuando aporten comprensión;
- lectura progresiva solo cuando reduzca densidad sin esconder contenido esencial;
- glosario, checkpoint y referencias iguales a producción;
- progreso y navegación final funcionales.

---

## 3. Organización final recomendada

La Lección 1.2 debe organizarse en este orden:

1. Encabezado de la lección.
2. Audio inicial.
3. Organizador de la lección.
4. Sección A — Ciencias y Matemáticas: razonamiento paso a paso y resolución de problemas.
5. Sección B — Español e Historia: análisis textual y síntesis crítica.
6. Sección C — Inglés y otros idiomas: interacción comunicativa y escritura guiada.
7. Sección D — Educación Especial: adaptación y accesibilidad (PEI).
8. Actividad interactiva — Mapa de aplicaciones estratégicas.
9. Conexión con tu rol como facilitador docente.
10. Glosario dinámico: Conceptos a repasar.
11. Cierre textual.
12. Checkpoint de saberes: Lección 1.2.
13. Referencias.
14. Estado de progreso.
15. Navegación final.

---

## 4. Organización detallada de cada sección

### 4.1 Encabezado

H1:

```text
Lección 1.2: Aplicaciones estratégicas por áreas de contenido
```

Reglas:

- Sin breadcrumb superior dentro del contenido.
- El H1 debe estar dentro del contenedor flotante.
- No debe cortarse ni desbordarse.
- Mantener consistencia con Lección 1.1.

---

### 4.2 Audio inicial

Mantener:

```text
Escuchar Lección 1.2
```

Ubicación:

- Inmediatamente después del H1.
- Igual que en Lección 1.1.

Reglas:

- No añadir transcripción si no está funcional.
- No cambiar ruta del audio.
- No romper controles nativos.

---

### 4.3 Organizador de la lección

Título visual:

```text
Aplicaciones estratégicas por áreas de contenido
```

Texto principal que debe conservarse:

```text
La integración de los modelos de lenguaje de gran tamaño (LLM) no ocurre de la misma manera en todas las disciplinas. Cada área académica presenta desafíos cognitivos particulares que los LLM pueden abordar mediante estrategias de reasoning (razonamiento), generación de texto y adaptación de contenidos. A continuación, se presentan oportunidades de uso específicas validadas por la investigación reciente en STEM, humanidades y educación especial.
```

Añadir debajo como línea orientadora breve:

```text
En esta lección exploraremos tres grandes escenarios: Ciencias y Matemáticas, Humanidades e Inglés y otros idiomas, y Educación Especial/PEI.
```

Formato recomendado:

- tarjeta introductoria sobria;
- borde/acento izquierdo cyan o naranja;
- no usar bloque demasiado alto.

---

## 5. Secciones de contenido

### 5.1 Sección A — Ciencias y Matemáticas

H2:

```text
Ciencias y Matemáticas: razonamiento paso a paso y resolución de problemas
```

Organización:

- Usar layout de dos columnas en desktop.
- Texto a la izquierda.
- Imagen `Ciencias y matemáticas: razonamiento paso a paso y resolución de problemas` a la derecha.
- En móvil: texto primero, imagen después.

Contenido que debe preservarse:

```text
En disciplinas STEM (Ciencia, Tecnología, Ingeniería y Matemáticas), el principal valor de los LLM reside en su capacidad para desglosar problemas complejos en pasos lógicos manejables.
```

Subbloques:

#### Generación de problemas verbales contextualizados

Conservar el texto completo con las citas:

```text
Los docentes pueden solicitar a un bot o aplicación basada en LLM que diseñe problemas matemáticos situados en contextos de interés para sus estudiantes (ej. deportes locales, música popular), lo que aumenta la relevancia y el compromiso. La literatura sobre Chain-of-Thought (CoT) o “cadena de pensamiento” demuestra que cuando se pide al modelo que genere explicaciones paso a paso, no solo mejora la precisión de la respuesta, sino que promueve un andamiaje didáctico al hacer explícito el razonamiento del modelo en pasos lógicos (Zhang et al., 2024; Yao et al., 2023).
```

#### Explicación de procesos

Conservar el texto completo con las citas:

```text
En lugar de simplemente ofrecer una respuesta numérica, herramientas como ChatGPT pueden generar explicaciones guiadas que muestran cada fase del procedimiento, usando lenguaje sencillo y conectándolo con el libro de texto o con la situación matemática concreta. Estudios recientes subrayan que el uso de LLM para generar múltiples vías de razonamiento permite a los estudiantes ver diferentes enfoques para un mismo problema, fomentando la flexibilidad cognitiva (Yao et al., 2023; Wei et al., 2022).
```

UX:

- No esconder esta sección.
- Mantener las dos oportunidades visibles.
- La imagen debe estar alineada con el texto y no flotar demasiado arriba.

---

### 5.2 Sección B — Español e Historia

H2:

```text
Español e Historia: análisis textual y síntesis crítica
```

Organización:

- Imagen a la izquierda o derecha según balance visual.
- Texto en párrafos segmentados.
- Mantener consistencia con la sección STEM.

Contenido que debe preservarse:

```text
En las humanidades, los LLM funcionan como motores de lenguaje que impulsan bots y asistentes de lectura y escritura avanzada, permitiendo trabajar competencias de análisis y síntesis con mayor profundidad.
```

Subbloques:

#### Análisis de textos y comprensión lectora

Conservar el texto completo con cita a Damiano et al. (2024).

#### Generación de ensayos modelo y contra-argumentos

Conservar el texto completo con cita a Valli & Zafiropoulos (2024).

UX:

- No comprimir demasiado.
- Si el texto se ve denso, usar dos tarjetas internas dentro de la sección: una para análisis textual y otra para ensayos/contra-argumentos.
- No convertir en acordeón salvo que el bloque quede excesivamente largo en móvil.

---

### 5.3 Sección C — Inglés y otros idiomas

H2:

```text
Inglés y otros idiomas: interacción comunicativa y escritura guiada
```

Organización:

- Párrafo marco visible.
- Imagen/infografía a la derecha en desktop.
- Aplicaciones en lista o tarjetas compactas.

Contenido marco que debe preservarse con citas:

```text
En la enseñanza de Inglés y otros idiomas, los LLM pueden apoyar la práctica comunicativa, la escritura y el desarrollo de vocabulario mediante diálogos, simulaciones, modelos de texto y retroalimentación lingüística. Su valor principal está en ampliar las oportunidades de exposición y producción del idioma, siempre bajo la mediación del docente, quien valida la precisión, el nivel de complejidad y la pertinencia cultural de las respuestas generadas (Kohnke et al., 2023; Hockly, 2023).
```

Aplicaciones clave que deben mantenerse:

1. Práctica conversacional.
2. Escritura y retroalimentación.
3. Vocabulario, traducción y cultura.
4. Síntesis pedagógica.

Cada una debe conservar su texto completo y citas.

UX:

- Esta sección puede usar tarjetas compactas o lista enriquecida.
- No eliminar el bloque de síntesis pedagógica.
- La imagen debe conservarse como apoyo visual.

---

### 5.4 Sección D — Educación Especial y accesibilidad (PEI)

H2:

```text
Educación Especial: adaptación y accesibilidad (PEI)
```

Organización:

- Tarjeta destacada o bloque con fondo claro.
- Imagen “Educación especial: adaptación y accesibilidad (PEI)” junto al texto.
- Mantener estética institucional.

Subbloques obligatorios:

#### El potencial de la diferenciación masiva

Conservar:

```text
El potencial de los LLM para la educación inclusiva es una de sus aplicaciones más prometedoras, actuando como una herramienta de diferenciación masiva y accesible.
```

#### Adaptación de niveles de lectura

Conservar texto completo con cita a Sarkar et al. (2024).

#### Creación de PEI asistidos

Conservar texto completo con citas a Dahri et al. (2025) y Sarkar et al. (2024).

UX:

- Esta sección es clave para la alineación con DUA.
- No esconderla en acordeón.
- Mantener énfasis human-in-the-loop.

---

## 6. Actividad interactiva — Mapa de aplicaciones estratégicas

Título:

```text
Actividad interactiva: mapa de aplicaciones estratégicas
```

Recurso:

```text
LLM en el Aula: Aplicaciones Estratégicas (Test)
```

Instrucción visible antes del recurso:

```text
Explora el recurso interactivo “LLM en el Aula: Aplicaciones Estratégicas” para recorrer tres escenarios breves (STEM, Humanidades y Educación Especial). En cada uno, decidirás cómo aplicar modelos de lenguaje de gran tamaño con criterio pedagógico, ético y contextual.
```

Conservar dentro del interactivo:

- categorías Razonamiento, Lenguaje, Accesibilidad;
- botón “Comenzar recorrido”;
- funcionamiento del recurso;
- scripts existentes;
- rutas y assets.

### 6.1 Ajuste de dimensiones del interactivo

El interactivo actualmente se percibe demasiado grande. Debe ajustarse para integrarse al flujo sin dominar la página.

Reglas:

- No eliminar el interactivo.
- No cambiar su contenido interno.
- No romper su JavaScript.
- No modificar rutas ni IDs funcionales.
- Ajustar solo contenedor, ancho máximo y altura visible.

Recomendación técnica:

```css
.leccion1-2-prototype .interactive-shell {
  width: min(100%, 920px);
  margin: var(--spacing-8) auto;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: var(--color-background-surface);
  box-shadow: var(--shadow-md);
}

.leccion1-2-prototype .interactive-frame-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 560px;
  min-height: 420px;
}

.leccion1-2-prototype .interactive-frame-wrap iframe,
.leccion1-2-prototype .interactive-frame-wrap .interactive-embed {
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 760px) {
  .leccion1-2-prototype .interactive-shell {
    width: 100%;
    margin: var(--spacing-6) auto;
  }

  .leccion1-2-prototype .interactive-frame-wrap {
    min-height: 520px;
    max-height: none;
    aspect-ratio: auto;
  }
}
```

Si no es iframe y es HTML interno, aplicar el mismo concepto al contenedor raíz del interactivo.

### 6.2 Si el interactivo requiere más espacio

Si al reducirlo pierde usabilidad:

- Mantener vista compacta en la página.
- Añadir botón secundario:
  ```text
  Abrir interactivo en nueva pestaña
  ```
- No sacar al participante por defecto.
- La acción principal debe poder realizarse en la página.

---

## 7. Conexión con tu rol como facilitador docente

Título:

```text
Conexión con tu rol como facilitador docente
```

Debe aparecer después del interactivo y antes del glosario.

Usar tres tarjetas, igual que en Lección 1.1:

1. Acompañamiento curricular.
2. Diseño y capacitación docente.
3. Gestión de documentación y procesos.

Conservar textos:

### Acompañamiento curricular

```text
Los escenarios por áreas (STEM, humanidades, idiomas, educación especial) te ofrecen ejemplos concretos que puedes usar para co-diseñar con los docentes secuencias de clase, problemas contextualizados, actividades de lectura crítica y adaptaciones de PEI apoyadas en LLM.
```

### Diseño y capacitación docente

```text
Las aplicaciones estratégicas que revisaste te dan un repertorio de casos auténticos para planificar talleres diferenciados por disciplina, donde los participantes experimenten con LLM en tareas específicas de su área, en lugar de recibir solo una capacitación genérica sobre IA.
```

### Gestión de documentación y procesos

```text
Ver cómo los LLM pueden generar modelos de textos, contra-argumentos, adaptaciones y objetivos SMART te permite utilizarlos para producir plantillas institucionales (rúbricas, formatos de PEI, guías de análisis textual) que luego puedas compartir y ajustar con los equipos docentes.
```

---

## 8. Glosario dinámico: Conceptos a repasar

Regla fija:

Usar exactamente la estructura funcional y visual de producción.

Términos:

- Generación de problemas contextualizados.
- Explicación paso a paso en STEM.
- Asistente de lectura y escritura.
- Diseño Universal para el Aprendizaje (DUA) con LLM.
- Apoyo a Programas Educativos Individualizados (PEI).

No resumir definiciones.  
No reescribir.  
No cambiar fuentes.  
No cambiar comportamiento.  
No convertirlo en tarjetas nuevas.

---

## 9. Cierre de la lección

Título:

```text
¡Felicidades!
```

Conservar el cierre:

```text
Has culminado la lección 1.2 del programa de formación profesional.

Al completar este contenido, has dado un paso importante hacia una integración más estratégica de los LLM en tu práctica: ahora reconoces que cada área –STEM, humanidades y educación especial– plantea oportunidades y cuidados distintos. Este mapa de aplicaciones te permitirá decidir con mayor intención dónde la IA aporta valor real al aprendizaje y dónde es necesario reforzar más tu intervención pedagógica y tu juicio profesional.
```

Corregir solamente si hay error tipográfico visible:

- Si aparece `¡Felicitades!`, cambiar a `¡Felicidades!`.

---

## 10. Checkpoint de saberes: Lección 1.2

Regla fija:

Debe conservar la misma estructura funcional y visual de producción.

Mantener:

- título;
- texto introductorio;
- botón principal `Realizar checkpoint aquí`;
- botón secundario `Abrir en Genially en nueva pestaña`;
- iframe o contenedor Genially;
- fallback si el recurso no carga;
- color/acento naranja;
- comportamiento responsive;
- rutas y enlaces reales.

Texto introductorio base:

```text
Esta actividad formativa te permitirá revisar tu comprensión sobre las aplicaciones estratégicas de los LLM en STEM, humanidades y educación especial.
```

Frase adicional permitida:

```text
Te recomendamos completar este checkpoint antes de pasar a la Lección 1.3, para consolidar las diferencias entre áreas de contenido y tipos de aplicación.
```

No convertirlo en tarjeta simple.  
No eliminar Genially.  
No cambiar enlaces.

---

## 11. Referencias

Regla fija:

La sección de referencias debe conservarse exactamente como producción.

Mantener:

- título `Referencias`;
- indicador `17 fuentes consultadas`;
- botón `Ver referencias`;
- comportamiento del acordeón;
- todas las referencias completas;
- orden;
- formato APA;
- autores;
- años;
- puntuación;
- cursivas;
- citas asociadas al contenido.

No resumir.  
No reescribir.  
No eliminar.  
No añadir.  
No cambiar el formato.

---

## 12. Estado de progreso y navegación final

Mantener:

- mensaje de completado;
- botón `Marcar como completado`;
- lógica de progreso;
- navegación final.

Navegación sugerida:

```text
← Volver a la Lección 1.1
Ir a la Lección 1.3 →
```

No romper rutas existentes.

---

## 13. Recomendaciones UX-UI específicas

### 13.1 Imágenes

Todas las imágenes deben mantenerse:

- Ciencias y Matemáticas.
- Español e Historia.
- Educación Especial/PEI.
- Inglés y otros idiomas.
- Interactivo “LLM en el Aula”.
- Cualquier imagen existente en producción.

Reglas:

- Usar `alt` descriptivo.
- No convertir imágenes en fondo decorativo.
- No hacerlas demasiado grandes.
- En desktop, pueden acompañar el texto.
- En móvil, deben ir debajo del texto.
- Si alguna imagen es pequeña o tipo infografía, puede usar `.image-zoom-trigger` si ya existe el patrón.

### 13.2 Lectura progresiva

Puede usarse lectura progresiva para:

- detalles complementarios extensos;
- explicaciones secundarias;
- aclaraciones de imágenes;
- contenido adicional que no sea esencial en primera lectura.

No usar lectura progresiva para esconder:

- citas académicas principales;
- definición de cada área;
- aplicaciones clave;
- conexión con el rol;
- glosario;
- checkpoint;
- referencias.

### 13.3 Scroll Reveal

No implementar Scroll Reveal en esta iteración.

Razón:

- Hay muchas imágenes, tarjetas e interactivos.
- Añadir animación puede aumentar carga cognitiva extrínseca.
- Primero debe estabilizarse estructura, responsive e integridad de contenido.

---

## 14. Instrucción técnica para Antigravity

Copiar y pegar en Antigravity:

```text
Necesito rediseñar la organización de la Lección 1.2 del LMS Docencia 4.0 aplicando UX-UI, desarrollo instruccional y reducción de carga cognitiva.

Usa como referencia visual y estructural el prototipo aprobado:

leccion1_1_ux_carga_cognitiva_prototype.html

Archivo de producción a revisar:

leccion1_2.html

Crear prototipo:

leccion1_2_ux_carga_cognitiva_prototype.html

No modificar producción.
No modificar main.css.
No modificar progress-tracker.js.
No modificar Firebase, autenticación, scripts globales ni rutas globales.
No hacer deploy.
No usar git add .

Regla central:
Conservar todas las partes del contenido de producción y del documento M1_leccion1_2_editada. No eliminar citas, referencias, imágenes, audio, interactivo, glosario, checkpoint, Genially, progreso ni navegación.

Estructura obligatoria:
1. Encabezado de la lección.
2. Audio inicial.
3. Organizador de la lección.
4. Ciencias y Matemáticas: razonamiento paso a paso y resolución de problemas.
5. Español e Historia: análisis textual y síntesis crítica.
6. Inglés y otros idiomas: interacción comunicativa y escritura guiada.
7. Educación Especial: adaptación y accesibilidad (PEI).
8. Actividad interactiva: mapa de aplicaciones estratégicas.
9. Conexión con tu rol como facilitador docente.
10. Glosario dinámico: Conceptos a repasar.
11. Cierre textual.
12. Checkpoint de saberes: Lección 1.2.
13. Referencias.
14. Estado de progreso.
15. Navegación final.

Reglas visuales:
- Usar contenedor flotante institucional igual al aprobado en Lección 1.1.
- Mantener H1 limpio y sin breadcrumb interno.
- Usar audio al inicio.
- Usar tarjetas y layouts de dos columnas cuando la imagen acompañe texto.
- Usar una columna en móvil.
- Ajustar el interactivo para que no sea excesivamente grande.
- Mantener el interactivo funcional.
- No usar Scroll Reveal todavía.

Reglas fijas:
- Glosario dinámico debe copiarse igual que producción.
- Checkpoint debe conservar estructura visual y funcional de producción.
- Referencias deben conservar estructura, texto, orden y formato de producción.
- No resumir ni reescribir referencias ni glosario.
- No modificar citas integradas.

CSS:
Se permite CSS local controlado bajo namespace:

.leccion1-2-prototype

Solo si es necesario.
Debe usar tokens de main.css.
No usar colores hardcoded.
No redefinir tipografías globales.
Documentar todo CSS local en QA.

QA:
Crear o actualizar:

QA_leccion1_2_ux_carga_cognitiva.md

Debe confirmar:
1. Producción no fue modificada.
2. main.css no fue modificado.
3. Audio funciona.
4. Todas las imágenes se conservaron.
5. Interactivo se conserva y se ajustó de tamaño.
6. Interactivo sigue funcional.
7. Todas las citas se preservaron.
8. Glosario se copió igual que producción.
9. Checkpoint conserva estructura de producción.
10. Referencias se copiaron exactamente como producción.
11. Progreso funciona.
12. Navegación funciona.
13. Responsive desktop/tablet/móvil.
14. Consola sin errores.
15. Resultado de git status.
```

---

## 15. Criterio de aprobación

La Lección 1.2 solo debe aprobarse si:

- mantiene todas las secciones;
- conserva todas las imágenes;
- conserva el interactivo y reduce su tamaño visual;
- no elimina citas;
- conserva glosario, checkpoint y referencias exactamente como producción;
- sigue el patrón visual aprobado de Lección 1.1;
- mejora la lectura sin resumir contenido;
- no modifica producción.
