Lección 1.1: Conceptualización y panorama tecnológico
¿Qué es un Modelo de Lenguaje de Gran Tamaño (LLM)? 
Un Modelo de Lenguaje de Gran Tamaño es un sistema de inteligencia artificial entrenado con enormes cantidades de texto para predecir la siguiente palabra más probable en una secuencia (Zhao et al., 2023). Para lograrlo, estos modelos utilizan la arquitectura Transformer, que permite analizar relaciones entre palabras en distintos puntos de una oración o un texto extenso, capturando tanto significado como contexto. 
Desde la perspectiva de la inteligencia artificial, los LLM se sitúan dentro de la IA generativa y del aprendizaje profundo: utilizan técnicas de Deep Learning para realizar tareas de procesamiento del lenguaje natural, como clasificación, resumen y generación de textos, ampliando de forma notable la capacidad de los sistemas para trabajar con lenguaje humano en múltiples idiomas y temas (Oyarzo Espinosa & Usero Aragonés, 2024). 
![Ubicación de los LLM en la IA][LLM_M1_Ilustración_1.1_Ubicación_LLM_imagen.png]

Durante el entrenamiento, el modelo ve millones de ejemplos de lenguaje y ajusta sus parámetros internos para minimizar el error en la predicción de las próximas palabras; al finalizar, puede generar respuestas coherentes, redactar textos, resumir, traducir y responder preguntas a partir de instrucciones en lenguaje natural (Zhao et al., 2023). Esta lógica de “predicción probabilística” explica por qué los LLM a veces “alucinan”: cuando no tienen suficiente base factual o el prompt es ambiguo, el modelo sigue produciendo la palabra “más probable” según sus estadísticas, aunque el contenido no sea verdadero (Russell & Norvig, 2020). 
En términos de funcionamiento interno, los LLM descomponen la entrada en unidades más pequeñas llamadas tokens (fragmentos de palabras, palabras completas o grupos de palabras), que son procesados por la red neuronal para calcular la probabilidad de cada token siguiente. Este proceso de tokenización permite manejar textos extensos, adaptarse a distintos idiomas y generar respuestas continuas, lo que explica su capacidad para sostener “conversaciones” o redactar textos largos en el ámbito académico (Oyarzo Espinosa & Usero Aragonés, 2024). 
![Tokenización][LLM_M1_Ilustración_1.1_Tokenización_imagen.png]
 
En educación, esta capacidad de generar texto permite que el LLM funcione como “motor de lenguaje” que impulsa distintas aplicaciones, capaz de: 
•	proponer actividades y materiales, 
•	sugerir explicaciones alternativas, 
•	redactar borradores de retroalimentación, 
siempre bajo la revisión crítica del docente (Damiano et al., 2024). 
Además, los LLM se usan para automatizar tareas repetitivas (corrección preliminar, elaboración de planes de aprendizaje, generación de preguntas evaluativas) y ofrecer apoyo en investigación mediante resúmenes y sugerencias de fuentes, lo que puede optimizar el tiempo del profesorado (Oyarzo Espinosa & Usero Aragonés, 2024). 
 
La evolución de los modelos de lenguaje
La evolución de la inteligencia artificial aplicada al lenguaje ha transformado radicalmente la forma en que las máquinas procesan la información, pasando de sistemas rígidos a modelos con capacidades de razonamiento casi humano. Este recorrido histórico se puede sintetizar en cuatro grandes etapas:
•	Modelos Basados en Reglas (Pre-1990): Definidos por la IA Simbólica, dependían de reglas manuales y estructuras frágiles como las de ELIZA o SHRDLU.
•	Modelos Estadísticos (1990 - 2000s): Introdujeron el aprendizaje basado en datos mediante n-gramas y modelos probabilísticos, permitiendo una mayor flexibilidad.
•	Modelos de Lenguaje Neuronales (2000s - 2017): El auge del Deep Learning y el uso de vectores permitió capturar relaciones semánticas profundas a través de arquitecturas como LSTM y GRU.
•	La Era de los Transformers y LLMs (2017 - Presente): Iniciada por el mecanismo de "Atención", esta fase marca el punto de inflexión con la democratización de ChatGPT en 2022, el surgimiento del razonamiento de "Sistema 2" en 2024 y la consolidación de modelos de pesos abiertos de alta calidad en 2025.
![Evolución de los LLM][LLM_M1_Contenido_1.1_Evolucion_LLM_imagen.png]

