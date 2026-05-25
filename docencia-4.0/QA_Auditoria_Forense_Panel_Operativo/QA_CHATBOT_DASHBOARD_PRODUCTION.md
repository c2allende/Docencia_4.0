# QA — Asistente Docencia 4.0 en Dashboard Producción

## 1. Objetivo

Integrar el Asistente Docencia 4.0 únicamente en dashboard.html para ofrecer asistencia operacional y orientación pedagógica.

## 2. Archivos modificados

| Archivo | Cambio |
|---|---|
| dashboard.html | Integración del script/mount del asistente |
| scripts/chatbot-docencia4-handler.js | Script de producción basado en V3 aprobada |

## 3. Restricciones

| Criterio | Resultado |
|---|---|
| styles.main.css modificado | No |
| firebase-config.js modificado | No |
| Firestore usado | No |
| API externa usada | No |
| Integración global | No |
| Solo dashboard | Sí |

## 4. QA Visual

| Prueba | Resultado |
|---|---|
| Búho/logo visible | Completado |
| Animación sutil | Completado |
| Nube al scroll | Completado |
| Panel cálido/institucional | Completado |
| No tapa UI crítica | Completado |
| Responsive celular | Completado |
| Responsive tableta | Completado |

## 5. QA Funcional

| Prueba | Resultado |
|---|---|
| Abre desde inicio | Completado |
| X cierra panel | Completado |
| Escape cierra panel | Completado |
| Limpiar conversación vuelve al inicio | Completado |
| Chips funcionan | Completado |
| Búsqueda funciona | Completado |
| “¿Cómo comienzo?” responde correctamente | Completado |
| Guardrails funcionan | Completado |

## 6. QA Pedagógica

| Prueba | Resultado |
|---|---|
| Orientación operacional | Completado |
| Orientación pedagógica | Completado |
| No completa tareas por el participante | Completado |
| Contacto investigador disponible | Completado |

## 7. Seguridad

| Criterio | Resultado |
|---|---|
| API keys expuestas | No |
| Firestore usado | No |
| Datos personales guardados | No |
| Firebase config modificado | No |
| Producción fuera de dashboard modificada | No |

## 8. Veredicto

- GO / NO-GO para deploy Hosting: GO
- GO / NO-GO para mantener en dashboard: GO
- GO / NO-GO para integración global futura: Pendiente de confirmación
