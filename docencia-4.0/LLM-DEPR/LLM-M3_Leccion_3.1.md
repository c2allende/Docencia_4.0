Lección 3.1: Diseño automatizado de instrumentos de evaluación
Introducción conceptual
La evaluación educativa se encuentra en un momento de transformación significativa impulsada por las capacidades de los modelos de lenguaje y otras herramientas de IA, que permiten automatizar partes del diseño de instrumentos sin sustituir el juicio profesional docente. Estudios recientes muestran que, cuando se diseñan cuidadosamente e integran de forma pedagógicamente informada, las herramientas impulsadas por IA pueden mejorar resultados de aprendizaje y apoyar prácticas evaluativas más consistentes y eficientes en comparación con métodos tradicionales puramente manuales (Kwak, 2025; Luo et al., 2025). En este contexto, el objetivo no es que la IA “decida” sobre los estudiantes, sino que apoye la generación de borradores y estructuras de instrumentos que el maestro revisa, adapta y valida según el currículo y el contexto local.
Generación de instrumentos: Rúbricas, listas de cotejo y hojas de evaluación
Las rúbricas son herramientas centrales para la evaluación auténtica y basada en competencias, pero su construcción exige tiempo y dominio técnico. Experiencias con generadores de rúbricas impulsados por IA evidencian que la IA puede ayudar a mapear resultados de aprendizaje, criterios y niveles de desempeño en rúbricas de competencia, facilitando que el docente tenga plantillas de partida alineadas al perfil de egreso y a estándares específicos (Hochstetter-Diez et al., 2025; Estrada & Fabián, 2024). En estos entornos, la IA se utiliza para generar borradores de rúbricas que luego son afinados por equipos docentes, logrando mayor coherencia y transparencia en la evaluación.

