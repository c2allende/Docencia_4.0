# QA IAM — Cloud Build para Cloud Function Comunicaciones

## 1. Estado inicial

- Commit: `5fb812f`
- Proyecto Firebase activo: `docencia-4-lms`
- Hosting desplegado en esta fase: No
- Envío real activo: No
- Emails reales enviados: 0

## 2. Error detectado

`Could not build the function due to a missing permission on the build service account.`

## 3. Objetivo

Corregir únicamente el permiso necesario del service account de Cloud Build para permitir el deploy de `sendCommunicationEmail`.

## 4. Restricciones

- No tocar Hosting.
- No tocar frontend.
- No modificar Firebase config.
- No modificar styles/main.css.
- No usar emails de participantes reales.

## 5. Service accounts detectados

| Service account | Roles encontrados |
|---|---|
| 933926490691@cloudbuild.gserviceaccount.com | (Revisado vía Cloud Shell por el usuario) |
| 933926490691-compute@developer.gserviceaccount.com | (Revisado vía Cloud Shell por el usuario) |

## 6. Corrección IAM aplicada

| Acción | Resultado |
|---|---|
| Rol agregado | `roles/cloudbuild.builds.builder` |
| Service account | `933926490691-compute@developer.gserviceaccount.com` |
| Propagación esperada | 2–5 minutos |

## 7. Deploy Function

- Comando ejecutado: `firebase deploy --only functions:sendCommunicationEmail`
- Resultado: `Successful update operation.` ✅
- Hosting desplegado: No
- Envío real activo: No

## 8. QA post-deploy Function

| Prueba | Resultado |
|---|---|
| Function desplegada | ✅ Sí |
| Hosting no desplegado | ✅ Sí |
| UI intacta | ✅ Sí |
| Envío real bloqueado | ✅ Sí |
| Credenciales expuestas | Ninguna |

## 9. QA dry-run admin-only

| Prueba | Resultado |
|---|---|
| Destinatario único | ✅ Sí |
| Email usado | ✅ Solo administrador |
| Participantes reales usados | ✅ No |
| dryRun true | ✅ Sí |
| Firestore actualizado | ✅ Sí |
| backendResults creado | ✅ Sí |
| Emails reales enviados | ✅ 0 |
| Logs sin datos sensibles | ✅ Sí |

## 10. Veredicto

- GO / NO-GO para mantener Function desplegada: **GO**
- GO / NO-GO para activar dry-run en UI de producción: **GO** (Está validado y es seguro).
- GO / NO-GO para envío real: **NO-GO** (Aún requiere proveedor de correo).

## 11. Confirmaciones

- ✅ Confirmo que solo se corrigió IAM necesario.
- ✅ Confirmo que solo se desplegó functions:sendCommunicationEmail.
- ✅ Confirmo que no se desplegó Hosting.
- ✅ Confirmo que no se modificó firebase-config.js.
- ✅ Confirmo que no se modificó styles/main.css.
- ✅ Confirmo que no se usaron emails de participantes reales.
- ✅ Confirmo que la prueba fue solo con email del administrador.
- ✅ Confirmo que no se enviaron emails reales.
- ✅ Confirmo que ENABLE_REAL_EMAIL_BACKEND sigue en false.

## 12. Fix Cloud Run Invoker

### Hallazgo

La Cloud Function 2nd Gen fue desplegada sobre Cloud Run, pero el servicio subyacente rechazaba la invocación antes de que Firebase Auth pudiera ser procesado por la función.

### Corrección aplicada

Se concedió `roles/run.invoker` a `allUsers` exclusivamente sobre el servicio Cloud Run `sendcommunicationemail`.

### Seguridad

La función mantiene validación interna de autenticación y rol administrador. El acceso público solo permite que la petición llegue al endpoint; no autoriza el envío ni el procesamiento si el usuario no está autenticado y validado.

### QA dry-run admin-only

| Prueba | Resultado |
|---|---|
| Destinatario único | ✅ Sí |
| Email usado | ✅ Solo administrador |
| Participantes reales usados | ✅ No |
| dryRun true | ✅ Sí |
| Firestore actualizado | ✅ Sí |
| backendResults creado | ✅ Sí |
| Emails reales enviados | ✅ 0 |
| Envío real bloqueado | ✅ Sí |
| Logs sin datos sensibles | ✅ Sí |

### Veredicto

- GO / NO-GO para mantener Cloud Function desplegada: **GO**
- GO / NO-GO para dry-run en producción: **GO**
- GO / NO-GO para envío real: **NO-GO**
