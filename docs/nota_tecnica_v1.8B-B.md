# Nota Técnica: Fase 1.8B-B (Archivado Lógico de Datos Huérfanos)

**Fecha de cierre:** 29 de abril de 2026  
**URL oficial:** [https://docencia-4-lms.web.app](https://docencia-4-lms.web.app)  

## Objetivo de la fase
Implementar archivado lógico controlado de datos huérfanos de progreso detectados, permitiendo una limpieza segura del panel administrativo sin requerir eliminación física y manteniendo un registro de auditoría.

## Archivos modificados
- `firestore.rules`
- `docencia-4.0/scripts/progress-service.js`
- `docencia-4.0/scripts/admin-progreso-handler.js`

## Funcionalidades completadas
- **Botón “Archivar”:** Disponible en el modal del administrador para documentos huérfanos activos.
- **Confirmación fuerte:** Implementación de un diálogo preventivo antes de ejecutar cualquier archivado.
- **Archivado lógico:** El proceso inyecta campos de control sin causar eliminación física de los registros.
- **Inclusión de campos de auditoría:**
  - `archived`: true
  - `archivedAt`: timestamp del servidor
  - `archivedBy`: UID del administrador
  - `archiveReason`: razón del hallazgo original
  - `updatedAt`: timestamp del servidor
- **Visualización histórica:** Inclusión de filtro “Mostrar archivados” para revelar el historial.
- **Indicadores visuales:** Badge “ARCHIVADO” y atenuación de opacidad para identificar documentos inactivos.
- **Registro de auditoría:** Creación automatizada en la colección `adminLogs`.

## Seguridad validada
- **Acceso exclusivo:** Solo cuentas con `role: "admin"` y `status: "active"` pueden archivar.
- **Protección del panel:** Los participantes no pueden acceder a `admin_progreso.html` ni ejecutar funciones administrativas por consola.
- **Auditoría inquebrantable:** Los participantes no tienen permisos de escritura sobre `adminLogs`.
- **Integridad de base de datos:** El Delete físico (`allow delete: if false`) sigue bloqueado globalmente en Firestore.
- **Convivencia de reglas:** Se comprobó que Firestore Rules separan correctamente el reinicio 1.8A y el archivado 1.8B-B mediante el uso de `affectedKeys().hasOnly()`.

## Pruebas realizadas
- [x] QA en canal de vista previa (`qa-archiving`).
- [x] QA manual directamente en producción.
- [x] Documento huérfano archivado correctamente en base de datos.
- [x] Documento verificado como NO eliminado.
- [x] `adminLogs` creado exitosamente con `action: "archive_orphan_progress"`.
- [x] El progreso oficial y estadísticas de los módulos no se vieron afectados.
- [x] Reinicio controlado de progreso (Fase 1.8A) validado como plenamente funcional tras la actualización de las reglas.

## Problemas conocidos
- Los documentos huérfanos archivados permanecen estructuralmente en Firestore, lo que asegura la trazabilidad, pero consumen espacio lógico.
- La eliminación física de documentos erróneos no está habilitada.
- No existe una función automatizada de "restauración" desde la UI para documentos archivados por error.

## Próxima fase recomendada
**Fase 1.9A** — Plan técnico de foros dinámicos con Firestore.
