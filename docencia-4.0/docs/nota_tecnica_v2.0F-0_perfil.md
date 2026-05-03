# Nota Técnica v2.0F-0: Corrección Funcional de Mi Perfil
**Fecha de Cierre:** 2026-05-02
**Estado:** Finalizado y Desplegado

## 1. Objetivo
Corregir las inconsistencias de la página Mi Perfil y conectar sus secciones a datos reales de Firebase Auth y Firestore, eliminando la dependencia de placeholders estáticos.

## 2. Problemas Detectados y Resueltos
- **Placeholders estáticos:** La página mostraba datos de ejemplo que confundían al usuario.
- **Inconsistencia de Rol:** El rol variaba entre secciones. Ahora Firestore es la única fuente de verdad.
- **Estado de Sesión:** Siempre aparecía como "Sesión pendiente". Ahora refleja el estado real de Auth.
- **Script Conflictivo:** Un script antiguo sobrescribía los datos reales con valores estáticos tras la carga.

## 3. Archivos Modificados
- `perfil.html`: Limpieza de placeholders y eliminación de script vanilla conflictivo.
- `scripts/profile-handler.js`: Reescritura completa para conexión Auth/Firestore.
- `scripts/auth.js`: Actualización de `registerUser` para soportar `displayName`.
- `scripts/register-handler.js`: Captura de nombre visible en el flujo de registro.

## 4. Arquitectura de Datos (Fuentes Finales)
- **displayName:** Firestore (`usuarios/{uid}.displayName`) con fallback a `auth.currentUser.displayName`.
- **email:** Firebase Auth (`currentUser.email`).
- **emailVerified:** Firebase Auth (`currentUser.emailVerified`).
- **role:** `usuarios/{uid}.role` en Firestore.
- **roleContext:** `usuarios/{uid}.roleContext` en Firestore.
- **Último acceso:** `auth.currentUser.metadata.lastSignInTime`.

## 5. Seguridad y Reglas de Negocio
- **Solo Lectura:** Email, Rol y Status están bloqueados para edición por el usuario.
- **Campos Editables:** El usuario solo puede modificar `displayName` y `roleContext`.
- **Restricción de Rol:** Un participante no puede elevar sus privilegios a `admin`. El sistema valida el rol en cada carga y guardado.
- **Contextos Permitidos:** `roleContext` limitado a "Participante" u "Observador" según requerimiento.

## 6. QA Realizado
- ✅ Verificación exitosa de perfil Administrador (visualización de controles operativos).
- ✅ Verificación exitosa de perfil Participante (acceso restringido).
- ✅ Prueba de guardado de cambios y persistencia tras recarga.
- ✅ Prueba de registro de nuevo usuario: el `displayName` se propaga correctamente al perfil.
- ✅ Inspección de consola: 0 errores, 0 fallos de permisos (Permission Denied).

## 7. Limitaciones
- Los usuarios creados antes de esta fase sin `displayName` deben actualizarlo manualmente en Mi Perfil para que aparezca en lugar del fallback.
- La verificación de email depende exclusivamente del estado gestionado por Firebase Auth.
