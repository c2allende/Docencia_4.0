Lección 2.1: El arte de pedir: Ingeniería de prompts aplicada a educación
¿Qué es un prompt en el contexto de LLM?
En el contexto de los modelos de lenguaje de gran tamaño (LLM), un prompt es la instrucción en lenguaje natural que el usuario introduce para activar y guiar la respuesta del modelo. Los LLM responden a “instrucciones en lenguaje natural” y su desempeño depende fuertemente de cómo se formula esa instrucción.
Desde la perspectiva educativa, un prompt es el “puente” entre la intención pedagógica del docente (por ejemplo, planificar una clase, generar preguntas o adaptar un texto) y el resultado que produce la IA. Con bots o aplicaciones basadas en LLM, como ChatGPT, el contenido generado puede variar significativamente en calidad y relevancia dependiendo de la claridad y especificidad del prompt proporcionado por el usuario.
Los prompts bien estructurados son esenciales para obtener respuestas útiles, precisas y apropiadas al contexto de los modelos de lenguaje generativo, por lo que aprender a escribir buenos prompts se convierte en una competencia profesional clave para docentes que integran LLM y las aplicaciones que los usan en su práctica.
Fórmula del prompt efectivo: Rol + Contexto + Tarea + Formato + Restricciones
En educación, se ha observado que los prompts “estándar” producen respuestas aceptables, pero la calidad mejora cuando el docente explicita el rol del modelo, ofrece contexto suficiente, define con claridad la tarea, pide un formato específico y establece límites o criterios de calidad.
Los patrones de prompt representan soluciones reutilizables a problemas recurrentes de redacción de prompts y pueden ayudar a los usuarios a diseñar mejores prompts de manera sistemática. Adaptando estas ideas al contexto docente, podemos organizar la fórmula del prompt efectivo en cinco componentes:
•	Rol
Indica el papel que debe asumir el modelo.
•	Ejemplo: “Actúa como maestro de matemáticas de 7mo grado en Puerto Rico…”
Definir un rol claro ayuda a que un LLM genere planes de clase más coherentes con las expectativas docentes.
•	Contexto
Proporciona la información necesaria sobre grupo, nivel, currículo o situación.
•	Ejemplo: “Trabajo con un grupo de 30 estudiantes, muchos con dificultad en la lectura comprensiva, siguiendo los Estándares del DEPR para 7mo grado…”
•	Tarea
Es la acción específica que se le pide al modelo.
•	Ejemplo: “Diseña una clase de 45 minutos sobre ecuaciones lineales…”
•	Formato
Indica cómo debe presentarse la respuesta.
•	Ejemplo: “…organizada en una tabla con columnas de inicio, desarrollo y cierre, incluyendo tiempo estimado.”
•	Restricciones
Señalan límites, criterios o condiciones que debe respetar la respuesta.
•	Ejemplo: “…usa ejemplos contextualizados a Puerto Rico y evita lenguaje técnico complejo. No inventes estándares; usa solo los que te proporciono.”
En términos prácticos, un prompt efectivo podría verse así:
“Actúa como maestro de 5to grado de ciencias en Puerto Rico. Trabajo con un grupo heterogéneo según los Estándares y Expectativas del DEPR para 5to grado. Diseña una clase de 45 minutos sobre ecosistemas, con actividades de inicio, desarrollo y cierre. Presenta el plan en formato de tabla e incluye una breve descripción de cada actividad. Usa ejemplos relacionados con bosques y costas de Puerto Rico y lenguaje accesible para estudiantes de 10–11 años.”
El uso de técnicas estándar de ingeniería de prompts, como la asignación de roles y los seed-word prompts, ha demostrado mejorar la pertinencia y la estructura de los planes de lección generados, lo que respalda el uso explícito de Rol, Contexto y Tarea en el trabajo docente.
Iteración y refinamiento: “conversar” con el modelo
Un aspecto clave de la ingeniería de prompts es entender que el primer resultado no suele ser el definitivo. En lugar de aceptar la primera respuesta, el docente puede iterar: pedir aclaraciones, ajustes, más ejemplos o cambios de enfoque.
El uso de bots basados en LLM en educación se beneficia de un proceso iterativo de refinamiento de prompts, en el que los usuarios ajustan progresivamente sus consultas para obtener respuestas más precisas y relevantes. De forma similar, se ha documentado un proceso en tres etapas con ChatGPT (lluvia de ideas, refinamiento y redacción) donde el uso de prompting en pocas muestras (few-shot prompting) permitió una mejora progresiva en la coherencia y relevancia.
En el contexto de este módulo, iterar implica:
•	Reformular el prompt cuando la respuesta es demasiado general:
•	“Hazlo más breve”, “usa ejemplos de ciencias para 4to grado”, “incluye solo actividades que se puedan hacer sin laboratorio.”
•	Pedir explicaciones paso a paso (chain-of-thought):
•	Pedir al modelo que explique su razonamiento “step by step” mejora la calidad de las respuestas en tareas de razonamiento.
•	Usar few-shot prompting: 
•	Proporcionar ejemplos de lo que se espera antes de pedir una nueva salida.
Ejemplo de few-shot en educación:
“Te mostraré un ejemplo de pregunta de comprensión lectora que necesito:
Ejemplo 1: ‘¿Qué motivación tenía el personaje principal al inicio del cuento?’
Ejemplo 2: ‘¿Cómo cambió la actitud del protagonista después del conflicto?’
Ahora genera 5 preguntas similares para el siguiente texto: [pegar texto].”
Se ha demostrado que los LLM pueden aprender nuevos patrones “en contexto” con solo unos pocos ejemplos, sin necesidad de re-entrenamiento, lo que se denomina few-shot learning. En estos estudios se señala que los modelos de lenguaje pueden realizar tareas especificadas solo mediante descripciones en lenguaje natural o con unas pocas demostraciones, enfatizando la importancia de cómo se formula el prompt y los ejemplos incluidos.
Uso de plantillas de prompts y adaptación al contexto DEPR
Para los docentes, no se trata de memorizar teoría sobre LLM, sino de disponer de estructuras de prompts reutilizables que luego puedan adaptar a su nivel, materia y realidad escolar. Los patrones de prompt funcionan como plantillas conceptuales que los usuarios pueden llenar con su propio contenido, lo cual encaja directamente con la idea de un banco de plantillas para planificación, rúbricas y diferenciación.
Estudios recientes muestran que es posible ayudar a maestros a generar proyectos culturalmente pertinentes usando únicamente modificaciones en el lenguaje de los prompts, sin programación adicional. En estos trabajos se observa que los docentes pudieron ajustar iterativamente sus prompts para orientar al modelo hacia ideas de proyectos más culturalmente pertinentes, lo que refuerza la importancia de plantillas que incluyan referencias explícitas al contexto local.
En el contexto del DEPR, esto significa:
•	Incluir en las plantillas campos para:
•	Grado y materia
•	Estándar(es) específico(s) del DEPR
•	Tiempo lectivo disponible
•	Características generales del grupo (heterogeneidad, educación especial, ELL)
•	Contexto sociocultural (ej. “Puerto Rico”, “comunidad rural/urbana”)
Ejemplo de plantilla de prompt para planificación:
“Actúa como [ROL: maestro/a de ___ grado de ___ en Puerto Rico].
Estoy planificando una clase para [CONTEXTO: grupo de ___ estudiantes, con ___ características].
Según el estándar [copia y pega el estándar del DEPR], [TAREA: diseña una clase de ___ minutos] con actividades de inicio, desarrollo y cierre.
[FORMATO: Presenta la planificación en formato de tabla con columnas de objetivos, actividades, recursos y tiempo estimado].
[RESTRICCIONES: Usa ejemplos contextualizados a Puerto Rico, lenguaje accesible para estudiantes de ___ años y no inventes estándares adicionales.]”
El uso de técnicas estándar de ingeniería de prompts, como la asignación de roles y los seed-word prompts, ha mostrado mejorar la pertinencia y la estructura de los planes de lección generados, lo cual respalda el uso de plantillas sistemáticas como las que este módulo propone. 

