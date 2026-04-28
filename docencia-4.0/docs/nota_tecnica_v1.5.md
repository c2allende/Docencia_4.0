# Nota Técnica de Cierre: Docencia 4.0 - Versión 1.5

**Fecha de Cierre:** 28 de abril de 2026
**Responsable:** Carmelo Allende & Antigravity (AI Assistant)
**Estado:** Producción / Estable

## 1. Funcionalidades Completadas
*   **Identidad y Roles**: Migración total de perfiles a Firestore y sistema de roles (`admin`, `participante`).
*   **Seguridad de Acceso**: Implementación de `Admin Guards` para protección de rutas administrativas.
*   **Gestión de Comunicación**: Sistema CRUD completo de anuncios con estados (Borrador, Publicado, Archivado).
*   **Inteligencia de Dashboard**: Sistema de alertas jerárquico (Banner Urgente vs. Aviso Discreto).
*   **Localización PR**: Formateo de fecha y hora sincronizado con la zona horaria de Puerto Rico (`America/Puerto_Rico`).
*   **Persistencia de Lectura**: Seguimiento individual de noticias leídas por participante.

## 2. Inventario de Archivos Clave
*   `/scripts/announcement-service.js`: Motor de datos Firestore y utilidades de fecha.
*   `/scripts/admin-anuncios-handler.js`: Lógica del panel de administración.
*   `/scripts/announcements-handler.js`: Lógica de la vista del alumno.
*   `/scripts/admin-guard.js`: Middleware de seguridad para rutas administrativas.
*   `/scripts/user-service.js`: Gestión de perfiles y persistencia de roles.

## 3. Estructura de Datos (Firestore)
*   **Colección `usuarios`**: `{ uid, email, displayName, role, status, updatedAt }`
    *   **Subcolección `anuncioLecturas`**: `{ announcementId, readAt }`
*   **Colección `anuncios`**: `{ title, message, scope, moduleId, priority, status, isActive, publishAt, expiresAt, createdBy, createdAt, updatedAt }`

## 4. Reglas de Seguridad (Firestore Rules)
Se aplicaron reglas de nivel 2 que garantizan:
1.  Solo el Administrador puede crear, editar o archivar anuncios.
2.  Los Participantes solo pueden leer anuncios marcados como `status: "published"` e `isActive: true`.
3.  Los registros de lectura son privados por cada `UID` de usuario.

## 5. URL Pública y Producción
*   **URL**: [https://docencia-4-lms.web.app](https://docencia-4-lms.web.app)
*   **Hosting**: Firebase Hosting (SSL activo).
*   **Base de Datos**: Firestore Native Mode.

## 6. Pruebas de Calidad (QA) Realizadas
*   **Auth Flow**: Autenticación Google exitosa y creación automática de perfil.
*   **Admin Access**: Bloqueo de acceso a páginas `/admin_*.html` para participantes.
*   **Lifecycle**: Ciclo completo de anuncio (Borrador -> Publicación -> Archivado).
*   **Alertas**: El Dashboard muestra correctamente el banner rojo para urgencias y azul para noticias normales.
*   **Cronología**: Verificación de orden descendente por fecha y visualización de hora local PR.

## 7. Próxima Fase Recomendada (Versión 1.6)
**Objetivo: Interacción Social y Debates**
*   Implementación de **Foros por Módulo** usando Firestore.
*   Capacidad de respuesta y hilos de conversación.
*   Notificaciones de nuevas respuestas en el Dashboard.

---
*Documento generado automáticamente al cierre de la Fase 1.5D.*
