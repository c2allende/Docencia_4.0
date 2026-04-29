# Nota Técnica v1.8A - Docencia 4.0

**Fecha de cierre:** 29 de abril de 2026  
**Estado:** Completado y Validado en Producción  
**URL Pública:** [https://docencia-4-lms.web.app/](https://docencia-4-lms.web.app/)

## 1. Objetivo de la Fase
Implementar una herramienta administrativa segura para reiniciar el progreso de los participantes módulo a módulo, permitiendo una gestión pedagógica flexible sin pérdida de datos históricos de acceso (visitas y fechas), asegurando una interfaz responsiva premium en cualquier dispositivo.

## 2. Alcance Técnico
### Archivos Modificados:
- `firestore.rules`: Refinamiento de permisos `get`/`list` y protección de auditoría.
- `scripts/progress-service.js`: Implementación de `resetUserModuleProgress` y `logAdminAction`.
- `scripts/admin-progreso-handler.js`: Integración de la UI de reinicio y lógica de renderizado dinámico con `data-labels`.
- `admin_progreso.html`: Estilos premium, diseño responsivo dual (tabla/tarjetas) y correcciones estéticas.

## 3. Funcionalidades Completadas
- **Reinicio Controlado:** Posibilidad de reiniciar el progreso de los Módulos 1, 2 o 3 de forma independiente.
- **Conservación de Historial:** Se mantienen los contadores de visitas (`visitCount`) y las fechas de apertura (`firstOpenedAt`, `lastOpenedAt`).
- **Reinicio Lógico:** Los documentos de páginas visitadas se restablecen a "started", eliminando la marca de completado, mientras que el resumen del módulo se restablece a "not_started" para reflejar 0% de avance completado, evitando el borrado físico de registros.
- **Registro de Auditoría:** Cada acción administrativa genera un documento en la colección `adminLogs`.

## 4. Diseño Responsivo Premium (UI/UX)
- **Layout Desktop Fluido:** Ampliación del contenedor a **1600px** con columnas proporcionales (Participante 25%).
- **Modo Tarjeta (Mobile):** Transformación automática de la tabla en tarjetas verticales para pantallas menores a **992px**.
- **Columna Fija (Sticky):** Columna de acciones fijada a la derecha en modo escritorio para garantizar acceso al botón "Ver detalle".
- **Identidad Visual:** Avatares de 40px con iniciales perfectamente centradas (Flexbox) y tipografía de encabezados.

## 5. Seguridad Validada
- **Control de Acceso:** Solo usuarios con `role: "admin"` y `status: "active"` pueden acceder.
- **Admin Guard:** Redirección automática de participantes al intentar acceder a la ruta administrativa.
- **Perímetro Firestore:** Bloqueo de listado de usuarios a participantes y protección estricta contra borrado de datos.

## 6. Pruebas Realizadas en Producción
- **Usuario de prueba:** `test_participant_reset@docencia.com`
- **Escenario:** Reinicio de Módulo 1 (de 13% a 0%).
- **Resultado:** Éxito total. Auditoría registrada y otros módulos sin afectación.

## 7. Problemas Corregidos
- **SyntaxError Crítico:** Resolución de errores de importación en `progress-service.js`.
- **Visibilidad de Botones:** Corrección de desbordamiento de tabla mediante `table-layout: fixed` y scroll horizontal.
- **Cuota de Hosting:** Limpieza de historial de despliegues para liberar espacio en el plan Spark (HTTP 429).
- **Estética de Avatar:** Ajuste de tamaño y centrado de la inicial del participante.

## 8. Próxima Fase Recomendada
- **Fase 1.8B:** Gestión administrativa de datos huérfanos de progreso para optimizar el almacenamiento y asegurar la coherencia de Firestore.
