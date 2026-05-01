# Nota Técnica v2.0B — Cierre de Fase
**Fecha de cierre:** 1 de mayo de 2026  
**URL oficial:** [https://docencia-4-lms.web.app/dashboard.html](https://docencia-4-lms.web.app/dashboard.html)

## 1. Objetivo de la Fase
Centralizar los anuncios urgentes e importantes en la campana de notificaciones del Dashboard, eliminando cintillos grandes, pop-ups automáticos y duplicidad visual para mejorar la experiencia de usuario y la limpieza de la interfaz.

## 2. Archivos Modificados
- `docencia-4.0/dashboard.html` (Refactorización de lógica de anuncios y limpieza de DOM)
- `docencia-4.0/admin_dashboard.html` (Limpieza de estilos residuales y banners)
- `docencia-4.0/scripts/announcement-service.js` (Ajustes de compatibilidad con reglas de Firestore)
- `docencia-4.0/scripts/firebase-config.js` (Normalización de SDK a v10.12.0)
- `docencia-4.0/scripts/*.js` (Actualización de imports para normalización del SDK)

## 3. Funcionalidades Completadas
- **Notificaciones Virtuales**: Los anuncios urgentes e importantes se inyectan dinámicamente en el menú de la campana sin persistir en la colección `notificaciones`.
- **Fusión de UI**: La campana muestra tanto notificaciones persistentes (ej: sistema) como virtuales (ej: anuncios).
- **Exclusión de Anuncios Normales**: Solo los anuncios con prioridad 'urgente' o 'importante' activan el badge de la campana.
- **Registro de Lectura**: Uso de la colección `usuarios/{uid}/anuncioLecturas/{announcementId}` para persistir el estado de lectura.
- **Saneamiento de UI**: Eliminación definitiva de `#urgentAlertContainer`, banners rojos/azules y pop-ups de SweetAlert2 automáticos al cargar.

## 4. Seguridad y Robustez
- **Integridad de Reglas**: No se modificaron las `firestore.rules`. El acceso a anuncios sigue protegido.
- **Sin Persistencia innecesaria**: Los anuncios no generan documentos en `notificaciones`, evitando redundancia de datos.
- **Correcciones Técnicas**: Se ajustó `getVisibleAnnouncements()` para manejar correctamente los márgenes de tiempo (`clock drift`) requeridos por las reglas de seguridad de Firestore.
- **Caché y Hosting**: Se identificó y resolvió un problema de persistencia visual mediante el despliegue forzado en Firebase Hosting, invalidando versiones obsoletas del CDN.

## 5. QA Realizado
- **Verificación en Producción**: Confirmación de dashboard limpio (participante y admin) tras el despliegue.
- **Prueba de Flujo**: Marcado de anuncio como leído desde la campana con disminución exitosa del contador (badge).
- **Consola**: Verificación de ausencia de errores de SDK o denegaciones de permiso (Permission Denied).

## 6. Hallazgos y Problemas Conocidos
- **Hallazgo clave**: La persistencia del cintillo era causada por la caché del servidor de hosting/CDN, no por el código local.
- **Limitación**: Las notificaciones de anuncios son virtuales; no persisten si el usuario limpia su estado de lectura en `anuncioLecturas`.
- **Estado Actual**: La Fase 2.0B está lista para el cierre.

## 7. Próxima Fase Recomendada
**Fase 2.0C — Notificaciones de progreso por módulo completado**: Implementar alertas visuales (solo en la campana) cuando el sistema detecte que un participante ha llegado al 100% de un módulo.

---
*Documento generado por Antigravity (Advanced Agentic Coding)*
