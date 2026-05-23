# Lección 3.4: Seguridad de datos en tareas administrativas

## 🎧 Audio inicial

<strong>Escuchar Lección 3.4</strong> — (Reproducir audio)

Acompaña la lectura con la narración guiada. Esta lección te entrega un protocolo concreto de <strong>anonimización</strong> y prácticas seguras mínimas para proteger a tus estudiantes, familias y colegas al usar IA.

---

## 📌 Resumen inicial

En esta lección consolidarás un protocolo riguroso de <strong>protección de datos</strong> al usar IA en tareas administrativas y evaluativas.

Identificarás claramente qué constituye <strong>Información Personal Identificable (PII)</strong>, aprenderás un <strong>protocolo de anonimización de cuatro pasos</strong>, conocerás los riesgos habituales y adoptarás las <strong>prácticas seguras mínimas</strong> alineadas con la Ley <strong>FERPA</strong> y las normativas del <strong>DEPR</strong>.

Al cerrar, contarás con un marco conceptual de seguridad que te permitirá aprovechar las ventajas de la automatización sin comprometer la <strong>confidencialidad estudiantil</strong>.

---

## 🎯 Concepto central

Cualquier integración significativa de IA en procesos administrativos y evaluativos debe acompañarse de marcos claros sobre <strong>ética</strong>, <strong>transparencia</strong> y <strong>manejo responsable de información</strong>.

La responsabilidad de proteger datos recae tanto en la configuración del servicio como en las prácticas del usuario.

Tu <strong>juicio profesional</strong> incluye decidir qué nunca debe ingresar en un LLM y qué requiere <strong>anonimización previa</strong>.

---

## 1️⃣ Lista de verificación ética: el marco regulatorio

El uso de IA en la generación de documentos administrativos y evaluativos exige una atención rigurosa a la protección de datos personales de estudiantes, familias y colegas.

### 🔬 Evidencia investigativa

Aunque muchas investigaciones se centran en la precisión y utilidad de las herramientas de IA, autores como Kolade et al. (2024) subrayan que cualquier integración significativa de IA en procesos evaluativos debe acompañarse de marcos claros sobre <strong>ética</strong>, <strong>transparencia</strong> y <strong>manejo responsable de información</strong>.

---

## ⚖️ Marco legal aplicable

- La <strong>Ley de Derechos Educativos y Privacidad de la Familia (FERPA)</strong> en Estados Unidos, aplicable a Puerto Rico, protege los registros educativos de los estudiantes y prohíbe la divulgación de <strong>información personal identificable</strong> sin consentimiento.

### 🧩 Distinción clave

Es importante diferenciar entre el <strong>LLM como tecnología base</strong> y las <strong>aplicaciones o bots</strong> que lo integran, pues la responsabilidad de proteger datos recae tanto en la configuración del servicio como en las prácticas del usuario.

---

## 2️⃣ Información Personal Identificable (PII): qué NUNCA debe ingresarse

| Ícono | Tipo de PII | Ejemplos prohibidos |
|---|---|---|
| 👤 | <strong>Nombres completos</strong> | De estudiantes, familias o colegas. |
| 🆔 | <strong>Números de identificación</strong> | SIE, seguro social, números de caso. |
| 🏠 | <strong>Direcciones</strong> | Residenciales, postales o correos personales. |
| 🩺 | <strong>Información médica</strong> | Diagnósticos, medicamentos, condiciones de salud. |
| 🖼️ | <strong>Imágenes/audio identificables</strong> | Fotografías o grabaciones. |
| 🧬 | <strong>Datos biométricos</strong> | Huellas o reconocimiento facial. |
| 💵 | <strong>Información financiera</strong> | Ingresos familiares, situaciones económicas específicas. |
| ⚖️ | <strong>Información legal</strong> | Casos de custodia, órdenes de protección, situaciones judiciales. |

---

## 3️⃣ Protocolo de anonimización antes de usar IA

| Paso | Acción | Detalle |
|---|---|---|
| <strong>1</strong> | <strong>Identificar datos sensibles en el documento</strong> | Revisar el texto completo y marcar todo dato que pueda identificar a una persona. |
| <strong>2</strong> | <strong>Reemplazar sistemáticamente</strong> | Aplicar sustituciones estándar. |
| <strong>3</strong> | <strong>Revisar contexto</strong> | Asegurar que la combinación de datos anónimos no permita identificación indirecta. |
| <strong>4</strong> | <strong>Verificar antes de pegar</strong> | Última revisión completa antes de ingresar el texto en el LLM. |

