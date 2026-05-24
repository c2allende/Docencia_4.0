# QA — Integración Prototipo Asistente Docencia 4.0 en Dashboard

## 1. Objetivo

Validar la integración controlada del Asistente Docencia 4.0 dentro de un prototipo del dashboard.

## 2. Archivos creados

| Archivo | Estado |
|---|---|
| dashboard_chatbot_integration_prototype.html | Creado |
| scripts/chatbot-docencia4-handler-integration-prototype.js | Creado |
| QA_CHATBOT_DASHBOARD_INTEGRATION_PROTOTYPE.md | Creado |

## 3. Restricciones

| Criterio | Resultado |
|---|---|
| dashboard.html modificado | No |
| styles.main.css modificado | No |
| firebase-config.js modificado | No |
| Firestore usado | No |
| API externa usada | No |
| Deploy ejecutado | No |

## 4. QA Visual

| Prueba | Resultado |
|---|---|
| Dashboard conserva diseño | Cumplido |
| Botón flotante visible | Cumplido |
| Panel abre/cierra | Cumplido |
| No tapa elementos críticos | Cumplido |
| Responsive desktop | Cumplido |
| Responsive móvil | Cumplido |

## 5. QA Funcional

| Prueba | Resultado |
|---|---|
| Categorías rápidas | Cumplido |
| Búsqueda por texto | Cumplido |
| Respuesta módulos | Cumplido |
| Respuesta actividades | Cumplido |
| Respuesta plantillas | Cumplido |
| Respuesta foros | Cumplido |
| Respuesta Padlet | Cumplido |
| Respuesta progreso | Cumplido |
| Contacto investigador | Cumplido |

## 6. QA Pedagógica

| Prueba | Resultado |
|---|---|
| Orienta sin completar tareas | Cumplido |
| Bloquea solicitudes de hacer trabajos | Cumplido |
| Mantiene tono institucional | Cumplido |
| Reduce carga cognitiva | Cumplido |

## 7. Seguridad

| Criterio | Resultado |
|---|---|
| API keys expuestas | No |
| Firestore usado | No |
| Datos personales guardados | No |
| Producción modificada | No |

## 8. URL local

http://localhost:5000/dashboard_chatbot_integration_prototype.html

## 9. Veredicto

- GO / NO-GO para revisión visual: GO
- GO / NO-GO para integración en dashboard real: GO
- GO / NO-GO para integración global: NO-GO (Pendiente aprobación del usuario)