LLM vs. buscador tradicional: ¿cuándo usar cuál? 
Es importante que el docente distinga entre LLM, bot y buscador, ya que cumplen roles distintos y se complementan. Un LLM es el “cerebro de lenguaje”, el bot es la aplicación que usa ese “cerebro” para interactuar con el usuario, y el buscador es el “localizador de fuentes en la web”. En otras palabras, debe diferenciar entre el LLM como tecnología subyacente, las aplicaciones que lo utilizan y los buscadores tradicionales que ofrecen acceso directo a las fuentes de información. 


¿Qué es cada uno? 
•	LLM 
Modelo de IA que genera texto a partir de instrucciones, pero no es, por sí mismo, una app de uso docente; es la tecnología base. 
•	Bot o app con LLM 
Recurso tecnológico concreto (ChatGPT, Copilot, un asistente en un LMS) que usa un LLM y añade interfaz, configuraciones, accesos a datos y reglas de uso. 
•	Buscador tradicional 
Servicio que indexa la web y responde con enlaces (Google, Bing, Perplexity, motores académicos), mostrando fuentes, fechas y procedencia. 
¿Cuándo usar el LLM (como capacidad)? 
En la práctica, el docente no “usa el LLM puro”, sino su capacidad dentro de una app, cuando necesita: 
•	Generar borradores de textos: cartas a familias, rúbricas, instrucciones, descripciones de actividades. 
•	Reformular o adaptar: simplificar un texto, ajustar a distintos niveles de lectura, traducir con matiz pedagógico. 
•	Crear ideas y variaciones: ejemplos, preguntas, casos, explicaciones alternativas. 
Aquí lo clave es ver el LLM como motor generador de lenguaje que se usa para producir y transformar texto, siempre con revisión crítica. 
¿Cuándo usar un bot o app con LLM? 
Se recurre a un bot o app con LLM cuando, además de generar texto, necesitas un contexto y unas funciones concretas: 
•	Un bot conversacional (como ChatGPT) 
•	Explorar ideas en diálogo, pedir aclaraciones, iterar una planificación. 
•	Probar prompts, diseñar actividades, cocrear materiales fuera del entorno institucional. 
•	Un asistente integrado (como Copilot en Word, PowerPoint, LMS, etc.) 
•	Trabajar directamente sobre tus documentos: resumir actas, crear borradores de informes, extraer listas de tareas. 
•	Generar presentaciones, esquemas o tablas usando archivos y datos que ya tienes en la plataforma. 
En resumen: usas el bot cuando necesitas una herramienta concreta, con interfaz y funciones específicas, que aplica la capacidad del LLM a tu contexto real de trabajo. 
¿Cuándo usar un buscador tradicional? 
El buscador sigue siendo insustituible cuando lo importante es la fuente: 
•	Buscar información actualizada (fechas, estadísticas recientes, cambios de currículo, normativa vigente). 
•	Localizar y citar fuentes primarias (artículos científicos, documentos oficiales, comunicados de agencia). 
•	Verificar datos que el bot/LLM ha generado o sospechas que pueden estar desactualizados o ser erróneos. 
Aquí el foco no es que alguien “escriba por ti”, sino encontrar quién lo dijo, cuándo y dónde. 
La literatura reciente subraya que, en contextos educativos, la combinación de estos enfoques, primero localizar fuentes confiables y luego usar aplicaciones basadas en LLM para ayudar a sintetizar, adaptar o explicar, ofrece más precisión y control pedagógico. 
Desde esta perspectiva, una regla práctica para docentes puede formularse así: 
•	Si necesitas información comprobable y citada → empieza por el buscador. 
•	Si necesitas texto, ideas o adaptaciones a partir de esa información → usa un bot/app con LLM. 
•	Si quieres entender la tecnología y sus límites, enseñar su funcionamiento o decidir qué recurso tecnológico adoptar → piensa en el LLM como el “motor” que está detrás y en cómo se integra en las aplicaciones que tus estudiantes y tú ya usan. 
![LLM (BOT) VS Buscador Tradicional][LLM_M1_LLM_VS_BOT_imagen.png]
Ecosistema actual: ChatGPT y Microsoft Copilot 
El ecosistema de LLM es dinámico; sin embargo, dos herramientas son especialmente relevantes para docentes por su presencia en entornos educativos y administrativos: bots conversacionales generales y asistentes integrados en suites de productividad. 
•	ChatGPT (OpenAI): Funciona como asistente conversacional general (bot) construido sobre LLM de la familia GPT, capaz de generar textos, actividades, ejemplos y explicaciones sobre una amplia variedad de temas (Zhao et al., 2023). En sus versiones más recientes, el plan gratuito de ChatGPT ofrece acceso a modelos de la familia GPT4o como modelo por defecto, con ciertas limitaciones de uso, es decir, a un LLM multimodal capaz de trabajar con texto, imágenes y archivos, diseñado para equilibrar velocidad y calidad en tareas generales de asistencia (OpenAI, 2024). Estudios en educación superior muestran que docentes y estudiantes lo usan para apoyo en redacción, generación de ideas y revisión de comprensión, aunque se señalan riesgos de dependencia y de errores factuales (Damiano et al., 2024). 
•	Microsoft Copilot (integrado en Microsoft 365): Es un asistente basado en LLM que se conecta con documentos, correos y archivos del entorno institucional (Word, PowerPoint, Excel, Outlook), lo que lo hace especialmente útil para automatizar informes, minutas, borradores de planes y presentaciones. En la actualidad, Microsoft 365 Copilot orquesta varios modelos de lenguaje grande, incluyendo versiones avanzadas de la familia GPT (como GPT4 y GPT5), a través de una capa de orquestación que decide qué modelo usar según la tarea y el contexto de los datos institucionales. Desde la perspectiva de gestión educativa, permite transformar datos y borradores existentes en resúmenes, listas de acciones, tablas y comunicados, lo que puede reducir carga administrativa si el docente mantiene el control y revisa los resultados (Valli & Zafiropoulos, 2024). 
Para los maestros y maestras, la diferencia práctica es que ChatGPT se utiliza principalmente como “espacio neutro” de experimentación y diseño textual, mientras que Copilot se integra en el flujo real de trabajo institucional, sobre todo en escuelas que ya usan Microsoft 365 como plataforma base. 
Conceptos a repasar
Modelo de Lenguaje de Gran Tamaño (LLM)
Un Modelo de Lenguaje de Gran Tamaño (LLM) es un modelo de inteligencia artificial basado en aprendizaje profundo que se preentrena con enormes volúmenes de texto para comprender y generar lenguaje natural, utilizando arquitecturas tipo Transformer con miles de millones de parámetros. Estos modelos aprenden patrones estadísticos de sintaxis y semántica para realizar tareas como generación de texto, resumen, traducción, respuesta a preguntas y diálogo conversacional, constituyendo la base técnica de muchos chatbots y asistentes educativos actuales.
Amazon Web Services. (2026). ¿Qué es un LLM (modelo de lenguaje de gran tamaño)? AWS. https://aws.amazon.com/es/what-is/large-language-model/
Bot o aplicación basada en LLM
Bot o aplicación basada en LLM es un programa o servicio que integra un modelo de lenguaje de gran tamaño como componente central para procesar entradas en lenguaje natural y generar respuestas, contenidos o asistencia contextual a usuarios finales. A diferencia del LLM “en bruto”, estas aplicaciones añaden capa de interfaz (chat, panel, integración en LMS u ofimática), reglas de uso, controles de seguridad y conexión a datos específicos (por ejemplo, documentos institucionales), lo que las hace utilizables pedagógicamente como asistentes de escritura, tutores virtuales o generadores de materiales en contextos educativos.
Product Talk. (2025). LLM app: Definition and overview. https://www.producttalk.org/glossary-ai-llm-app/
Buscador tradicional
Buscador tradicional (motor de búsqueda web) es un sistema de software que explora, indexa y clasifica contenido en la web y, ante una consulta del usuario, devuelve una lista ordenada de páginas o documentos relevantes, generalmente en forma de enlaces acompañados de fragmentos de texto descriptivo. Técnicamente, combina procesos de rastreo (crawling), indexación y ranking basados en algoritmos de recuperación de información para localizar fuentes primarias; en educación se utiliza para encontrar información actualizada, documentos oficiales y literatura académica que luego pueden ser analizados, resumidos o adaptados con ayuda de LLM y bots.
TechTarget. (2022). What is a search engine? TechTarget. https://www.techtarget.com/whatis/definition/search-engine
Chain of Thought (CoT)
Chain of Thought (CoT) es una técnica de ingeniería de prompts que guía a los modelos de lenguaje a producir una secuencia explícita de pasos de razonamiento intermedios antes de dar la respuesta final, en lugar de responder directamente en una sola frase. Al pedir al modelo que “explique su respuesta paso a paso”, CoT ayuda a descomponer problemas multietapa (cálculo, lógica, decisiones) en subpasos lógicos, lo que mejora la exactitud en tareas complejas y hace el proceso más transparente y evaluable para docentes y estudiantes.
TechTarget. (2025). What is chain-of-thought prompting (CoT)? TechTarget. https://www.techtarget.com/searchenterpriseai/definition/chain-of-thought-prompting
Andamiaje (scaffolding) con LLM
Andamiaje (scaffolding) con LLM es el uso de un modelo de lenguaje grande y de los bots que lo incorporan para proporcionar apoyos temporales y graduados (explicaciones, ejemplos, descomposición de tareas, preguntas guiadas) que ayudan al estudiante a realizar actividades que aún no podría completar de manera independiente, dentro de su Zona de Desarrollo Próximo, retirando esos apoyos a medida que aumenta su dominio. En la práctica educativa, el LLM funciona como un “andamio digital” que el docente configura mediante prompts (por ejemplo, pedir pasos intermedios o pistas en lugar de respuestas finales) para reforzar la comprensión y promover la autonomía, sin sustituir la mediación pedagógica human.
The Glossary of Education Reform. (2015). Scaffolding. Great Schools Partnership. https://www.edglossary.org/scaffolding/
Cierre de la lección
Felicidades
Has culminado la lección 1.1 del programa de formación profesional.
Has dado un paso clave al comprender qué es un LLM, cómo funciona como motor de lenguaje y cuándo conviene usarlo frente a un buscador tradicional. Este conocimiento te coloca en una posición estratégica para tomar decisiones pedagógicas más informadas y éticas sobre el uso de IA en tu práctica docente, manteniendo siempre tu criterio profesional en el centro.
Invitación al checkpoint de saberes
Para cerrar este bloque, te invitamos a realizar el Checkpoint de Saberes, una evaluación formativa breve y no punitiva diseñada para ayudarte a responder a dos preguntas clave: ¿qué entendí? y ¿qué necesito reforzar?, de modo que puedas clarificar tus ideas sobre LLM, bots y buscadores y orientar tus siguientes pasos de aprendizaje con enfoque de mejora continua.
Enlace: 
<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Contenido 1.1: Quiz práctico-LLM" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/69adb05030c4d6416b2c3cb5" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>
Referencias
Damiano, R. F., et al. (2024). Early perceptions of teaching and learning using generative AI in higher education. Computers & Education: Artificial Intelligence, 100157.
Hargreaves, A., & Fullan, M. (2012). Professional capital: Transforming teaching in every school. Teachers College Press.
Im, E., & Chee, W. (2012). Methodological issues in the recruitment of ethnic minority subjects to research via the Internet: A discussion paper. International Journal of Nursing Studies, 49(1), 99–106.
Oyarzo Espinosa, J., & Usero Aragonés, L. (2024). Grandes modelos lingüísticos. In J. Oyarzo Espinosa, L. Usero Aragonés, & Francisco Javier Bueno Guillén (Eds.), Guía Práctica (2a edición). https://proyectodescartes.org/escenas-aux/IABoletin8/interactivos/libro/libro.pdf
Russell, S. J., & Norvig, P. (2020). Artificial intelligence: A modern approach (4th ed.). Pearson.
Valli, P., & Zafiropoulos, K. (2024). Factors that affect the acceptance of educational AI tools by teachers. Education and Information Technologies, 29, 123–145.
Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., ... & Wen, J. R. (2023). A survey of large language models. arXiv preprint arXiv:2303.18223.
