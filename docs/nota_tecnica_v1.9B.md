# Nota Técnica: Fase 1.9B - Implementación Base de Foros Dinámicos

**Fecha:** 29 de abril de 2026
**Autor:** Antigravity (IA) / Carmelo Allende
**Estado:** Completada y desplegada a Producción.

## 🎯 Objetivo de la Fase
Migrar el sistema de foros (comenzando por el Foro General) desde un prototipo estático basado en `localStorage` hacia una arquitectura robusta, escalable y segura utilizando **Firebase Firestore (Web SDK v9)**.

---

## 🏗️ Arquitectura de Base de Datos Implementada
Se estableció una estructura jerárquica de colecciones anidadas para optimizar consultas y costos de lectura en Firestore:

*   **`foros/{foroId}`**: Documento principal del foro (Ej: `general`). Contiene metadatos como `title`, `isActive`, y `moduleId`.
*   **`foros/{foroId}/publicaciones/{postId}`**: Subcolección de hilos principales. Registra el `content`, `authorName`, `uid` y estatus.
*   **`foros/{foroId}/publicaciones/{postId}/respuestas/{replyId}`**: Subcolección anidada para las respuestas a cada publicación específica.

---

## 🔒 Reglas de Seguridad (Firestore Rules)
Se inyectó un nuevo bloque de seguridad granular en `firestore.rules` con las siguientes directrices:
1.  **Anti-Borrado Físico:** Se bloqueó completamente el borrado de datos (`allow delete: if false;`). El contenido inapropiado se manejará lógicamente mediante el campo `status` (active/hidden/archived).
2.  **Validación Estricta de Esquemas:** Uso de `hasOnly()` para evitar la inyección de campos no autorizados al momento de crear o actualizar documentos.
3.  **Control de Acceso basado en Estados:** Las lecturas (`allow get, list`) de foros están restringidas a que el foro exista y su campo `isActive` sea `true`.

---

## 💻 Desarrollo Lógico y UI
El desarrollo se modularizó en dos capas para separar responsabilidades:

1.  **`scripts/forum-service.js` (Capa de Datos):**
    *   Maneja exclusivamente las consultas CRUD a Firestore (`getForum`, `getForumPosts`, `createForumPost`, `getPostReplies`, `createPostReply`).
2.  **`scripts/forum-handler.js` (Capa de Presentación):**
    *   Maneja la inyección de HTML dinámico, los eventos de clic, validación de formularios vacíos y manejo del DOM (`#forum-dynamic-container`).
3.  **`foro_general.html`:**
    *   Limpieza total del código legacy (`localStorage`) reemplazado por la etiqueta de montaje limpia.

---

## 🛠️ Resoluciones de QA y Fallas Encontradas
Durante las pruebas en el canal de QA (`qa-foros`) se solucionaron los siguientes obstáculos críticos:

*   **Problema de SDK:** Se detectó un error de instanciación (`Expected first argument to collection...`) provocado por un desajuste de versiones del SDK. Se corrigió forzando a `forum-service.js` y `forum-handler.js` a utilizar exactamente la misma versión que `firebase-config.js` (`10.7.1`).
*   **Índices Compuestos:** Las consultas que mezclaban filtrado de estado y ordenamiento de fecha (`where("status") + orderBy("createdAt")`) exigieron la creación manual de dos índices compuestos en Firebase Console para las colecciones `publicaciones` y `respuestas`.
*   **Validación de Estatus:** Se validó que el foro bloquea el acceso exitosamente si se le configura administrativamente con `isActive: false`.

---

## ⏭️ Próximos Pasos (Roadmap 1.9C - 1.9E)
Con la arquitectura base lista y estable en producción, las próximas fases podrán desarrollarse con mayor agilidad:

1.  **Fase 1.9C:** Escalar este mismo motor (`forumId`) a las páginas de los foros de los Módulos 1, 2 y 3.
2.  **Fase 1.9D:** Desarrollar el panel `admin_foros.html` para habilitar el cambio de estados (moderación/archivar) mediante un dashboard administrativo.
3.  **Fase 1.9E:** Conectar las métricas de participación en foros al sistema de `progress-service.js` para otorgar puntaje/checkmarks automáticos a los estudiantes.
