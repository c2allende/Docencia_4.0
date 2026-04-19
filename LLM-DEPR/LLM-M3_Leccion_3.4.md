Lección 3.4: Seguridad de datos en tareas administrativas
Lista de verificación ética: Protocolo de anonimización
El uso de IA en la generación de documentos administrativos y evaluativos exige una atención rigurosa a la protección de datos personales de estudiantes, familias y colegas. Aunque muchas investigaciones se centran en la precisión y utilidad de las herramientas de IA para aprendizaje y evaluación, autores como Kolade et al. (2024) subrayan que cualquier integración significativa de IA en procesos evaluativos debe acompañarse de marcos claros sobre ética, transparencia y manejo responsable de información (Kolade et al., 2024). La Ley de Derechos Educativos y Privacidad de la Familia (FERPA) en Estados Unidos, aplicable a Puerto Rico, protege los registros educativos de los estudiantes y prohíbe la divulgación de información personal identificable sin consentimiento. En este contexto, es clave distinguir entre el modelo de lenguaje (LLM) como tecnología base y las aplicaciones o bots que lo integran, pues la responsabilidad de proteger datos recae tanto en la configuración del servicio como en las prácticas del usuario.
Información Personal Identificable (PII) que NUNCA debe ingresarse en LLMs:
1.	Nombres completos de estudiantes, familias o colegas
2.	Números de identificación: SIE (Sistema de Información Estudiantil), seguro social, números de caso
3.	Direcciones: Residenciales, postales, correos electrónicos personales
4.	Información médica: Diagnósticos, medicamentos, condiciones de salud
5.	Fotografías o grabaciones de audio/video identificables
6.	Datos biométricos: Huellas, reconocimiento facial
7.	Información financiera: Ingresos familiares, situaciones económicas específicas
8.	Información legal: Casos de custodia, órdenes de protección, situaciones judiciales
 
Imagen: M3_LLM_PII_no ingresas LLM_imagen
Protocolo de anonimización (ANTES de usar IA):
Paso 1: Identificar datos sensibles en el documento
Revisar el texto completo y marcar todo dato que pueda identificar a una persona
Paso 2: Reemplazar sistemáticamente
•	Nombres → "Estudiante A", "Familia 1", "Colega X"
•	SIE/ID → Eliminar completamente o usar "ID-###"
•	Escuela específica → "Escuela primaria pública"
•	Direcciones → "Comunidad urbana", "área rural"
•	Diagnósticos → Descripción general "dificultades de aprendizaje", "necesidades especiales"
Paso 3: Revisar contexto
Asegurar que la combinación de datos anónimos no permita identificación indirecta
Paso 4: Verificar antes de pegar
Hacer una última revisión completa antes de ingresar el texto en el LLM
Ejemplo de anonimización:
ANTES (CON PII - NO USAR):
María González Ortiz (SIE: 123456789), estudiante de 4to grado en la Escuela Juan Ponce de León de Bayamón, vive en Calle Los Pinos #45 con su abuela. Tiene diagnóstico de TDAH y toma Ritalin 10mg. Su madre está en prisión federal.
DESPUÉS (ANONIMIZADO - SEGURO PARA IA):
Estudiante A, 4to grado en escuela pública urbana, vive con familiar extendido. Presenta necesidades de atención y concentración que requieren acomodaciones educativas. Situación familiar compleja que afecta estabilidad emocional.
Riesgos habituales y prácticas seguras mínimas
La literatura sobre sistemas de evaluación automatizada y análisis de datos educativos advierte que la acumulación de información sensible en plataformas digitales sin protocolos claros aumenta el riesgo de filtraciones, usos secundarios no autorizados o interpretaciones erróneas (Yan et al., 2020). En el caso de herramientas generativas, algunos riesgos concretos son:
1.	Copiar/pegar descuidado: Transferir documentos completos sin revisar datos sensibles
2.	Capturas de pantalla: Compartir imágenes que contienen información en los bordes o fondos
3.	Historial de conversaciones: Los LLMs almacenan conversaciones; datos sensibles quedan en servidores
4.	Uso de cuentas compartidas: Otros usuarios podrían acceder al historial
5.	Exportación de resultados: Documentos generados por IA podrían contener metadata con PII original
Prácticas seguras mínimas:
1.	Usar cuentas institucionales cuando sea posible:
Algunas instituciones tienen acuerdos con proveedores de IA que incluyen protecciones adicionales de datos
2.	Desactivar historial de conversaciones:
En ChatGPT: Settings → Data Controls → Chat History & Training (desactivar)
Esto evita que las conversaciones se almacenen o se usen para entrenar modelos
3.	Trabajar en sesiones temporales:
Usar modo incógnito o eliminar conversaciones inmediatamente después de usarlas
4.	No usar IA para decisiones finales sobre estudiantes:
La IA puede sugerir lenguaje o estructura, pero el maestro toma las decisiones sobre contenido, especialmente en documentos legales como PIE
5.	Verificar políticas institucionales:
Consultar con el distrito escolar o departamento de tecnología sobre políticas específicas de uso de IA
6.	Documentar el proceso:
Mantener registro de qué herramientas de IA se usaron, para qué propósito y cómo se anonimizó la información
7.	Educar a colegas:
Compartir estas prácticas con otros maestros para crear cultura de uso seguro
 
