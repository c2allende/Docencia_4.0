# Nota Técnica — Microfase 2.0F-1
## Control Real de Accesos por Módulo
**Fecha de cierre:** 2026-05-02  
**Estado:** ✅ Implementado — Pendiente QA en entorno real y deploy

---

## 1. Objetivo

Convertir el control de accesos por módulo de prototipo visual/localStorage a una funcionalidad real conectada a Firestore, sincronizada entre panel rápido (`admin_dashboard.html`) y Configuración detallada (`admin_accesos.html`), y aplicada a la vista del participante mediante un guard en las páginas de módulos.

---

## 2. Arquitectura Implementada

### Ruta Firestore: `configuracion/modulos`

```json
{
  "modulo1": { "lecciones": true, "actividades": true, "foros": true, "recursos": true },
  "modulo2": { "lecciones": true, "actividades": true, "foros": true, "recursos": true },
  "modulo3": { "lecciones": true, "actividades": true, "foros": true, "recursos": true },
  "updatedAt": "<serverTimestamp>",
  "updatedBy": "<uid_admin>"
}
```

- Si el documento **no existe**: todos los sistemas usan defaults `all: true` (no bloquea).
- Si un campo falta dentro del módulo: se aplica merge con defaults (no bloquea por omisión).

---

## 3. Archivos Creados

| Archivo | Descripción |
|---|---|
| `scripts/module-access-service.js` | Servicio centralizado de lectura/escritura en Firestore |
| `scripts/module-access-guard.js` | Guard de acceso para páginas de módulo (participantes) |
| `scripts/admin-access-handler.js` | Handler de toggles en paneles admin |

---

## 4. Archivos Modificados

| Archivo | Cambio |
|---|---|
| `firestore.rules` | Añadida regla para `configuracion/{docId}` |
| `admin_dashboard.html` | Añadidos `data-module-id` y `data-section` a todos los toggles; inyectado `admin-access-handler.js`; eliminado script vanilla de `aria-pressed` |
| `admin_accesos.html` | Reemplazado localStorage por `subscribeModuleAccessConfig` + `updateModuleAccess`; eliminado código legacy |
| `modulo1_intro.html`, `modulo2_intro.html`, `modulo3_intro.html` | Guard inyectado |
| `leccion1_1.html` … `leccion3_4.html` (10 archivos) | Guard inyectado |
| `actividad1_1.html`, `actividad1_2.html`, `actividad2_1.html`, `actividad3_1.html` | Guard inyectado |
| `foro_modulo1.html`, `foro_modulo2.html`, `foro_modulo3.html` | Guard inyectado |
| `recursos_m1.html`, `recursos_m2.html`, `recursos_m3.html` | Guard inyectado |

**Total páginas con guard activo: 22**

---

## 5. Mapeo `data-page-type` → Sección de Control

Basado en inspección directa de los `data-page-type` reales en los 22 archivos afectados:

| `data-page-type` | Sección en Firestore | Páginas afectadas |
|---|---|---|
| `intro` | `lecciones` | modulo1_intro, modulo2_intro, modulo3_intro |
| `leccion` | `lecciones` | leccion1_1 … leccion3_4 (10) |
| `actividad` | `actividades` | actividad1_1, 1_2, 2_1, 3_1 |
| `foro` | `foros` | foro_modulo1, 2, 3 |
| `recursos` | `recursos` | recursos_m1, m2, m3 |

---

## 6. Reglas Firestore Añadidas

```javascript
match /configuracion/{docId} {
  allow get, list: if signedIn();
  allow create, update: if isAdmin() && docId == "modulos";
  allow delete: if false;
}
```

Usa las funciones existentes `signedIn()` e `isAdmin()` del bloque de seguridad del proyecto.  
`isAdmin()` verifica: `request.auth != null` + rol `admin` + status `active` en `/usuarios/{uid}`.

---

## 7. Sincronización Panel Rápido ↔ Configuración Detallada

Ambos paneles usan **la misma suscripción** `subscribeModuleAccessConfig(callback)` que activa `onSnapshot` en Firestore.

- **Escritura**: `updateModuleAccess(moduleId, sectionKey, value)` → `setDoc(..., { merge: true })`
- **Lectura en tiempo real**: `onSnapshot` propaga cambios a todos los paneles abiertos simultáneamente
- **Sincronización bidireccional**: ✅ cambiar en uno se refleja inmediatamente en el otro

---

## 8. Comportamiento del Guard

**Para participantes:**
1. El guard lee `body.dataset.moduleId` y `body.dataset.pageType`
2. Mapea `pageType` → sección
3. Consulta `configuracion/modulos` en Firestore
4. Si `false`: muestra overlay bloqueador, oculta `main`
5. Si `true` o ausente: deja cargar normalmente

**Para admin:**
- Si la sección está bloqueada pero el usuario es admin: muestra banner amarillo discreto
- El contenido es visible (permite QA y mantenimiento)

**Páginas sin `data-module-id`**: el guard no actúa (login, perfil, anuncios, dashboard, admin pages — protegidas por otros guards)

---

## 9. Comportamiento Ante Errores

| Situación | Comportamiento |
|---|---|
| Firestore inalcanzable | Defaults `all: true` — no bloquea |
| Documento no existe | Defaults `all: true` — no bloquea |
| Campo de módulo ausente | Merge con defaults — no bloquea |
| Error de escritura | Optimistic update revertido + mensaje de error |

---

## 10. QA Planificado (pendiente de ejecución en entorno)

### A. Persistencia admin
- [ ] Cambiar Módulo 1 › Lecciones a `false`
- [ ] Recargar `admin_dashboard.html`
- [ ] Confirmar que toggle sigue en `false`

### B. Sincronización paneles
- [ ] Cambiar Módulo 2 › Actividades desde `admin_accesos.html`
- [ ] Abrir `admin_dashboard.html`
- [ ] Confirmar mismo valor

### C. Acceso participante bloqueado
- [ ] Apagar Módulo 3 › Lecciones
- [ ] Entrar como participante → intentar `leccion3_1.html`
- [ ] Confirmar overlay de bloqueo con botón "Volver al Dashboard"
- [ ] Reactivar → confirmar acceso restaurado

### D. URL directa
- [ ] Copiar URL de lección bloqueada
- [ ] Pegar sin navegar desde dashboard
- [ ] Confirmar bloqueo por guard

### E. Seguridad (intento de escritura como participante)
- [ ] `await setDoc(doc(db, 'configuracion/modulos'), {...})` desde consola como participante
- [ ] Debe retornar `FirebaseError: permission-denied`

### F. Regresión
- [ ] Login funciona
- [ ] Dashboard participante funciona
- [ ] Progreso no afectado
- [ ] Foros no afectados
- [ ] Anuncios no afectados
- [ ] Notificaciones no afectadas
- [ ] admin_progreso, admin_foros, admin_anuncios cargan
- [ ] Sin errores de consola en páginas sin guard

---

## 11. Pendiente / Notas

- **`admin_accesos.html`**: el código legacy de localStorage quedó fuera del cierre `</html>` (líneas 899+). Los navegadores lo ignoran al ser texto fuera del árbol HTML. Puede limpiarse con: `Get-Content .\admin_accesos.html | Select-Object -First 898 | Set-Content .\admin_accesos.html`
- **Deploy**: NO desplegado todavía. Requiere QA local confirmado.

