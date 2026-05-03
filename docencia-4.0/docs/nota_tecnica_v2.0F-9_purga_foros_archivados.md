# Nota Técnica v2.0F-9: Purga y Gestión de Foros Archivados

## 1. Objetivo
Implementar un sistema de limpieza profunda para los foros dinámicos del LMS Docencia 4.0, permitiendo la eliminación física de registros (posts y respuestas) que han sido previamente archivados por la administración, garantizando la integridad de los hilos activos y manteniendo una auditoría completa de cada operación.

## 2. Archivos Modificados
- `docencia-4.0/admin_foros.html`: Actualización de la interfaz del modal de purga y advertencias de seguridad.
- `docencia-4.0/scripts/admin-foros-handler.js`: Implementación de la lógica de UI para el conteo, preparación y ejecución de la purga.
- `docencia-4.0/scripts/forum-service.js`: Creación de servicios de backend (Firestore) para el procesamiento masivo de datos.

## 3. Reglas Firestore Aplicadas
Se mantienen y validan las reglas de seguridad estrictas en `firestore.rules`:
- **Borrado Físico**: Solo permitido para documentos con `status == "archived"` y bajo rol de `admin`.
- **Integridad**: Los registros con estado `active` o `hidden` están protegidos contra el borrado físico (`allow delete: if false` o condicionado a estado).
- **Auditoría**: El registro en la colección `adminLogs` es obligatorio y debe cumplir con esquemas de campos exactos (9 campos para purga, 12 para moderación).

## 4. Funciones del Servicio (`forum-service.js`)

### `getArchivedForumRecordsCount(filters)`
Calcula de forma asíncrona el volumen de datos procesables.
- **Métricas**: Devuelve `archivedPosts`, `archivedReplies`, `purgablePosts` (sin hijos vivos) y `skippedPosts` (bloqueados por respuestas vivas).
- **Eficiencia**: Optimiza las consultas para evitar lecturas innecesarias de subcolecciones en posts no archivados.

### `archiveLiveRepliesForArchivedPosts(filters, adminInfo)`
Acción de preparación masiva.
- **Propósito**: Convierte respuestas `active` o `hidden` en `archived` si pertenecen a una publicación que ya está archivada.
- **Seguridad**: Solo actualiza campos permitidos por las reglas (`status`, `moderatedAt`, `moderatedBy`).
- **Auditoría**: Genera un log individual por cada respuesta procesada para trazabilidad total.

### `purgeArchivedForumRecords(filters, adminInfo)`
Ejecución del borrado físico.
- **Orden de Operación**: Elimina primero las respuestas archivadas y luego las publicaciones (evita huérfanos).
- **Procesamiento por Lotes**: Utiliza `writeBatch` de Firestore con límites de 450 operaciones para evitar fallos de tiempo de ejecución.
- **Log Final**: Registra una entrada en `adminLogs` con el resumen de la purga masiva.

## 5. Flujos de Trabajo Implementados

### A. Flujo de Transición Estándar
1. `status: hidden` (Oculto por moderación) -> `status: archived` (Acción "Archivar" en panel).
2. `status: archived` -> Ejecución de Purga -> **Borrado Físico**.

### B. Flujo de Resolución de Bloqueos
1. Publicación `archived` detectada con respuestas `active`.
2. El sistema omite la purga del post (Seguridad de integridad).
3. Admin pulsa **"Archivar respuestas asociadas"** en el modal.
4. Las respuestas pasan a `archived`.
5. El sistema habilita la **Purga definitiva** de ambos niveles.

## 6. Auditoría y Logs
Cada purga genera una entrada en `adminLogs` con la siguiente estructura (9 campos):
- `action`: "purge_archived_forum_records"
- `foroId`: ID del foro o "all"
- `archivedPostsDeleted`: Número de posts eliminados.
- `archivedRepliesDeleted`: Número de respuestas eliminadas.
- `skippedPosts`: Número de posts conservados por seguridad.
- `performedBy`: UID del administrador.
- `performedByEmail`: Email del administrador.
- `createdAt`: Timestamp del servidor.
- `note`: Resumen textual de la operación.

## 7. Validación de QA Realizada
- **Caso Positivo**: Eliminación exitosa de posts y respuestas archivadas sin hijos vivos.
- **Caso de Seguridad**: Verificación de que el sistema **no permite** borrar posts archivados si contienen al menos una respuesta activa.
- **Caso de Error**: Validación de que el botón de acción se restablece correctamente (`finally` block) ante fallos de red o permisos.
- **Regresión**: Confirmación de que las funciones de exportación CSV y moderación individual siguen operativas.

## 8. Limitaciones y Recomendaciones
- **Limitación**: El proceso de preparación (archivo de respuestas) requiere que el post padre ya esté archivado. No se permite el archivo masivo de respuestas bajo posts activos.
- **Recomendación**: Se recomienda realizar una exportación de datos (`Exportar Datos` -> CSV) antes de ejecutar purgas masivas para conservar evidencia histórica fuera de la base de datos de producción.
- **Futuro**: Evaluar el uso de Cloud Functions para purgas de muy gran volumen si las colecciones superan los miles de registros, para evitar tiempos de espera excesivos en el cliente.

---
**Fecha**: 2026-05-03
**Estado**: Implementado y Validado
**Autor**: Antigravity AI Assistant
