# Nota Técnica — Fase 2.0D-A: Notificaciones de Moderación de Foros

**Fecha de cierre:** 2026-05-01  
**URL oficial:** https://docencia-4-lms.web.app  
**Proyecto:** Docencia 4.0 LMS

---

## Objetivo

Crear notificaciones persistentes cuando un administrador modera (oculta o archiva) una publicación o respuesta de foro, de modo que el autor afectado reciba una notificación visible en su campana del Dashboard.

---

## Archivos Modificados

| Archivo | Descripción del cambio |
| :--- | :--- |
| `scripts/notification-service.js` | Helper `FORO_MAP` + función `createModerationNotification` |
| `scripts/forum-service.js` | Trigger en `moderatePost()` y `moderateReply()` tras `batch.commit()` |

## Archivos NO modificados (protegidos)

✅ `firestore.rules` — Las reglas ya permitían `type:"moderation"` para admin  
✅ `dashboard.html`  
✅ `admin_foros.html`  
✅ `admin_dashboard.html`  
✅ `admin_progreso.html`  
✅ `progress-service.js`  
✅ `announcement-service.js`  
✅ `styles/main.css`  
✅ Páginas de contenido

---

## Funcionalidades Completadas

- **Notificación de publicación moderada:** Se crea al ocultar o archivar una publicación de foro.
- **Notificación de respuesta moderada:** Se crea al ocultar o archivar una respuesta de foro.
- **IDs determinísticos:**
  - `moderation_post_{postId}_hidden`
  - `moderation_post_{postId}_archived`
  - `moderation_reply_{replyId}_hidden`
  - `moderation_reply_{replyId}_archived`
- **Prevención de duplicados:** `getDoc` previo garantiza que si la notificación existe, no se realiza ninguna escritura adicional.
- **No reactivación:** Si ya existe una notificación con el mismo ID, se sale sin modificarla.
- **Integración con campana:** Las notificaciones aparecen con prioridad `"importante"` en la campana del Dashboard del participante.
- **Fallo silencioso:** Si falla la notificación, la moderación ya completada no se revierte. Solo se emite un `console.warn`.
- **Importación dinámica:** Se usa `await import("./notification-service.js")` en `forum-service.js` para evitar dependencias circulares.

---

## Helper de Mapeo de Foros

```javascript
const FORO_MAP = {
    general: { nombre: "Foro General",   url: "foro_general.html" },
    modulo1: { nombre: "Foro Módulo 1",  url: "foro_modulo1.html" },
    modulo2: { nombre: "Foro Módulo 2",  url: "foro_modulo2.html" },
    modulo3: { nombre: "Foro Módulo 3",  url: "foro_modulo3.html" }
};
```

---

## Seguridad

- Solo el admin puede crear notificaciones de tipo `"moderation"` (validado por Firestore Rules existentes).
- El participante **no puede crear** notificaciones de tipo `moderation` manualmente.
- El participante **no puede crear** notificaciones para otro usuario.
- El `delete` físico de notificaciones sigue bloqueado.

---

## QA Realizado

| Prueba | Resultado |
| :--- | :--- |
| Publicación ocultada → notificación `moderation_post_{id}_hidden` | ✅ Superado |
| Publicación archivada → notificación `moderation_post_{id}_archived` | ✅ Superado |
| Respuesta ocultada → notificación `moderation_reply_{id}_hidden` | ✅ Superado |
| Respuesta archivada → notificación `moderation_reply_{id}_archived` | ✅ Superado |
| Prevención de duplicados (misma acción repetida) | ✅ Superado |
| Campana del participante muestra notificación con priority "importante" | ✅ Superado |
| Marcar como leída | ✅ Funciona |
| Archivar notificación | ✅ Funciona |
| Regresión: moderación + adminLogs siguen funcionando | ✅ Sin impacto |
| Regresión: foros, progreso, anuncios, exportación | ✅ Sin impacto |
| Sin errores de consola de aplicación | ✅ Confirmado |

---

## Problemas Conocidos / Limitaciones

- Las notificaciones de moderación **no desaparecen si el admin reactiva** el contenido. En esta fase quedan como historial.
- Si el mismo contenido es ocultado y luego archivado, se crean **dos documentos separados** (comportamiento esperado por diseño del ID determinístico).

---

## Subfase Diferida

**Fase 2.0D-B — Notificaciones de respuestas entre participantes:** Pospuesta. Requiere implementación con Cloud Functions (`onCreate` en `respuestas/`) para garantizar seguridad real sin exponer escrituras cruzadas entre participantes desde el cliente.

---

## Próxima Fase Recomendada

**Fase 2.0E** (o continuar con 2.0D-B via Cloud Functions) según criterio pedagógico del equipo.

---

## Historial de Versiones

| Versión | Fecha | Descripción |
| :--- | :--- | :--- |
| v2.0C | 2026-05-01 | Notificaciones de progreso por módulo completado |
| v2.0D-A | 2026-05-01 | Notificaciones de moderación de foros (admin → participante) |
