# QA — Prototipo Integrado Control de Accesos de Investigación en Panel Operativo

## Estado

- Prototipo integrado: Completado
- QA visual: Completado
- QA funcional: Completado
- Deploy ejecutado: No

## Archivos creados

- admin_dashboard_research_access_prototype.html
- scripts/admin-research-access-simple-embedded-prototype.js
- QA_RESEARCH_ACCESS_EMBEDDED_PANEL_PROTOTYPE.md

## Cambios aplicados

- Control de investigación integrado dentro del Panel Operativo.
- Presentación alineada con Control de accesos por módulo.
- Botón “Apagar todos” corregido con fondo anaranjado y texto blanco.
- Vista previa participante integrada.
- Sin Firestore.
- Sin producción.

## QA visual

| Prueba | Resultado |
|---|---|
| Integrado al Panel Operativo | Completado |
| No es página aparte | Completado |
| Similar al Control de accesos por módulo | Completado |
| Botón Apagar todos anaranjado/blanco | Completado |
| Vista previa clara | Completado |
| Responsive | Completado |

## QA funcional

| Prueba | Resultado |
|---|---|
| Consentimiento/preprueba independiente | Completado |
| Postprueba independiente | Completado |
| Grupo focal independiente | Completado |
| Todo apagado oculta bloque | Completado |
| Grupo focal pendiente sin URL | Completado |
| Restaurar enlaces oficiales | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| Firestore usado | No |
| Dashboard real modificado | No |
| Panel Operativo real modificado | No |
| styles.main.css modificado | No |
| firebase-config.js modificado | No |
| Deploy ejecutado | No |

## Veredicto

- GO / NO-GO para revisión visual: GO
- GO / NO-GO para integración futura: GO
