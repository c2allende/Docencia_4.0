# QA — Grupo Focal Visible Solo para Participantes Seleccionados

## Estado

- QA local: Pendiente
- Deploy Hosting: ✅ Completado (v3)
- QA produccion: Pendiente
- Commit: Pendiente

## Cambio aplicado (v3)

El control de grupo focal ahora permite seleccionar participantes desde la lista de usuarios matriculados en la coleccion `usuarios`. El administrador se incluye siempre y no puede deseleccionarse.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| admin_dashboard.html | Agregados `collection`/`getDocs` a window exports, HTML de busqueda/lista/fallback, CSS encapsulado |
| scripts/admin-research-access-handler.js | Reescrito: carga usuarios, busqueda, checkboxes, chips, sincronizacion textarea, admin siempre incluido |
| scripts/research-access-handler.js | Sin cambios (ya filtra por allowedEmails) |

## Detalles de implementacion

| Aspecto | Detalle |
|---|---|
| Coleccion Firestore | `usuarios` |
| Campos nombre | `displayName` / `nombre` / `name` / `fullName` |
| Campos email | `email` / `correo` |
| Campos rol | `role` / `rol` |
| Admin siempre incluido | `carmelo.allende@gmail.com`, `carmelo.allende@upr.edu` |
| Admin no removible | Checkbox disabled |
| Fallback | Textarea colapsable dentro de `<details>` |
| Busqueda | Filtro por nombre o email en tiempo real |

## QA Panel Operativo

| Prueba | Resultado |
|---|---|
| Lista de matriculados carga desde Firestore |  |
| Busqueda por nombre/email funciona |  |
| Admin aparece en lista y seleccionado siempre |  |
| Admin no se puede deseleccionar |  |
| Checkbox selecciona/desclecciona participante |  |
| Chips de seleccionados se actualizan |  |
| Textarea de respaldo se sincroniza automaticamente |  |
| Guardar allowedEmails en Firestore |  |
| Apagar todos no borra seleccionados |  |
| Restaurar enlaces no borra seleccionados |  |
| Vista previa muestra advertencia o conteo |  |
| Sin SyntaxError en consola |  |

## QA Dashboard

| Prueba | Resultado |
|---|---|
| Admin (email en always allowed) ve grupo focal |  |
| Participante seleccionado ve grupo focal |  |
| Participante no seleccionado NO ve grupo focal |  |
| Consentimiento/preprueba sigue visible si activo |  |
| Postprueba sigue visible si activa |  |
| Solo grupo focal activo y usuario no autorizado oculta bloque |  |

## Seguridad

| Criterio | Resultado |
|---|---|
| No recopila respuestas | Si |
| No guarda consentimiento | Si |
| Firestore solo configuracion | Si |
| No Cloud Functions | Si |
| firebase-config.js intacto | Si |
| styles.main.css intacto | Si |

## QA Fix — Participantes activos y alerta administrativa

| Prueba | Resultado |
|---|---|
| Lista usa participantes activos reales (role=participant, status=active, not isTest) |  |
| Total coincide con participantes monitoreados (3) |  |
| Participantes removidos/inactivos excluidos |  |
| Admin (carmelo.allende@gmail.com) no aparece como participante fijo |  |
| Admin no aparece en la lista seleccionable |  |
| Admin no se guarda en allowedEmails |  |
| Admin ve alerta informativa en Dashboard (sin enlaces) |  |
| Alerta admin solo aparece si hay accesos activos |  |
| Grupo focal visible solo para seleccionados |  |
| Consentimiento/preprueba no afectado |  |
| Postprueba no afectada |  |
| Sin SyntaxError |  |

## Veredicto

- GO / NO-GO: Pendiente
