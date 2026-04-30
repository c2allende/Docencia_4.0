# Nota Técnica - Fase 1.9B: Foro General Dinámico

## Objetivo de la fase
Validación y despliegue del sistema de foros dinámicos en producción (Docencia 4.0), implementando persistencia en tiempo real en Firestore, con énfasis en la paridad funcional, seguridad de datos, y manejo eficiente de estados.

## Arquitectura Firestore de foros
- **Colección `foros`**: Contiene la configuración y estado de los foros (ej. `foros/general`).
- **Subcolección `topics`**: Almacena los temas de discusión dentro de cada foro.
- **Subcolección `replies`**: Almacena las respuestas anidadas a los temas correspondientes.

## Reglas de seguridad implementadas
- Se restringió el acceso de lectura general para cualquier usuario autenticado.
- Las escrituras (creación/edición) están permitidas exclusivamente para usuarios autenticados.
- Se agregaron validaciones rigurosas en la estructura de datos (`title`, `content`, `authorId`, etc.) para proteger la integridad de los documentos.

## Archivos creados
- `docencia-4.0/scripts/forum-service.js`: Capa de servicio encargada de toda la interacción CRUD con Firestore.
- `docencia-4.0/scripts/forum-handler.js`: Lógica de interfaz de usuario (UI), eventos del DOM, y renderizado dinámico del foro.

## Archivos modificados
- `docencia-4.0/foro_general.html`: Integración del nuevo sistema, eliminación de mock-data, carga de scripts modulares y actualización de la UI.
- `firestore.rules`: Expansión de las reglas para incluir y asegurar los paths de `foros`, `topics`, y `replies`.

## Corrección del SDK a versión 10.7.1
- Se normalizaron y corrigieron las importaciones del SDK de Firebase en los scripts para utilizar estrictamente la versión modular `10.7.1`, eliminando conflictos de compatibilidad que impedían el correcto funcionamiento.

## Creación de índices compuestos
- Se definieron y publicaron índices compuestos en Firestore para habilitar consultas ordenadas por fecha (`createdAt` descendente) en las subcolecciones `topics` y `replies`.

## Validación de isActive
- Se estableció y validó la propiedad `isActive: true` en el documento `foros/general` para asegurar su disponibilidad en la plataforma.

## Problemas encontrados durante QA
1. **Conflictos de versión del SDK**: Incompatibilidades entre versiones *compat* y *modulares*, resueltas forzando el uso de `10.7.1`.
2. **Consultas no indexadas**: Errores al ordenar cronológicamente los temas, mitigados mediante la creación de índices compuestos en la consola de Firebase.
3. **Bloqueo por reglas de seguridad**: Reglas iniciales demasiado restrictivas bloqueaban la carga de temas; se ajustaron para permitir acceso seguro a usuarios autenticados.

## Próximos pasos (Fases 1.9C, 1.9D y 1.9E)
- **Fase 1.9C**: Implementar sistema de notificaciones push o in-app para actualizaciones de temas y nuevas respuestas.
- **Fase 1.9D**: Integrar modelo de IA (LLM/Gemini) para análisis de sentimiento, filtrado de toxicidad y respuestas automatizadas.
- **Fase 1.9E**: Optimización de rendimiento, paginación por lotes (infinite scroll) para colecciones extensas y caché.