Conceptos a repasar
Ingeniería de prompts
La ingeniería de prompts es la práctica técnica de diseñar, estructurar y optimizar las instrucciones o entradas de texto (prompts) que se proporcionan a modelos de inteligencia artificial generativa, especialmente a grandes modelos de lenguaje, con el fin de orientar de manera precisa su comportamiento y obtener salidas específicas, pertinentes y de alta calidad. En términos formales, consiste en formular y refinar sistemáticamente los elementos del prompt (rol, contexto, datos de entrada, tarea, restricciones, formato de salida) para alinear la respuesta del modelo con la intención del usuario, reduciendo ambigüedad, errores y sesgos, y maximizando la utilidad de la interacción humano IA.

Janke, T., et al. (2024). Prompt engineering as a new 21st century skill. Frontiers in Education.
IBM. (2023). ¿Qué es la prompt engineering? IBM Think. https://www.ibm.com/mx-es/think/topics/prompt-engineering
Estructura Rol–Contexto–Tarea–Formato–Restricciones
La estructura Rol–Contexto–Tarea–Formato–Restricciones es un esquema de diseño de prompts que organiza la instrucción a un modelo de IA en cinco componentes: el Rol define la identidad o perfil experto que debe asumir el modelo; el Contexto aporta la información de fondo necesaria (audiencia, propósito, datos relevantes); la Tarea especifica la acción principal a realizar mediante un verbo claro; el Formato indica cómo debe presentarse la respuesta (lista, tabla, párrafo, esquema, etc.); y las Restricciones establecen límites de estilo, extensión, idioma u otros criterios que acotan la salida para hacerla más útil y controlable. Esta familia de plantillas se alinea con propuestas de estructuras similares de ingeniería de prompts que recomiendan desglosar las instrucciones en elementos como rol, objetivo/contexto, formato y restricciones para mejorar la precisión y relevancia de las respuestas de los grandes modelos de lenguaje (por ejemplo, guías prácticas de prompt engineering publicadas en 2024–2025 por comunidades especializadas y proveedores de formación en IA aplicada a educación y negocios).

