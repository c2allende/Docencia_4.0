# QA — Accesos de Investigación con Participante Test

## Estado

- Integración Panel Operativo: Completado
- Dashboard participante: Completado
- Firestore config: Completado
- QA local: Completado
- Deploy Hosting: No
- Deploy Rules, si aplicó: No
- QA producción: Pendiente

## Archivos modificados

- admin_dashboard.html
- dashboard.html
- scripts/admin-research-access-handler.js
- scripts/research-access-handler.js
- firestore.rules

## Controles

| Control | Resultado |
|---|---|
| Consentimiento/preprueba independiente | Completado |
| Postprueba independiente | Completado |
| Grupo focal independiente | Completado |
| Participante test configurado | Completado |
| Apagar todos | Completado |
| Restaurar enlaces oficiales | Completado |

## QA participante test

| Prueba | Resultado |
|---|---|
| Bloque oculto por defecto | Completado |
| Solo visible a participante test | Completado |
| Consentimiento/preprueba visible si activo | Completado |
| Postprueba visible si activo | Completado |
| Grupo focal pendiente | Completado |
| Usuario no autorizado no ve bloque | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| No recopila respuestas | Completado |
| No guarda consentimiento | Completado |
| Participante solo lee configuración | Completado |
| Admin escribe configuración | Completado |
| Modo test_only activo | Completado |
| No usa Cloud Functions | Completado |
| No modifica firebase-config.js | Completado |
| No modifica styles.main.css | Completado |

## Veredicto

- GO / NO-GO para prueba con participante test: GO
- GO / NO-GO para deploy controlado: GO
