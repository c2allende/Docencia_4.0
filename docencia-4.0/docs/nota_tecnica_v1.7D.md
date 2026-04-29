# Nota Técnica Docencia 4.0 - v1.7D
**Fecha de Cierre:** 28 de abril de 2026
**Estado:** Cerrada / Validada en Producción
**URL Pública:** [https://docencia-4-lms.web.app/](https://docencia-4-lms.web.app/)

## 1. Alcance de la Fase 1.7D
Extensión del sistema de seguimiento de progreso real con Firestore al Módulo 3, manteniendo la paridad funcional con los módulos anteriores y optimizando el panel administrativo para una vista de tres columnas.

## 2. Funcionalidades Completadas
- **Seguimiento Módulo 3:** Integración de metadatos de rastreo en las 8 páginas del Módulo 3.
- **Dashboard Pedagógico:** Actualización de la lógica de cálculo para mostrar el desglose de Contenido, Actividades, Foro y Recursos del tercer módulo.
- **Panel Administrativo (`admin_progreso.html`):**
  - Nueva columna "Módulo 3" en la tabla principal.
  - Filtros extendidos para el Módulo 3.
  - Modal de detalle rediseñado para mostrar 3 columnas simultáneas (M1, M2, M3).
- **Consolidación Estructural:**
  - **Módulo 1:** 8 páginas reales.
  - **Módulo 2:** 7 páginas reales (corrección aplicada tras QA).
  - **Módulo 3:** 8 páginas reales.

## 3. Correcciones de Errores (Fixes Críticos)
- **Bug `undefined%`:** Se corrigió la inicialización en `progress-service.js` que impedía calcular el progreso del Módulo 3 en el panel administrativo.
- **UI `modulo3_intro.html`:** Se corrigió la clase del footer (`nav-footer` -> `footer-nav`) para estandarizar la visibilidad del botón de completado con el resto del curso.
- **Cálculo de Promedios:** Se resolvió el error de `NaN%` en las métricas generales del administrador causado por la falta del valor del Módulo 3.

## 4. Pruebas Realizadas en Producción
1. **Login como participante:** Registro de progreso incremental validado (12.5% por página en M3).
2. **Dashboard:** Validación de porcentajes y desglose pedagógico (5/1/1/1).
3. **Login como admin:** Verificación de tabla, filtros y modal de detalle.
4. **Seguridad:** Confirmación de que el `admin-guard.js` bloquea accesos no autorizados a la URL de administración.

## 5. Problemas Conocidos
- **Caché de Firebase:** En algunos despliegues, es necesario realizar un refresco forzado (Ctrl+F5) para cargar las nuevas versiones de los scripts de servicio.
- **Documentos Huérfanos:** El sistema utiliza `COURSE_STRUCTURE` como fuente de verdad para evitar que documentos antiguos en Firestore inflen los porcentajes.

## 6. Próxima Fase Recomendada

- Fase 1.8A: Herramientas administrativas de progreso, comenzando con reinicio controlado de progreso por participante y por módulo.
- Fase 1.8B: Limpieza o manejo administrativo de datos huérfanos de progreso.
- Fase 1.9: Foros dinámicos con Firestore e integración del foro con el progreso.
- Fase 2.0: Notificaciones automáticas, reportes PDF/CSV y comunicaciones avanzadas.
