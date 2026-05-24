# Inventario — Limpieza de Pruebas LMS Docencia 4.0

## 1. Resumen

- **Fecha:** 24 de Mayo de 2026
- **Rama:** main
- **Último commit:** `774c8c7` fix(lms): close panel operativo QA findings
- **Estado inicial de git:** Limpio, con el commit finalizado.

## 2. Colecciones identificadas

| Área | Archivo origen | Colección / ruta Firebase | Tipo de dato | Puede limpiarse | Riesgo |
|---|---|---|---|---|---|
| Board Actividad 1.1 | `interactive-board.js` | `sessions/actividad1_1/responses` | Respuestas interactivas | Sí | Alto (Afecta a todos los que participaron en la Actividad 1.1) |
| Foros | `forum-service.js` | `foros/{foroId}/publicaciones` y `respuestas` | Mensajes de foros dinámicos | No automáticamente | Crítico (Datos reales de la comunidad) |
| Progreso (Páginas) | `progress-service.js` | `usuarios/{uid}/progresoPaginas` | Interacciones | Sí (Por usuario de prueba) | Medio (Local al usuario de prueba) |
| Progreso (Módulos) | `progress-service.js` | `usuarios/{uid}/progresoModulos` | Metadatos de módulo | Sí (Por usuario de prueba) | Medio |
| Anuncios | `announcement-service.js` | `anuncios` | Anuncios institucionales | No automáticamente | Alto (No existe campo `isTest`) |

## 3. Procesos candidatos para limpieza

| Proceso | Acción recomendada | Requiere confirmación | Requiere palabra clave | Estado |
|---|---|---|---|---|
| Board Act 1.1 | Limpiar todos los documentos | Sí | `LIMPIAR` | Aprobado para prototipo |
| Progreso Usuario | Borrar subcolecciones de un UID | Sí | `LIMPIAR` | Aprobado para prototipo (con UID/Email específico) |

## 4. Procesos NO autorizados para limpieza automática

| Proceso | Motivo |
|---|---|
| Foros de módulos y general | Las rutas dinámicas (`foros/{foroId}`) no discriminan publicaciones de prueba de las reales sin un campo de metadatos `isTest`. Se prohíbe el borrado masivo ciego. |
| Anuncios | El esquema actual no incluye el campo `isTest`. Si se ejecuta un borrado, se pueden eliminar anuncios oficiales. |
| Progreso Masivo | Limpiar el progreso de *todos* los usuarios requiere autorización explícita para resetear cohortes completas, no es para uso diario de limpieza de QA. |

## 5. Recomendación

Para el prototipo inicial (`admin_mantenimiento_prototype.html`), implementaremos la limpieza activa para:
1. **Board de la Actividad 1.1**, utilizando borrado masivo sobre `sessions/actividad1_1/responses`.
2. **Progreso LMS**, limitado a un usuario de prueba (solicitando el Email para recuperar el UID y borrar sus subcolecciones).

Para **Anuncios** y **Foros**, los botones se incluirán en el prototipo pero con la función de limpieza bloqueada preventivamente o limitada a reportar el conteo, recomendando en la UI una actualización al esquema (`isTest === true`) antes de proceder con el borrado.