PromptingGuide. (s. f.). Prompt engineering guide. https://www.promptingguide.ai
Few-shot prompting / Few-shot learning
Few-shot prompting (o few-shot learning, en el contexto de LLM) es una técnica en la que se proporciona al modelo un pequeño conjunto de ejemplos de entrada–salida dentro del propio prompt para que “aprenda por demostración” cómo debe realizar una tarea, y luego se le pide que generalice ese patrón a casos nuevos sin volver a entrenar el modelo. En términos técnicos, se sitúa entre el zero-shot (sin ejemplos) y el fine-tuning supervisado: el modelo aprovecha su entrenamiento previo y ajusta su comportamiento a partir de 2–5 ejemplos bien escogidos, lo que mejora la precisión, la coherencia de formato y la alineación con la intención del usuario en tareas como clasificación, reformulación de textos o generación condicionada.

Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. Advances in neural information processing systems, 33, 1877-1901. https://dl.acm.org/doi/abs/10.5555/3495724.3495883

Cierre de la lección
Felicidades
Has culminado la lección 2.1 del programa de formación profesional.
Al completar el contenido 2.1, has pasado de “probar” la IA a entender cómo dirigirla: sabes qué es un prompt, cómo estructurarlo con Rol, Contexto, Tarea, Formato y Restricciones, y cómo iterar hasta obtener respuestas realmente útiles para tu aula. Esta competencia te coloca en un lugar estratégico, porque convierte al LLM en una herramienta a tu servicio y no al revés, alineando lo que pides con tus objetivos curriculares y con la realidad de tu estudiantado.
Invitación al checkpoint de saberes
Para cerrar este bloque, te invitamos a realizar el Checkpoint de Saberes 2.1, una evaluación formativa breve y no punitiva centrada en tu comprensión del prompt como puente pedagógico, de la fórmula Rol–Contexto–Tarea–Formato–Restricciones y de la importancia de iterar y usar ejemplos (few-shot prompting) al trabajar con LLM. Al completarlo, estarás generando evidencia de tu propio criterio profesional en torno a la ingeniería de prompts aplicada al currículo del DEPR, lo que te permitirá decidir con mayor claridad cómo pedir, qué ajustar y qué modelos de plantilla usar primero para apoyar tu planificación y diseño de actividades.
Enlace: 
<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Contenido 2.1: Quiz práctico-LLM" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/69add0e91ea68d18517aaeeb" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>
Referencias
Adiguzel, T., Kaya, M. H., & Cansu, F. K. (2023). Revolutionizing education with AI: Exploring the transformative potential of ChatGPT. Contemporary Educational Technology, 15(3), ep429. https://doi.org/10.30935/cedtech/13152
Heston, T. F., & Khun, C. (2023). Prompt engineering in medical education. International Medical Education, 2(3), 198–205. https://doi.org/10.3390/ime2030019
Hsu, H. P. (2023). Can generative artificial intelligence write an academic journal article? Opportunities, challenges, and implications. The Irish Journal of Technology Enhanced Learning, 7(2), 158–171.
Shehri, F. A., Maham, R., Malik, A., & Saif, O. B. (2023). Effects of ChatGPT on students academic performance: Mediating role of prompt engineering. The Asian Bulletin of Big Data Management, 3(2), 137–147.
Spasić, A. J., & Janković, D. S. (2023, June). Using ChatGPT standard prompt engineering techniques in lesson preparation: Role, instructions and seed-word prompts. In 2023 58th International Scientific Conference on Information, Communication and Energy Systems and Technologies (ICEST) (pp. 47–50). IEEE.
Tran, M. (2023, August). Prompt engineering for large language models to support K-8 computer science teachers in creating culturally responsive projects. In Proceedings of the 2023 ACM Conference on International Computing Education Research – Volume 2 (pp. 110–112).
Wei, J., Wang, X., Schuurmans, D., Bosma, M., Xia, F., Chi, E., ... & Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. Advances in Neural Information Processing Systems, 35, 24824–24837.
White, J. (2023). A prompt pattern catalog to enhance prompt engineering with ChatGPT. arXiv preprint arXiv:2302.11382.
Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., ... & Wen, J. R. (2023). A survey of large language models. arXiv preprint arXiv:2303.18223.
Zubiaga, A. (2024, January 12). Natural language processing in the era of large language models. Frontiers in Artificial Intelligence, 6, 1350306. https://doi.org/10.3389/frai.2023.1350306
