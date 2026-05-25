# QA — Accesos de Investigación en Modo Producción Controlada

## Estado

- Modo prueba retirado: Completado
- Panel Operativo: Completado
- Dashboard participante: Completado
- QA local: Completado
- Deploy Hosting: Completado
- Deploy Rules, si aplicó: No aplicó (las reglas ya cubrían `signedIn()` e `isAdmin()`)
- QA producción: Completado

## Cambios aplicados

| Cambio | Resultado |
|---|---|
| Eliminado modo test_only | Completado |
| Eliminado email participante test | Completado |
| Visibilidad por switch general | Completado |
| Instrumentos independientes | Completado |
| Admin puede ver en Dashboard | Completado |
| Participantes autenticados pueden ver si está activo | Completado |

## QA Panel Operativo

| Prueba | Resultado |
|---|---|
| Control integrado | Completado |
| Guardar sin email test | Completado |
| Apagar todos | Completado |
| Restaurar enlaces oficiales | Completado |
| Vista previa participante | Completado |

## QA Dashboard

| Prueba | Resultado |
|---|---|
| Todo apagado oculta bloque | Completado |
| Switch general apagado oculta bloque | Completado |
| Consentimiento visible si activo | Completado |
| Postprueba visible si activa | Completado |
| Grupo focal pendiente | Completado |
| Admin puede ver bloque activo | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| No recopila respuestas | Completado |
| No guarda consentimiento | Completado |
| Dashboard solo lee configuración | Completado |
| Admin escribe configuración | Completado |
| No Cloud Functions | Completado |
| No SendGrid | Completado |
| firebase-config.js intacto | Completado |
| styles.main.css intacto | Completado |

## Veredicto

- GO / NO-GO: GO
