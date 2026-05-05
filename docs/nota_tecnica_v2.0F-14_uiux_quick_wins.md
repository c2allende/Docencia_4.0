# Nota Técnica: Fase 2.0F-14 — Quick Wins UI/UX antes del Congelamiento Estable

## Objetivo

Corregir hallazgos críticos y de alta prioridad identificados en la Auditoría UI/UX Integral de Docencia 4.0, realizada el 2026-05-04, antes de congelar una versión estable de la plataforma. Las correcciones son estrictamente visuales y de microcopy — no se modificó ningún servicio Firebase, regla de Firestore, ni lógica funcional.

## Archivos Modificados

| Archivo | Hallazgos aplicados |
|---------|---------------------|
| `docencia-4.0/recuperar_password.html` | H-01, H-02 |
| `docencia-4.0/index.html` | H-03 |
| `docencia-4.0/admin_foros.html` | H-04, H-23, H-24 |
| `docencia-4.0/registro.html` | H-05, H-11, H-25 |
| `docencia-4.0/admin_usuarios.html` | H-06, H-20 |
| `docencia-4.0/perfil.html` | H-11 |

## Hallazgos Corregidos

### H-01 / H-02 — Microcopy de prototipo en `recuperar_password.html` (Crítico)

**Problema:** La página exponía texto de desarrollo visible al usuario:
- Sidebar: *"cuando Firebase Authentication esté conectado"*
- Paso 2 del proceso: *"Cuando Firebase esté conectado, recibirás un enlace de recuperación en tu email."*

**Corrección:**
- Sidebar actualizado: *"Ingresa el correo electrónico asociado a tu cuenta para recibir instrucciones de recuperación de contraseña."*
- Paso 2 actualizado: *"Revisa tu correo y sigue las instrucciones para restablecer tu contraseña."*
- El único "Firebase" restante en el archivo es un comentario de código (`<!-- Firebase Auth Integration -->`), no visible al usuario.

### H-03 — Tooltips técnicos en botones de login social en `index.html` (Crítico)

**Problema:** Los botones deshabilitados de Google e Institucional tenían atributos `title` con información interna: *"Disponible cuando se configure Google en Firebase Authentication"*.

**Corrección:** Ambos atributos `title` actualizados a `"Próximamente disponible"`. Los botones siguen deshabilitados. La nota informativa `.login-note` sobre activación futura se mantiene como texto institucional válido.

### H-04 — Links a páginas debug en menú de administración en `admin_foros.html` (Crítico)

**Problema:** El sidebar del panel admin exponía un link directo a `debug_clean_board.html` como navegación regular de producción.

**Corrección:** Eliminado el ítem `<li><a href="debug_clean_board.html">🧹 Limpiar Tablero</a></li>` del sidebar. El botón de acción "🧹 Limpiar Board Act. 1.1" en el header del panel se mantiene, ya que es una función administrativa aprobada accesible solo desde ese contexto.

### H-05 / H-25 — Campo "Rol" con select innecesario en `registro.html` (Alto)

**Problema:** El campo roleContext era un `<select>` con una sola opción válida ("Participante") y una opción vacía "Selecciona una opción", generando fricción sin valor funcional.

**Corrección:**
- Reemplazado por `<input type="text" readonly value="Participante">` con estilo visual de campo no editable (`color: muted, cursor: default`).
- Añadido `<input type="hidden" id="roleContext" name="roleContext" value="Participante">` para mantener compatibilidad de formulario.
- Helper text: *"Todos los participantes del programa acceden con este rol."*
- `register-handler.js` no lee `roleContext` del DOM (el valor está hardcodeado en `auth.js`), por lo que no hay cambio funcional.

### H-06 — Panel "Registro de Usuarios" con botones deshabilitados en `admin_usuarios.html` (Alto)

**Problema:** El panel izquierdo de admin_usuarios mostraba botones "Limpiar" y "Añadir usuario" con `opacity: 0.5; pointer-events: none`, sin ninguna explicación, creando percepción de bug o funcionalidad rota.

**Corrección:**
- Eliminados los botones deshabilitados.
- Título actualizado: "Registro de Usuarios" → **"Creación de cuentas"**
- Texto informativo reemplazado: *"La creación inicial de cuentas se gestiona desde el formulario de registro y las reglas de matrícula configuradas en el panel de configuración. Desde este panel puedes activar, inactivar o archivar usuarios existentes."*

