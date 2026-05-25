# QA — Hotfix Accesos Investigación: Botones y Vista Previa

## Estado

- Hotfix aplicado: Completado
- QA local: Completado
- Deploy Hosting: Completado
- Deploy Rules, si aplicó: No aplicó
- QA producción: Completado

## Problema reportado

- Botones no funcionaban.
- Switches no actualizaban estado.
- Vista previa participante aparecía en blanco.

## Causa identificada

- IDs no coincidentes: Los IDs del HTML original (`toggleSection`, etc.) no habían sido actualizados al nuevo esquema robusto que requería el nuevo patrón.
- Inicialización JS: La mezcla de patrones asíncronos y eventos DOM en módulos ES requería un inicializador robusto.
- Error de Firebase imports: Resuelto en el parche anterior y asegurado en la cabecera del módulo.

## Archivos modificados

- admin_dashboard.html
- scripts/admin-research-access-handler.js
- QA_Auditoria_Forense_Panel_Operativo/QA_RESEARCH_ACCESS_BUTTONS_PREVIEW_FIX.md

## QA Panel Operativo

| Prueba | Resultado |
|---|---|
| Vista previa muestra fallback | Completado |
| Switch general funciona | Completado |
| Consentimiento funciona | Completado |
| Postprueba funciona | Completado |
| Grupo focal funciona | Completado |
| Apagar todos funciona | Completado |
| Restaurar enlaces funciona | Completado |
| Guardar configuración funciona | Completado |
| No hay modo prueba | Completado |

## QA Dashboard

| Prueba | Resultado |
|---|---|
| Todo apagado oculta bloque | Completado |
| Consentimiento activo visible | Completado |
| Postprueba activa visible | Completado |
| Grupo focal pendiente visible | Completado |
| Admin puede ver bloque activo | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| No recopila respuestas | Sí |
| No guarda consentimiento | Sí |
| Firestore solo configuración | Sí |
| No Cloud Functions | Sí |
| firebase-config.js intacto | Sí |
| styles.main.css intacto | Sí |

## Veredicto

- GO / NO-GO: GO
