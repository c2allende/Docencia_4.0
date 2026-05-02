# Nota Técnica v2.0F-2: Estabilización de Foros y Moderación
**Fecha de cierre:** 2 de mayo de 2026

## 1. Objetivo
Estabilizar el sistema de foros dinámicos de la plataforma Docencia 4.0 para garantizar la integridad de los datos, la seguridad de las acciones administrativas y el control pedagógico del progreso de los participantes.

## 2. Problemas Abordados
- **Riesgo de Pérdida de Auditoría:** Se identificó un intento inicial de implementar el borrado físico de mensajes ("BORRAR POST"), lo cual contraviene los protocolos de auditoría del sistema.
- **Vulnerabilidad de Identificación:** Riesgo de detección de administradores mediante criterios inseguros como el nombre visible (`displayName`), correos parciales o contextos de rol (`roleContext`).
- **Gestión de Datos de Prueba:** Necesidad de limpiar el sistema de mensajes de prueba sin comprometer la trazabilidad histórica.
- **Control de Participación:** Se detectó que el módulo podía marcarse como completado sin una interacción real del participante en el foro.

## 3. Decisiones de Seguridad e Integridad
- **Bloqueo de Borrado Físico:** Se mantiene la regla `allow delete: if false` en Firestore para todas las colecciones de foros. La interfaz de usuario no ofrece ni ofrecerá opciones de eliminación real.
- **Moderación Lógica:** Se ha implementado el archivado (`status: archived`) y el ocultamiento (`status: hidden`) como únicos mecanismos de limpieza.
- **Autoridad Estricta:** La seguridad se basa exclusivamente en los campos `role: "admin"` y `status: "active"` verificados directamente en Firestore. Se han eliminado todas las comprobaciones basadas en nombres o emails parciales.
- **Integridad de Logs:** Cada acción de moderación genera un registro atómico en `adminLogs` con 11-12 campos obligatorios, incluyendo el UID del moderador y el motivo de la acción.

## 4. Funcionalidades Confirmadas
- **Moderación Administrativa:** Botón "📦 Archivar" funcional en publicaciones y respuestas, visible únicamente para perfiles con rol de administrador.
- **Privacidad del Participante:** Los participantes no tienen acceso a herramientas de moderación ni pueden ver contenidos ocultos o archivados.
- **Notificaciones Automáticas:** El sistema notifica al autor original cuando su contenido es moderado.
- **Progreso Condicionado:** El botón "Completar" del foro en los módulos de aprendizaje permanece bloqueado hasta que se detecta una aportación válida del usuario (`checkUserParticipation`).

## 5. QA Realizado y Validado
- **Moderación:** Confirmado el archivado correcto de posts y respuestas con actualización dinámica de la UI.
- **Seguridad:** Los intentos de ejecutar borrados físicos desde la consola del navegador son rechazados por las reglas de seguridad de Firestore.
- **Progreso:** Validado que el participante no puede progresar sin publicar y que la publicación habilita dinámicamente el botón de completado.
- **Regresión:** Se verificó que las notificaciones y el feed principal del foro siguen funcionando correctamente tras los cambios de esquema.

## 6. Limitaciones Conocidas
- **Purga Permanente:** La eliminación total de documentos (si fuera requerida por ley o espacio crítico) debe realizarse exclusivamente desde la Consola de Firebase o mediante scripts de servidor autorizados fuera del LMS.
- **Cuota de Almacenamiento:** Se ha mitigado mediante la reducción de retención de versiones en Hosting, pero el crecimiento de la base de datos Firestore sigue sujeto a las cuotas del proyecto.

## 7. Próximos Pasos
- Retomar la **Microfase 2.0F-1** para el control granular de accesos por fecha.
- Iniciar la **Fase 2.0F** de auditoría integral una vez se estabilicen las métricas de uso real.