M3_LLM_practicas minimas_imagen
Marco conceptual de seguridad (adaptado de principios FERPA):
Antes de usar IA, pregúntate:
•	¿Este texto contiene información que permita identificar a un estudiante específico?
•	¿Usaría este mismo texto en una conversación pública sin preocuparme?
•	¿He eliminado TODOS los identificadores directos e indirectos?
•	¿La herramienta que voy a usar tiene protecciones de privacidad activadas?
•	¿Existe algún riesgo de que esta información se vincule con otros datos?
Si respondes "NO" a cualquiera de las primeras 4 preguntas, o "SÍ" a la última: NO uses IA hasta anonimizar completamente.
Conceptos a repasar
Lista de verificación ética: Protocolo de anonimización
La lista de verificación ética: Protocolo de anonimización es un conjunto estructurado de pasos y criterios que guía al personal educativo para eliminar o transformar toda información personal identificable antes de introducir textos en sistemas de IA, en particular en modelos de lenguaje grandes (LLM) o en bots y aplicaciones que los integran. Técnicamente, este protocolo define qué datos deben considerarse identificadores directos o indirectos (por ejemplo, nombres, códigos de estudiante, direcciones, diagnósticos, detalles familiares), y establece procedimientos sistemáticos de supresión, sustitución por pseudónimos y revisión de contexto para reducir el riesgo de reidentificación, de forma coherente con marcos legales como FERPA y con las buenas prácticas generales de anonimización de datos.

Introducción a la anonimización de datos: técnicas y casos prácticos | datos.gob.es. (2024). Introducción a La Anonimización De Datos: Técnicas Y Casos Prácticos | datos.gob.es. https://datos.gob.es/es/conocimiento/introduccion-la-anonimizacion-de-datos-tecnicas-y-casos-practicos

Agencia Española de Protección de Datos. (2014). Guía básica de anonimización. AEPD. https://www.aepd.es/documento/guia-basica-anonimizacion.pdf
Marco conceptual de seguridad (adaptado de principios FERPA)
El marco conceptual de seguridad (adaptado de principios FERPA) es un conjunto de criterios y preguntas guía que orienta a las instituciones y al personal educativo en cómo recoger, almacenar, procesar y compartir datos de estudiantes de forma compatible con la Ley de Derechos Educativos y Privacidad de la Familia (FERPA), incluyendo su uso en sistemas de IA y modelos de lenguaje grandes (LLM). Técnicamente, traduce los principios legales de FERPA (confidencialidad de los expedientes educativos, control de acceso, consentimiento informado y registro de divulgaciones) en decisiones operativas concretas: limitar el envío de información personal identificable a servicios externos, exigir controles de acceso y cifrado en plataformas que integran LLM, minimizar los datos compartidos y exigir contratos y políticas claras cuando se usan herramientas de terceros para apoyar la evaluación, la comunicación o la analítica educativa.

U.S. Department of Education. (2011). FERPA general guidance for students and parents. Student Privacy Policy Office. https://studentprivacy.ed.gov/ferpa

Cierre de la lección
Felicidades
Has culminado la lección 3.4 del programa de formación profesional.
Al completar el contenido 3.4, diste un paso fundamental para un uso responsable de la IA en la escuela: ahora distingues claramente qué es PII, cómo anonimizar textos antes de trabajarlos con un modelo de lenguaje y qué prácticas mínimas debes aplicar para proteger a estudiantes, familias y colegas. Esta conciencia fortalece tu rol profesional, porque te permite aprovechar las ventajas de la automatización sin comprometer la confidencialidad ni el cumplimiento de FERPA y de las normas del DEPR.
Invitación al checkpoint de saberes
Para cerrar este bloque, te invitamos a realizar el Checkpoint de Saberes 3.4, una evaluación formativa breve y no punitiva centrada en el reconocimiento de datos personales identificables (PII), el uso correcto del protocolo de anonimización y las prácticas básicas de seguridad cuando se emplea IA en tareas administrativas y evaluativas. Al completarlo, estarás generando evidencia de tu propio criterio profesional en torno a la protección de datos al trabajar con modelos de lenguaje, mostrando cómo decides qué información puede pasar por la IA, qué debes anonimizar primero y qué límites estableces para resguardar la privacidad y los derechos de tu comunidad escolar.
Enlace: 
<div style="width: 100%;"><div style="position: relative; padding-bottom: 56.25%; padding-top: 0; height: 0;"><iframe title="Contenido 3.4: Quiz práctico-LLM" frameborder="0" width="1200" height="675" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://view.genially.com/69ade5ab9abf43c2f0514822" type="text/html" allowscriptaccess="always" allowfullscreen="true" scrolling="yes" allownetworking="all"></iframe> </div> </div>
Referencias
Kolade, O., Owoseni, A., & Egbetokun, A. (2024). Is AI changing learning and assessment as we know it? Evidence from a ChatGPT experiment and a conceptual framework. Heliyon, 10(4).
U.S. Department of Education. (n.d.). Family Educational Rights and Privacy Act (FERPA). Retrieved from https://www2.ed.gov/policy/gen/guid/fpco/ferpa
Yan, D., Rupp, A. A., & Foltz, P. W. (Eds.). (2020). Handbook of automated scoring: Theory into practice. CRC Press.
