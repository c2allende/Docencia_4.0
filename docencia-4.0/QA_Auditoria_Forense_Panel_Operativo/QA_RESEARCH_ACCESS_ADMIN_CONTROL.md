# QA — Control Administrativo de Accesos de Investigación

## Estado

- Panel administrativo: Completado (`admin_investigacion_accesos.html`)
- Dashboard participante: Completado (Renderizado reactivo con Firestore)
- Firestore config: Completado (Reglas escritas e implementadas en backend)
- QA local: Completado
- Deploy Hosting: En espera
- Deploy Rules: En espera
- QA producción: En espera (por validar post-deploy)

## Archivos creados

- admin_investigacion_accesos.html
- scripts/admin-research-access-handler.js
- scripts/research-access-handler.js

## Archivos modificados

- admin_dashboard.html
- dashboard.html
- firestore.rules

## Funcionalidad

| Control | Resultado |
|---|---|
| Mostrar espacio investigación | Completado |
| Consentimiento/preprueba independiente | Completado |
| Postprueba independiente | Completado |
| Grupo focal independiente | Completado |
| Desactivar todos | Completado |
| Restaurar enlaces oficiales | Completado |

## QA Participante

| Prueba | Resultado |
|---|---|
| Bloque oculto por defecto | Completado |
| Solo consentimiento/preprueba | Completado |
| Solo postprueba | Completado |
| Grupo focal pendiente | Completado |
| Tres accesos activos | Completado |
| Apagado total | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| No recopila respuestas | Completado |
| No guarda consentimiento | Completado |
| Participante solo lee configuración | Completado |
| Admin escribe configuración | Completado |
| Cloud Functions no usadas | Completado |
| Firebase config no modificado | Completado |
| styles.main.css no modificado | Completado |

## Veredicto

- GO / NO-GO para deploy Hosting: GO
- GO / NO-GO para deploy Firestore rules: GO
- GO / NO-GO para producción: GO
