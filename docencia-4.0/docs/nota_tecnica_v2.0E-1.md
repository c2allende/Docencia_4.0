# Nota Técnica — Fase 2.0E-1: Campana Administrativa de Notificaciones

**Fecha de cierre:** 2026-05-02  
**URL oficial:** https://docencia-4-lms.web.app  
**Proyecto:** Docencia 4.0 LMS

---

## Objetivo

Implementar la infraestructura de interfaz de usuario (UI) para notificaciones administrativas en el Centro de Control (`admin_dashboard.html`), reutilizando la lógica existente del servicio de notificaciones para permitir a los administradores visualizar eventos operativos.

---

## Archivos Modificados

| Archivo | Descripción del cambio |
| :--- | :--- |
| `admin_dashboard.html` | Inserción de campana (🔔), dropdown con prefijo `notification-admin-`, estilos locales y lógica de suscripción. |

## Archivos NO modificados (protegidos)

✅ `firestore.rules` — No se requirieron cambios en las reglas de seguridad.  
✅ `scripts/notification-service.js` — Se reutilizaron las funciones de forma externa.  
✅ `dashboard.html` — Sin impacto en la vista del participante.  
✅ `styles/main.css` — Estilos implementados localmente en el archivo HTML.  
✅ `progress-service.js`, `forum-service.js`, `announcement-service.js`.

---

## Funcionalidades Completadas

- **Campana Administrativa:** Ubicada en la barra de navegación superior de `admin_dashboard.html`.
- **Badge Dinámico:** Muestra el conteo de notificaciones no leídas en tiempo real.
- **Dropdown Operativo:** Muestra las últimas 5 notificaciones recientes.
- **Acciones Rápidas:**
  - **Marcar como leída:** Actualiza el estado a `read` y oculta el badge.
  - **Archivar:** Actualiza el estado a `archived` y remueve la notificación de la lista.
- **Soporte para `actionUrl`:** Permite navegar a la sección relevante si la notificación lo incluye.
- **Estado Vacío:** Mensaje amigable cuando no hay notificaciones recientes.
- **Estilos Scoped:** Uso del prefijo `notification-admin-` para evitar colisiones con otros estilos globales.

---

## Funciones Reutilizadas de `notification-service.js`

```javascript
import { 
    subscribeToUnreadNotifications, 
    subscribeToRecentNotifications, 
    markNotificationAsRead, 
    archiveNotification 
} from './scripts/notification-service.js';
```

---

## Seguridad

- **Acceso Restringido:** El administrador solo lee sus propias notificaciones en `usuarios/{adminUid}/notificaciones/`.
- **Protección de Ruta:** `admin-guard.js` asegura que solo administradores autenticados vean el dashboard.
- **Reglas Firestore:** Se mantiene `isOwner(userId)` para la lectura de la subcolección, lo que garantiza privacidad total.
- **Escapado de HTML:** Los títulos y mensajes se escapan para prevenir ataques XSS.

---

## QA Realizado

| Prueba | Resultado |
| :--- | :--- |
| Notificación manual en Firestore → Aparición del badge | ✅ Superado (Producción) |
| Clic en campana → Despliegue de dropdown con datos correctos | ✅ Superado (Producción) |
| Marcar como leída → Cambio de status y badge | ✅ Superado (Producción) |
| Archivar → Desaparición de la lista reciente | ✅ Superado (Producción) |
| Regresión: Dashboard participante sigue intacto | ✅ Sin impacto |
| Regresión: Otros paneles admin cargan correctamente | ✅ Sin impacto |
| Seguridad: Acceso de participante bloqueado | ✅ Confirmado |

---

## Limitaciones y Notas de Implementación

- **Sin Triggers Automáticos:** En esta subfase (2.0E-1), las notificaciones deben ser creadas manualmente o por lógica de backend. No se han conectado todavía los eventos de finalización de módulos o actividad en foros.
- **Un solo panel:** La campana solo está disponible en el Dashboard principal administrativo. Otros paneles (foros, progreso) se integrarán en fases futuras si es necesario.

---

## Próxima Fase Recomendada

**Fase 2.0E-2 — Triggers de Backend para Eventos Operativos:** Implementar las llamadas a `notifyAdmins` (pendiente de creación) desde los servicios de progreso y foros para automatizar el flujo.

---

## Historial de Versiones

| Versión | Fecha | Descripción |
| :--- | :--- | :--- |
| v2.0D-A | 2026-05-01 | Notificaciones de moderación de foros (admin → participante) |
| v2.0E-1 | 2026-05-02 | Infraestructura de campana administrativa (admin UI) |