### H-11 — Microcopy contradictorio del campo nombre entre páginas (Alto)

**Problema:** `registro.html` decía *"Utiliza tu nombre real. Es necesario escribir nombre completo"* mientras `perfil.html` decía *"Puedes usar un alias o nombre visible."* — instrucciones contradictorias sobre el mismo campo.

**Corrección:** Texto unificado en ambas páginas: *"Utilice su nombre completo para facilitar la identificación institucional dentro del programa."*

### H-20 / QW-5 — Import de CSS con query string en `admin_usuarios.html` (Medio)

**Problema:** `admin_usuarios.html` cargaba `styles/main.css?v=2` mientras todas las demás páginas usaban `styles/main.css`, creando inconsistencia en el cache de estilos.

**Corrección:** Estandarizado a `styles/main.css` sin query string. Los imports de scripts JS con `?v=2` en el mismo archivo son parámetros de cache-busting de JS y están fuera del alcance de esta corrección.

### H-23 / QW-8 — Sidebar sin atributos accesibles en `admin_foros.html` (Bajo)

**Problema:** El `<aside class="module-sidebar">` no tenía `aria-label` ni `aria-hidden`, a diferencia de otros sidebars del sistema.

**Corrección:** Añadido `aria-label="Menú del panel administrativo" aria-hidden="true"` al aside del sidebar.

### H-24 / QW-6 — Alt text del logo incompleto en `admin_foros.html` (Bajo)

**Problema:** `alt="Logo"` en lugar de `alt="Logo Docencia 4.0"`, inconsistente con todas las demás páginas.

**Corrección:** `alt="Logo Docencia 4.0"`.

## Confirmación H-07 — Estado de éxito en recuperar_password.html

**Estado: VALIDADO.** El archivo `reset-password-handler.js` implementa correctamente el estado de éxito:

```javascript
showMessage('Se han enviado las instrucciones a tu correo. Revisa tu bandeja de entrada.', 'success');
```

El mensaje se renderiza vía `authMessage` con clase `auth-message is-visible is-success`. H-07 no requería corrección.

## Confirmación de integridad — Archivos no modificados

Los siguientes archivos **no fueron tocados** en esta fase:

| Categoría | Archivos |
|-----------|----------|
| Seguridad | `firestore.rules` |
| Estilos globales | `docencia-4.0/styles/main.css` |
| Autenticación | `scripts/auth.js`, `scripts/auth-guard.js` |
| Registro | `scripts/register-handler.js` |
| Matrícula | `scripts/enrollment-service.js` |
| Progreso | `scripts/progress-service.js` |
| Foros | `scripts/forum-service.js` |
| Anuncios | `scripts/announcement-service.js` |
| Notificaciones | `scripts/notification-service.js` |
| Configuración admin | `scripts/admin-configuracion-handler.js` |
| Estructura de módulos | Todos los archivos `modulo*.html`, `leccion*.html`, `actividad*.html`, `recursos*.html` |

## QA Realizado

Verificación estática y mediante canal de preview de Firebase Hosting.

**Canal de preview:** `https://docencia-4-lms--qa-uiux-quickwins-vq8m7ej0.web.app`
**Expira:** 2026-05-11

| Escenario | Resultado |
|-----------|-----------|
| A. recuperar_password — sin texto de prototipo visible | ✅ |
| B. index — tooltips sociales sin referencias técnicas a Firebase | ✅ |
| C. admin_foros — debug link removido del sidebar | ✅ |
| C. admin_foros — botón "Limpiar Board Act. 1.1" conservado en el panel | ✅ |
| C. admin_foros — logo alt correcto, sidebar con aria-label | ✅ |
| D. registro — campo Rol sin fricción, valor Participante fijo | ✅ |
| D. registro — `register-handler.js` no lee roleContext del DOM | ✅ |
| E. admin_usuarios — panel informativo sin botones rotos | ✅ |
| E. admin_usuarios — CSS sin `?v=2` | ✅ |
| F. perfil — helper text del nombre consistente con registro | ✅ |
| G. H-07 validado: reset-password-handler muestra estado de éxito | ✅ |
| G. Reglas Firestore intactas | ✅ |
| G. Servicios Firebase intactos | ✅ |

