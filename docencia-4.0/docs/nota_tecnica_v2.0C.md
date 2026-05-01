# Nota Técnica — Fase 2.0C: Notificaciones de Progreso por Módulo Completado

**Fecha de cierre:** 2026-05-01  
**URL oficial:** https://docencia-4-lms.web.app  
**Proyecto:** Docencia 4.0 LMS

---

## Objetivo

Crear notificaciones persistentes cuando un participante completa un módulo al 100%, conectando el sistema de progreso del LMS con el sistema de notificaciones internas.

---

## Archivos Modificados

| Archivo | Descripción del cambio |
| :--- | :--- |
| `firestore.rules` | Nueva regla de creación de notificaciones para participantes (solo tipo progress, solo propio uid, solo módulos completados) |
| `scripts/notification-service.js` | Nueva función `createProgressCompletionNotification` + importación de `getDoc` |
| `scripts/progress-service.js` | Integración del trigger de notificación en `updateModuleProgress` |

---

## Funcionalidades Completadas

- **Notificación persistente por módulo completado:** Se crea un documento en Firestore cuando el participante alcanza 100% en un módulo.
- **IDs determinísticos:**
  - `progress_module_completed_modulo1`
  - `progress_module_completed_modulo2`
  - `progress_module_completed_modulo3`
- **Prevención de duplicados:** La función verifica con `getDoc` si la notificación ya existe antes de crearla. Si existe, sale sin realizar ninguna escritura.
- **No reactivación tras reinicio:** Si el admin reinicia el progreso de un módulo, la notificación previa permanece como historial. Si el participante vuelve a completar el módulo, no se crea duplicado ni se modifica la notificación existente.
- **Integración con campana de notificaciones:** Las notificaciones de progreso aparecen en la campana del Dashboard al igual que las notificaciones de admin.
- **Validación estricta en Firestore Rules:** La regla valida estructura, valores, pertenencia y estado real del módulo en Firestore antes de permitir la creación.

---

## Seguridad Validada

- El participante **solo puede crear su propia notificación de progreso** (validado con `isOwner(userId)` y que el `notificationId` coincida con el patrón determinístico).
- El participante **no puede crear notificaciones para otro usuario.**
- El participante **no puede crear tipos** `announcement`, `forum`, `moderation` ni `system_alert`.
- El participante **no puede crear una notificación de progreso si el módulo no está al 100%** (validado mediante `get()` al documento `progresoModulos/{moduleId}` en tiempo real).
- El `delete` físico de notificaciones **sigue bloqueado** para todos los roles.

---

## QA Realizado

| Prueba | Resultado |
| :--- | :--- |
| Módulo 1 completado → notificación creada | ✅ Superado |
| Módulo 2 completado → notificación creada | ✅ Superado |
| Módulo 3 completado → notificación creada | ✅ Superado |
| Prevención de duplicados (recarga / recálculo) | ✅ Superado |
| Reinicio de módulo → notificación permanece como historial | ✅ Superado |
| Re-completar módulo → no se crea duplicado ni se reactiva | ✅ Superado |
| Seguridad: notificación para módulo no completado | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: notificación para otro uid | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: tipos no autorizados (announcement, forum...) | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: moduleId != sourceId | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: actionUrl distinto a dashboard.html | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: modificar title/message de notificación | ✅ Bloqueado (PERMISSION_DENIED) |
| Seguridad: borrar notificación | ✅ Bloqueado (PERMISSION_DENIED) |
| Regresión: campana de notificaciones | ✅ Sin impacto |
| Regresión: anuncios virtuales importantes/urgentes | ✅ Sin impacto |
| Regresión: foros | ✅ Sin impacto |
| Regresión: cálculo de progreso | ✅ Sin impacto |
| Regresión: admin crea notificaciones controladas | ✅ Sin impacto |
| Sin errores de consola | ✅ Confirmado |
| Sin errores de permisos inesperados | ✅ Confirmado |

---

## Problemas Conocidos

- Si el admin reinicia el progreso de un módulo, la notificación existente **permanece como historial** y no se elimina automáticamente. Es el comportamiento esperado en esta fase.
- Si el participante vuelve a completar el módulo tras un reinicio, la notificación **no se reactiva ni actualiza**. La reactivación queda fuera del alcance de esta fase.

---

## Próxima Fase Recomendada

**Fase 2.0D — Notificaciones de foros y moderación**

Crear notificaciones cuando:
- Un participante recibe una respuesta en su publicación de foro.
- Una publicación o respuesta es moderada (ocultada/archivada).

---

## Historial de Versiones

| Versión | Fecha | Descripción |
| :--- | :--- | :--- |
| v2.0C | 2026-05-01 | Notificaciones de progreso por módulo completado |
