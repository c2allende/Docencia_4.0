# Nota Técnica v1.8A - Docencia 4.0

**Fecha de cierre:** 28 de abril de 2026  
**Estado:** Completado y Validado en Producción  
**URL Pública:** [https://docencia-4-lms.web.app/](https://docencia-4-lms.web.app/)

## 1. Objetivo de la Fase
Implementar una herramienta administrativa segura para reiniciar el progreso de los participantes módulo a módulo, permitiendo una gestión pedagógica flexible sin pérdida de datos históricos de acceso (visitas y fechas).

## 2. Alcance Técnico
### Archivos Modificados:
- `firestore.rules`: Refinamiento de permisos `get`/`list` y protección de auditoría.
- `scripts/progress-service.js`: Implementación de `resetUserModuleProgress` y `logAdminAction`.
- `scripts/admin-progreso-handler.js`: Integración de la UI de reinicio en el panel administrativo.
- `admin_progreso.html`: Nuevos estilos para acciones de administración y estructura de control.

## 3. Funcionalidades Completadas
- **Reinicio Controlado:** Posibilidad de reiniciar el progreso de los Módulos 1, 2 o 3 de forma independiente.
- **Conservación de Historial:** Se mantienen los contadores de visitas (`visitCount`) y las fechas de apertura (`firstOpenedAt`, `lastOpenedAt`) para análisis posterior.
- **Reinicio Lógico:** No se eliminan documentos físicos; se actualizan los estados a `"started"` (páginas) y `"not_started"` (módulos).
- **Registro de Auditoría:** Cada acción administrativa genera un documento en la colección `adminLogs`.
- **UI Administrativa:** Botones de acción dentro del modal de detalle pedagógico con confirmación de seguridad.

## 4. Seguridad Validada
- **Control de Acceso:** Solo usuarios con `role: "admin"` y `status: "active"` pueden acceder a las herramientas de reinicio.
- **Perímetro Firestore:** Las reglas bloquean el listado de usuarios a participantes y restringen la creación de logs de auditoría únicamente a administradores.
- **Protección de Datos:** Se mantiene el bloqueo global de borrado (`allow delete: if false`).

## 5. Pruebas Realizadas en Producción
- **Usuario de prueba:** `test_participant_reset@docencia.com`
- **Módulo probado:** Módulo 1.
- **Resultado:** El progreso se redujo de **13% a 0%** tras el reinicio.
- **Integridad:** Otros módulos no fueron afectados y el registro en `adminLogs` se creó correctamente.

## 6. Problemas Corregidos
- **SyntaxError en progress-service.js:** Corrección de importaciones de Firestore tras actualización masiva.
- **Visibilidad de Datos:** Ajuste de reglas de seguridad para permitir el listado administrativo de participantes.
- **Falsos Positivos 404:** Resolución de errores de carga derivados de fallos de sintaxis en el cliente.

## 7. Problemas Conocidos
- **Datos Heredados:** Algunos documentos de fases previas pueden mostrar porcentajes atípicos; el sistema sanea estos valores visualmente a 100% durante la carga.
- **Gestión de Huérfanos:** La limpieza física de documentos que no pertenecen a la estructura actual del curso se delega a una fase posterior.

## 8. Próxima Fase Recomendada
- **Fase 1.8B:** Gestión administrativa de datos huérfanos de progreso para optimizar el almacenamiento y la coherencia de Firestore.
