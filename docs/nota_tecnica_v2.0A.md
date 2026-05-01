# Nota Técnica - Fase 2.0A: Infraestructura Base de Notificaciones Internas

## 1. Información General
*   **Fase:** 2.0A
*   **Fecha de Cierre:** 30 de abril de 2026
*   **URL Oficial:** [https://docencia-4-lms.web.app](https://docencia-4-lms.web.app)
*   **Objetivo de la Fase:** Diseñar e implementar la infraestructura base y la interfaz de usuario (campana en dashboard) para gestionar notificaciones internas dirigidas a los participantes del LMS Docencia 4.0, garantizando alta seguridad sin correos electrónicos y sin activar automatizaciones prematuras.

---

## 2. Archivos Modificados
*   `firestore.rules`: Implementación de políticas de seguridad para la nueva subcolección de notificaciones.
*   `docencia-4.0/scripts/notification-service.js`: Creación del servicio modular para consultas y *listeners* en tiempo real.
*   `docencia-4.0/dashboard.html`: Inyección de la campana interactiva (HTML + CSS encapsulado) y acoplamiento de suscripciones reactivas.

---

## 3. Funcionalidades Completadas
*   **Infraestructura de Notificaciones Internas:** Preparación de la "tubería" que manejará la mensajería del LMS.
*   **Subcolección Firestore:** Creación estructural de `usuarios/{uid}/notificaciones/{notificationId}`.
*   **Campana de Notificaciones (Dashboard):** Icono reactivo ubicado en el encabezado.
*   **Contador de No Leídas (Badge):** Globo numérico que se actualiza instantáneamente (`where status == "unread"`).
*   **Lista de Recientes:** Dropdown interactivo con las últimas 5 notificaciones recibidas (excluyendo archivadas).
*   **Interacciones del Usuario:**
    *   **Marcar como Leída:** Cambia el estado visual y actualiza Firestore con `status: "read"` y `readAt`.
    *   **Archivar:** Remueve visualmente la notificación de la lista y actualiza a `status: "archived"`.
*   **Listeners en Tiempo Real:** Las suscripciones limpian su memoria (unsubscribe) adecuadamente al cerrar sesión.
*   **Reglas de Seguridad (Server-Side):** Limitación granular mediante `firestore.rules`.

---

## 4. Seguridad Validada
*   **Lectura Aislada:** Un participante solo puede obtener y listar notificaciones de su propio `uid`.
*   **Actualización Limitada:** El usuario dueño únicamente puede modificar los campos `status`, `readAt` y `updatedAt`.
*   **Bloqueo de Creación:** Los participantes **no pueden** crear notificaciones en la base de datos, ni para ellos ni para otros.
*   **Bloqueo de Modificación de Contenido:** Los usuarios no pueden alterar `title`, `message`, `priority` u otros metadatos inyectables.
*   **Bloqueo de Eliminación Física (`allow delete: if false`):** Solo se permite el archivo lógico (`status: "archived"`).
*   **Creación Controlada:** Solo los administradores (o triggers desde un backend validado en futuras fases) poseen permisos para crear (utilizando validación estricta de estructura con `hasAll()` y `hasOnly()`).

---

## 5. QA Realizado
*   [x] **QA en Canal de Vista Previa:** Pruebas completas de UI y reactividad de Firebase de forma exitosa.
*   [x] **QA en Producción:** Verificación sin errores tras el despliegue del Hosting en el dominio principal.
*   [x] **Creación Manual:** Se verificó que crear un documento directamente en Firestore actualiza la UI al instante.
*   [x] **Listener en Tiempo Real:** El *badge* numérico renderiza actualizaciones push sin necesidad de refrescar `dashboard.html`.
*   [x] **Marcado como Leída:** Verificada la mutación a "read" conservando las restricciones del schema.
*   [x] **Archivado:** Verificada la mutación a "archived" y el refresco dinámico de la bandeja de entrada.
*   [x] **Bloqueos a Participantes:** Comprobado vía `firestore.rules` que se deniegan las escrituras/alteraciones de participantes.

---

## 6. Problemas Conocidos y Limitaciones Actuales
*   **Triggers No Conectados:** Aún no hay eventos automáticos (por el momento no se disparan notificaciones tras postear en foros, completar módulos o recibir anuncios).
*   **Índices Compuestos:** La consulta de lista reciente (que cruza `where("status", "in", ["unread", "read"])` con `orderBy("createdAt", "desc")`) demanda que se genere el índice de Firestore. Se asume que este índice ha sido creado tras el testing.

---

## 7. Próxima Fase Recomendada
**Fase 2.0B — Integración de notificaciones automáticas para anuncios**
*   Conectar la lógica interna para que anuncios urgentes/importantes creen entradas directas en la bandeja de cada participante.
*   Evaluar una función de administrador (botón) para forzar empuje de mensajes generales.