---

## 🔄 Tabla de sustituciones estándar

| Dato original | Reemplazo seguro |
|---|---|
| <strong>Nombres</strong> | "Estudiante A", "Familia 1", "Colega X" |
| <strong>SIE / ID</strong> | Eliminar completamente o usar "ID-###" |
| <strong>Escuela específica</strong> | "Escuela primaria pública" |
| <strong>Direcciones</strong> | "Comunidad urbana", "área rural" |
| <strong>Diagnósticos</strong> | Descripción general como "dificultades de aprendizaje" o "necesidades especiales" |

---

## 💡 Ejemplo aplicado: antes y después de la anonimización

### ❌ Antes — Con PII — no usar

> "María González Ortiz (SIE: 123456789), estudiante de 4to grado en la Escuela Juan Ponce de León de Bayamón, vive en Calle Los Pinos #45 con su abuela. Tiene diagnóstico de TDAH y toma Ritalin 10mg. Su madre está en prisión federal."

### ✅ Después — Anonimizado — seguro para IA

> "Estudiante A, 4to grado en escuela pública urbana, vive con familiar extendido. Presenta necesidades de atención y concentración que requieren acomodaciones educativas. Situación familiar compleja que afecta estabilidad emocional."

### 🧠 Observación pedagógica

La versión anonimizada conserva la información pedagógica relevante para que la IA genere un borrador útil, eliminando todo elemento identificable.

---

## 4️⃣ Riesgos habituales en el uso de IA

### 🔬 Evidencia investigativa

La literatura sobre sistemas de evaluación automatizada y análisis de datos educativos advierte que la acumulación de información sensible en plataformas digitales sin protocolos claros aumenta el riesgo de <strong>filtraciones</strong>, <strong>usos secundarios no autorizados</strong> o <strong>interpretaciones erróneas</strong> (Yan et al., 2020).

---

## ⚠️ Riesgos concretos al usar herramientas generativas

| Riesgo | Cómo ocurre |
|---|---|
| <strong>Copiar/pegar descuidado</strong> | Transferir documentos completos sin revisar datos sensibles. |
| <strong>Capturas de pantalla</strong> | Compartir imágenes con información en bordes o fondos. |
| <strong>Historial de conversaciones</strong> | Los LLM almacenan conversaciones; datos sensibles quedan en servidores. |
| <strong>Cuentas compartidas</strong> | Otros usuarios podrían acceder al historial. |
| <strong>Exportación de resultados</strong> | Documentos generados con metadata que conserva PII original. |

---

## 5️⃣ Prácticas seguras mínimas

| Práctica | Cómo aplicarla |
|---|---|
| <strong>Usar cuentas institucionales</strong> | Algunas instituciones tienen acuerdos con proveedores de IA que incluyen protecciones adicionales de datos. |
| <strong>Desactivar historial de conversaciones</strong> | En ChatGPT: Settings → Data Controls → Chat History & Training —desactivar—. Evita que las conversaciones se almacenen o se usen para entrenar modelos. |
| <strong>Sesiones temporales</strong> | Usar modo incógnito o eliminar conversaciones inmediatamente después de usarlas. |
| <strong>No usar IA para decisiones finales sobre estudiantes</strong> | La IA puede sugerir lenguaje o estructura, pero el maestro toma las decisiones de contenido, especialmente en documentos legales como PEI. |
| <strong>Verificar políticas institucionales</strong> | Consultar con el distrito escolar o departamento de tecnología sobre políticas específicas. |
| <strong>Documentar el proceso</strong> | Mantener registro de qué herramientas se usaron, para qué propósito y cómo se anonimizó. |
| <strong>Educar a colegas</strong> | Compartir estas prácticas para crear cultura de uso seguro. |

---

## 6️⃣ Marco conceptual de seguridad — adaptado de principios FERPA

[Figura vinculada: Esquema de seguridad de datos en tareas administrativas — protocolo integral de manejo de PII en entornos de IA.]

---

## 🤔 Antes de usar IA, pregúntate

| # | Pregunta de verificación |
|---|---|
| <strong>1</strong> | ¿Este texto contiene información que permita identificar a un estudiante específico? |
| <strong>2</strong> | ¿Usaría este mismo texto en una conversación pública sin preocuparme? |
| <strong>3</strong> | ¿He eliminado TODOS los identificadores directos e indirectos? |
| <strong>4</strong> | ¿La herramienta que voy a usar tiene protecciones de privacidad activadas? |
| <strong>5</strong> | ¿Existe algún riesgo de que esta información se vincule con otros datos? |