## Hallazgos Diferidos (próxima versión)

Los siguientes hallazgos de la Auditoría Integral quedan pendientes para la siguiente iteración de mejoras:

| ID | Severidad | Descripción |
|----|-----------|-------------|
| H-08 | Alto | Admin link en dashboard detectado por email hardcodeado — usar `role === "admin"` del perfil Firestore |
| H-09 | Alto | Navegación inconsistente: dashboard usa header inline, módulos usan sidebar. Requiere reestructura del dashboard |
| H-10 | Alto | Botón "Reenviar verificación" siempre visible — mostrar condicionalmente según `emailVerified` |
| H-12 | Medio | Inline styles en botones de admin_foros — migrar a clases CSS |
| H-13 | Medio | Confirmación de purga en admin_foros — verificar que el modal JS cumple o añadir doble confirmación |
| H-14 | Medio | Variables CSS locales en leccion1_1.html con colores hardcodeados fuera del sistema de tokens |
| H-15 | Medio | `resolveAssetPath()` duplicado en 8+ páginas — extraer a módulo JS compartido |
| H-16 | Medio | Emojis en dashboard (notificaciones, breakdown) inconsistentes con SVGs del resto de la UI |
| H-17 | Medio | Métricas admin en tablet: grid de 4 columnas sin breakpoint intermedio |
| H-18 | Medio | Sin breadcrumb ni indicador de posición en módulos/lecciones |
| H-19 | Medio | Status items en perfil.html con hover de elevación — son elementos display, no interactivos |
| H-21 | Medio | Estado vacío en foros no definido |
| H-22 | Bajo | `.sr-only` definido localmente en múltiples páginas — migrar a main.css |
| H-26 | Bajo | Sin estado de error en dashboard si Firestore no responde al cargar módulos |
| H-27 | Obs. | Botones sociales deshabilitados visibles — evaluar ocultarlos hasta que estén disponibles |
| H-28 | Obs. | Progress bar con opacity 0.6 — documentar en tokens si es intencional |
| H-29 | Obs. | Opción "Observador" en perfil.html no existe en registro.html |
| H-30 | Obs. | Admin sin atajo "Ver como participante" en el topnav |

## Nota sobre modulo1_intro.html

El working tree incluye un cambio preexistente en `docencia-4.0/modulo1_intro.html` (adición del link a `actividad1_2.html` en el sidebar del módulo 1) que no forma parte de esta fase. Debe ser incluido o excluido del commit deliberadamente según la decisión del administrador del proyecto.

## Recomendación para Próxima Versión

**Prioridad 1 (antes de siguiente lanzamiento funcional):**
H-08 (admin link por role), H-09 (unificación de sistema de navegación), H-13 (confirmar modal de purga).

**Prioridad 2 (sprint de pulido UX):**
H-10, H-14, H-15, H-17, H-18, H-19.

**Prioridad 3 (deuda técnica menor):**
H-16, H-22, H-26, H-29.

La unificación del sistema de navegación (H-09) es el cambio estructural más importante pendiente para una experiencia cohesiva. Se recomienda abordarla como el primer ítem de la siguiente fase de UI.

---

## Commit recomendado (post QA producción)

```bash
git add docencia-4.0/recuperar_password.html \
        docencia-4.0/index.html \
        docencia-4.0/admin_foros.html \
        docencia-4.0/registro.html \
        docencia-4.0/admin_usuarios.html \
        docencia-4.0/perfil.html \
        docs/nota_tecnica_v2.0F-14_uiux_quick_wins.md

git commit -m "feat(2.0F-14): quick wins UI/UX antes del congelamiento estable

Correcciones H-01, H-02, H-03, H-04, H-05, H-06, H-11, H-20, H-23, H-24, H-25.
Sin modificaciones a reglas Firestore ni servicios Firebase.
H-07 validado en reset-password-handler.js.
Canal QA: qa-uiux-quickwins (exp. 2026-05-11).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git tag v2.0F-14
```

---

*Nota Técnica generada para el historial de versiones de Docencia 4.0 — Fase 2.0F-14. Archivada: 2026-05-04.*
