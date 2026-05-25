# QA — Prototipo Accesos Investigación en Dashboard

## 1. Objetivo

Crear un espacio controlado en el dashboard para alojar los enlaces de consentimiento/preprueba y postprueba, visibles solo cuando el investigador los habilite.

## 2. Archivos creados

| Archivo | Estado |
|---|---|
| dashboard_research_access_prototype.html | Completado |
| scripts/research-access-prototype.js | Completado |
| QA_Auditoria_Forense_Panel_Operativo/QA_RESEARCH_ACCESS_DASHBOARD_PROTOTYPE.md | Completado |

## 3. Alcance

| Criterio | Resultado |
|---|---|
| Prototipo independiente | Sí |
| No modifica dashboard.html | Sí |
| No modifica main.css | Sí |
| No usa Firestore | Sí |
| No hace deploy | Sí |

## 4. QA funcional

| Prueba | Resultado |
|---|---|
| Bloque oculto si no hay accesos activos | Completado |
| Consentimiento/preprueba habilitable | Completado |
| Postprueba habilitable | Completado |
| Ambos accesos visibles si ambos están activos | Completado |
| Enlaces abren en pestaña nueva | Completado |
| Aviso si no hay URL | Completado |

## 5. QA visual

| Prueba | Resultado |
|---|---|
| Diseño Docencia 4.0 | Completado |
| Tarjetas claras | Completado |
| Nota ética visible | Completado |
| Responsive desktop | Completado |
| Responsive móvil/tableta | Completado |

## 6. Seguridad y ética

| Criterio | Resultado |
|---|---|
| No hay lenguaje coercitivo | Completado |
| No recopila datos en LMS | Completado |
| No guarda consentimiento en LMS | Completado |
| No usa Firestore | Completado |
| No expone datos personales | Completado |

## 7. Arquitectura futura propuesta

- Configuración futura en Firestore:
  - `configuracionInvestigacion/accesos`
- Control futuro desde panel administrativo.
- Participantes solo visualizan accesos habilitados.

## 8. Veredicto

- GO / NO-GO para revisión visual: GO
- GO / NO-GO para integración futura: GO