### 🚦 Regla de decisión

Si respondes <strong>"NO"</strong> a cualquiera de las primeras 4 preguntas, o <strong>"SÍ"</strong> a la quinta: <strong>NO uses IA hasta anonimizar completamente</strong>.

---

## 7️⃣ Escudo Ético: componente interactivo

[Interactivo]

---

## 👩‍🏫 Conexión con tu rol como facilitador docente

Como facilitador o facilitadora docente del <strong>DEPR</strong>, esta lección es especialmente crítica dada la naturaleza confidencial de la información que manejas y modelas para otros profesionales:

- <strong>Custodio institucional de la confidencialidad:</strong> especialmente si tu rol es Facilitador Docente de Educación Especial —<strong>FDEE</strong>—, gestionas información altamente sensible —PEI, diagnósticos, observaciones clínicas—. Esta lección consolida tu protocolo profesional para usar IA sin nunca comprometer datos estudiantiles.

- <strong>Multiplicador de la cultura de uso seguro:</strong> desde tu rol referente, eres responsable de educar a colegas sobre estas prácticas —uno de los siete puntos del marco—, fortaleciendo la cultura institucional de cumplimiento con <strong>FERPA</strong> y normativas del <strong>DEPR</strong>.

- <strong>Modelaje del protocolo de anonimización:</strong> podrás demostrar el protocolo de cuatro pasos en talleres y sesiones MECPA, convirtiéndolo en un estándar institucional para todo recurso generado con IA por el cuerpo docente.

- <strong>Acompañamiento a maestros en redacción de PEI:</strong> podrás guiar a docentes para que apliquen las tablas de sustitución estándar antes de usar IA en la redacción asistida del <strong>PLEP</strong>, metas <strong>SMART</strong> y narrativas —alineado con la Lección 3.3—.

- <strong>Auditor de prácticas digitales del personal:</strong> desde tu rol de mentoría, podrás verificar la configuración —historial desactivado, cuentas institucionales, eliminación de conversaciones— y promover el registro documentado del uso de IA en tareas administrativas.

- <strong>Aporte directo a la investigación:</strong> esta lección desarrolla competencias clave para el plan de acción del estudio, especialmente en la dimensión ética. Las prácticas de anonimización y los protocolos generados se convierten en evidencia cualitativa sobre los desafíos que los facilitadores docentes identifican en la integración de los LLM y refuerzan la dimensión de responsabilidad profesional documentada en la posprueba.

---

## 🏁 Qué debes recordar

✅ <strong>FERPA aplica a Puerto Rico</strong> y protege los registros educativos: nunca ingreses PII en un LLM.

✅ <strong>8 categorías de PII están prohibidas:</strong> nombres, IDs, direcciones, datos médicos, imágenes/audio, biométricos, financieros y legales.

✅ Aplica el protocolo de 4 pasos: <strong>Identificar → Reemplazar → Revisar contexto → Verificar</strong> antes de pegar cualquier texto.

✅ Cuidado con riesgos invisibles: historial de chat, capturas de pantalla, cuentas compartidas y metadata en archivos exportados.

✅ Las <strong>7 prácticas seguras mínimas</strong> son innegociables: cuenta institucional, historial desactivado, sesiones temporales, no usar IA para decisiones finales, verificar políticas, documentar y educar.

✅ La regla de decisión: si respondes <strong>"NO"</strong> a alguna de las 4 primeras preguntas del marco, o <strong>"SÍ"</strong> a la quinta, no uses IA hasta anonimizar completamente.

---

## 🎉 Meta alcanzada — ¡Felicidades!

Has culminado la <strong>Lección 3.4</strong> del programa de formación profesional.

Al completar este contenido, diste un paso fundamental para un uso responsable de la IA en la escuela: ahora distingues claramente qué es <strong>PII</strong>, cómo anonimizar textos antes de trabajarlos con un modelo de lenguaje y qué prácticas mínimas debes aplicar para proteger a estudiantes, familias y colegas.

Esta conciencia fortalece tu rol profesional, porque te permite aprovechar las ventajas de la automatización sin comprometer la <strong>confidencialidad</strong> ni el cumplimiento de <strong>FERPA</strong> y de las normas del <strong>DEPR</strong>.