Rúbricas analíticas vs. holísticas:
•	Las rúbricas analíticas desglosan el desempeño en múltiples criterios independientes, permitiendo retroalimentación detallada. Los LLMs pueden generar matrices de criterios con descriptores de niveles (Exceeds, Meets, Approaching, Below) cuando el prompt especifica el estándar, la tarea y el número de criterios deseados.
•	Las rúbricas holísticas evalúan el desempeño global de forma integrada. Los LLMs pueden producir descripciones de niveles generales cuando el prompt enfatiza la visión de conjunto y evita la fragmentación excesiva.
Listas de cotejo:
Son herramientas binarias (presente/ausente) útiles para verificar completitud de procesos o productos. Los LLMs pueden generar listas de cotejo exhaustivas cuando se les indica el proceso a evaluar, pero el docente debe validar que los ítems sean observables, relevantes y secuenciados apropiadamente antes de integrarlos en un instrumento formal.
Prompt efectivo para rúbrica analítica (ejemplo):
Rol: Eres un especialista en evaluación educativa del Departamento de Educación de Puerto Rico. 
Tarea: Diseña una rúbrica analítica para evaluar una presentación oral en español de 5to grado sobre "El ciclo del agua", alineada al estándar [indicar estándar DEPR exacto].
Requisitos de la rúbrica (Salida estructurada):
1.	[#] Criterios de evaluación (Filas): contenido, organización, expresión oral y uso de recursos visuales
2.	[#] Niveles de desempeño (Columnas): Avanzado, Proficiente, Básico, Por Debajo de lo Básico
3.	Descriptores: Deben ser claros, específicos y utilizar un lenguaje apropiado para el desarrollo cognitivo de 5to grado.
4.	Alineación DUA: Asegura que los descriptores sean accesibles y promuevan el aprendizaje activo.
Restricciones:
-	Evita la ambigüedad en los niveles de desempeño; cada salto de nivel debe ser observable y medible.
-	Mantén la precisión técnica sobre el tema de la fotosíntesis dentro de los descriptores de contenido.
Formato: Presenta la información en una tabla de Markdown para facilitar su lectura y transferencia a documentos oficiales.

Banco de reactivos y niveles de complejidad
Los modelos de lenguaje pueden apoyar la generación de bancos de reactivos (selección múltiple, cierto/falso, preguntas abiertas) organizados según marcos de complejidad cognitiva como la Taxonomía de Bloom revisada o la profundidad de conocimiento (DOK). La literatura muestra que la IA puede generar preguntas alineadas a contenidos específicos y variar su dificultad cuando se le proporcionan descriptores claros del nivel cognitivo deseado (Kwak, 2025; Yan et al., 2020). Sin embargo, estos sistemas pueden introducir errores conceptuales sutiles, formulaciones confusas o distractores mal diseñados, por lo que la revisión humana sigue siendo indispensable.
Buenas prácticas para el uso de IA en bancos de reactivos incluyen:
•	Indicar explícitamente el contenido, el nivel de grado y el nivel cognitivo deseado.
•	Solicitar que se identifique la respuesta correcta y la explicación, para que el docente verifique ambos.
•	Mantener un registro de preguntas validadas y descartadas, construyendo progresivamente un banco curado.
Experimentos con ChatGPT en contextos de evaluación universitaria han mostrado que, aunque el modelo es capaz de generar ítems plausibles y de cierto nivel de originalidad, requiere supervisión para evitar ambigüedades y para asegurar que los reactivos midan las competencias que se desea evaluar y no solo memorización superficial (Kolade et al., 2024).
La Taxonomía de Bloom revisada (Anderson & Krathwohl, 2001) y los Niveles de Conocimiento de Norman Webb (Webb, 1997) proporcionan marcos para clasificar preguntas por complejidad cognitiva. Los LLMs pueden generar preguntas en múltiples niveles cuando el prompt especifica el nivel deseado y proporciona el contexto del contenido.
Niveles de complejidad cognitiva:
Bloom:
•	Recordar (nivel 1)
•	Comprender (nivel 2)
•	Aplicar (nivel 3)
•	Analizar (nivel 4)
•	Evaluar (nivel 5)
•	Crear (nivel 6)
Webb (Depth of Knowledge - DOK):
•	DOK 1: Recordar y reproducir
•	DOK 2: Conceptos y destrezas
•	DOK 3: Pensamiento estratégico
•	DOK 4: Pensamiento extendido
Generación de exámenes y quizzes:
Los LLMs pueden producir reactivos de selección múltiple, cierto/falso y preguntas abiertas cuando se especifica:
1.	El contenido o estándar a evaluar
2.	El nivel de complejidad deseado (Bloom/Webb)
3.	El formato del reactivo
4.	Restricciones (longitud, vocabulario, ejemplos contextualizados)
Advertencia crítica: La investigación reciente demuestra que aunque los LLMs generan preguntas de alta calidad y originalidad, presentan dificultades con el formato de referencias y pueden generar contenido similar si se consultan desde la misma cuenta repetidamente (Abdi & Ng, 2024). Por tanto, el docente debe:
•	Verificar exactitud factual de cada reactivo
•	Validar que los distractores (en selección múltiple) sean plausibles pero incorrectos
•	Asegurar que las respuestas correctas estén fundamentadas curricularmente
•	Revisar el balance de niveles cognitivos en el instrumento completo
Integración con LMS (Learning Management Systems)
La transferencia eficiente de instrumentos generados a plataformas institucionales o apps que integran LLMs, como Microsoft Teams o Google Classroom, requiere flujos de trabajo estructurados.
Flujo recomendado:
1.	Generar el instrumento con el LLM en formato editable (tabla, lista)
2.	Revisar y validar manualmente el contenido
3.	Exportar a formato compatible con el LMS (CSV para bancos de preguntas, documento para rúbricas)
4.	Importar a la plataforma institucional
5.	Configurar parámetros de asignación (fecha, ponderación, retroalimentación automática si aplica)
Consideraciones técnicas:
•	Google Classroom acepta rúbricas en formato de tabla; se pueden copiar/pegar desde documentos
•	MS Teams permite adjuntar rúbricas como documentos o integrarlas en Assignments
•	Para bancos de reactivos, algunas plataformas aceptan importación en formato QTI (Question and Test Interoperability) o CSV
La literatura sobre diseño de herramientas de aprendizaje basadas en IA enfatiza que la integración efectiva en ecosistemas digitales requiere no solo compatibilidad técnica, sino también considerar la experiencia del docente y la facilidad de uso de los flujos de trabajo, de manera que la tecnología reduzca y no aumente la carga operativa (Luo et al., 2025).

Conceptos a repasar
Evaluación educativa
La evaluación educativa es un proceso sistemático de recogida, análisis e interpretación de evidencias sobre los conocimientos, habilidades, actitudes y competencias del alumnado, con el propósito de emitir juicios de valor y tomar decisiones fundamentadas para mejorar el aprendizaje, la enseñanza y el currículo. En el contexto de los LLM, este proceso incluye el uso de modelos de lenguaje como apoyo para diseñar instrumentos (rúbricas, bancos de reactivos, listas de cotejo) y analizar respuestas, pero manteniendo siempre el control humano sobre la selección de evidencias, la interpretación de resultados y las decisiones pedagógicas que se derivan.

Mendiola, M. S., Maldonado, L. D., Hernández, F. F., Leenen, I., & González, A. M. (2015). Evaluación del aprendizaje. Educación Médica: teoría y práctica, 17-39.
Generación de instrumentos: Rúbricas, listas de cotejo y hojas de evaluación
Generación de instrumentos (rúbricas, listas de cotejo y hojas de evaluación) con LLM se refiere al uso de modelos de lenguaje grandes para producir, a partir de instrucciones textuales, borradores estructurados de matrices de evaluación (rúbricas analíticas u holísticas), checklists y formularios de valoración que incluyen criterios, niveles de desempeño y descriptores alineados con resultados de aprendizaje y estándares curriculares. En términos técnicos, el LLM actúa como generador de propuestas iniciales de instrumentos que el docente revisa, adapta y valida, aprovechando su capacidad para organizar información en tablas, listas y escalas descriptivas, pero manteniendo el control humano sobre la pertinencia pedagógica, la claridad de los enunciados y la coherencia con el perfil de egreso.
Rúbricas analíticas vs. Holísticas
Rúbricas analíticas y rúbricas holísticas son dos tipos de instrumentos de evaluación que pueden ser diseñados tanto de forma tradicional como con apoyo de LLM, pero que organizan la información de manera distinta. Una rúbrica analítica desglosa el desempeño en varios criterios o dimensiones (por ejemplo, contenido, organización, lenguaje), asignando niveles de logro y descriptores específicos a cada criterio; cuando se usa un LLM, este puede generar matrices con criterios y descriptores diferenciados por nivel, que luego el docente ajusta para dar retroalimentación detallada y calificar sumando los puntajes parciales por criterio. En contraste, una rúbrica holística valora el trabajo como un todo integrado, ofreciendo descripciones globales de cada nivel de desempeño sin separar formalmente las partes; en el contexto de LLM, el modelo puede producir descripciones sintéticas para cada nivel (por ejemplo, básico, competente, excelente) centradas en la impresión global de calidad, que el docente utiliza cuando necesita una evaluación más rápida y sumativa, aunque con menor detalle diagnóstico.

Universidad de Puerto Rico, Oficina de Evaluación del Aprendizaje Estudiantil. (2018). Desarrollo de rúbricas: Tipos de rúbricas y criterios de desempeño. UPR-RP. https://oeae.uprrp.edu/wp-content/uploads/2018/06/5-TALLER-5-DESARROLLO-DE-RUBRICAS.pdf
Listas de cotejo
Las listas de cotejo son instrumentos de evaluación estructurados que presentan una serie de criterios o indicadores observables y se registran de forma dicotómica (presente/ausente, logrado/no logrado), permitiendo verificar de manera rápida y objetiva el cumplimiento de determinados pasos, requisitos o desempeños en una tarea. En el contexto de LLM, estos modelos pueden generar borradores de listas de cotejo a partir de la descripción de la actividad, el nivel educativo y los resultados de aprendizaje deseados, pero corresponde al docente revisar los ítems, asegurar que sean claramente observables y pertinentes, y adaptarlos al currículo y al contexto de aula antes de utilizarlos como instrumento formal.

Universidad Nacional Autónoma de México. (2024). Lista de cotejo como instrumento de evaluación del y para el aprendizaje (Cap. 14). Centro de Enseñanza y Desarrollo Educativo. https://www.ceide.unam.mx/wp-content/uploads/2024/08/Capitulo-14-LISTA-DE-COTEJO.pdf
Banco de reactivos
Un banco de reactivos es un conjunto estructurado y organizado de preguntas o ítems de evaluación (por ejemplo, de opción múltiple, cierto/falso, respuesta corta o casos) almacenados en un espacio físico o virtual junto con su información asociada (contenido, autoría, fecha de alta, estadísticas de uso y parámetros psicométricos), que permite construir pruebas diferentes a partir de un mismo reservorio de ítems y gestionar su calidad técnica. En el contexto de los LLM, estos modelos pueden utilizarse para generar borradores de reactivos y proponer variaciones por nivel cognitivo o dificultad, mientras que el banco funciona como repositorio curado donde el docente selecciona, valida y calibra los ítems antes de administrarlos en plataformas de evaluación o LMS.

Admin. (2024, December 2). Construcción del banco de reactivos. Ceneval. https://ceneval.edu.mx/blog/2023/02/28/construccion-del-banco-de-reactivos/
Generación de exámenes y quizzes
La generación de exámenes y quizzes con LLM es el proceso mediante el cual un modelo de lenguaje grande produce, a partir de indicaciones textuales del docente (tema, estándar, nivel de complejidad, número y tipo de preguntas), un conjunto estructurado de ítems de evaluación organizados en una prueba usable (por ejemplo, examen escrito, quiz en línea o prueba de práctica). Técnicamente, el LLM actúa como motor de generación automática de reactivos y versiones de prueba (opción múltiple, cierto/falso, respuesta corta, casos), mientras que la persona docente mantiene el rol de control de calidad: revisa la validez de contenido, ajusta la redacción, equilibra los niveles cognitivos y decide qué ítems se incorporan al instrumento final y cómo se administrará en el LMS o entorno institucional.

Hadzhikoleva, S., Rachovski, T., Ivanov, I., Hadzhikolev, E., & Dimitrov, G. (2024). Automated test creation using large language models: A practical application. Applied Sciences, 14(19), 9125.
LMS (Learning Management Systems)
Un LMS (Learning Management System) es una plataforma de software que permite administrar, distribuir y hacer seguimiento de actividades de formación en línea, centralizando cursos, recursos, tareas, evaluaciones y registros de progreso del estudiantado en un mismo entorno digital. Alineado con los LLM, el LMS funciona como la infraestructura donde se integran bots o aplicaciones basadas en modelos de lenguaje (por ejemplo, asistentes para generar rúbricas, bancos de reactivos o retroalimentación automática), de modo que el LLM no sustituye al LMS, sino que se incrusta como servicio dentro de este ecosistema para apoyar el diseño, la entrega y el análisis de la evaluación educativa.

Colman, H. (2026, January 12). ¿Qué es un LMS y por qué es esencial para el aprendizaje corporativo? Blog De E-learning. https://www.ispring.es/blog/what-is-lms

Cierre de la lección
Felicidades
Has culminado la lección  3.1 del programa de formación profesional.
Al completar el contenido 3.1, has construido una base sólida para usar los LLM como aliados en el diseño de rúbricas, listas de cotejo y bancos de preguntas, entendiendo sus fortalezas y límites. Este conocimiento te permite aprovechar la automatización para ganar tiempo y consistencia, sin renunciar a tu criterio pedagógico ni al alineamiento con los estándares y el contexto de tu escuela y tus estudiantes.
Invitación al checkpoint de saberes
Para cerrar este bloque, te invitamos a realizar el Checkpoint de Saberes 3.1, una evaluación formativa breve y no punitiva centrada en el uso de LLM para generar borradores de rúbricas, listas de cotejo y bancos de reactivos, así como en los criterios que debes aplicar para revisarlos y alinearlos al currículo antes de llevarlos a tu LMS. Al completarlo, estarás generando evidencia de tu propio criterio profesional en torno al diseño automatizado de instrumentos con IA, mostrando cómo decides qué propuestas del modelo adoptar, cómo las ajustas a tu contexto y cómo garantizas que la evaluación siga siendo válida, confiable y justa para tus estudiantes.
Enlace: 
<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Contenido 3.1: Quiz práctico-LLM" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/69addc9d377503787d4f1379" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>
Referencias
Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). A taxonomy for learning, teaching, and assessing: A revision of Bloom’s Taxonomy of Educational Objectives. New York, NY: Longman.
Hochstetter-Diez, J., Negrier-Seguel, M., Diéguez-Rebolledo, M., Candia-Garrido, E., & Vidal, E. (2025). From Mapping to Action: SmartRubrics, an AI Tool for Competency-Based Assessment in Engineering Education. Sustainability, 17(13), 6098.
Luo, J., Zheng, C., Yin, J., & Teo, H. H. (2025). Design and assessment of AI-based learning tools in higher education: A systematic review. International Journal of Educational Technology in Higher Education, 22(1), 42.
Kolade, O., Owoseni, A., & Egbetokun, A. (2024). Is AI changing learning and assessment as we know it? Evidence from a ChatGPT experiment and a conceptual framework. Heliyon, 10(4).
Kwak, M. (2025). The Effectiveness of AI-Driven Tools in Improving Student Learning Outcomes Compared to Traditional Methods. Issues in Information Systems, 26(4), 233-247.
Webb, N. L. (1997). Criteria for alignment of expectations and assessments in mathematics and science education (Research Monograph No. 6). Washington, DC: Council of Chief State School Officers.
Yan, D., Rupp, A. A., & Foltz, P. W. (Eds.). (2020). Handbook of automated scoring: Theory into practice. CRC Press.
