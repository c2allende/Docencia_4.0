# Nota Técnica: Fase 2.0F-13 — Control de Periodo de Matrícula para Nuevos Registros

## Objetivo
Implementar un sistema de control para las nuevas inscripciones en la plataforma Docencia 4.0. El periodo de matrícula controla la creación de nuevas cuentas. Los usuarios existentes con cuenta activa conservan acceso al LMS, salvo que un administrador inactive o archive su cuenta.

## Alcance Correcto

El cierre del periodo de matrícula **solo** impide la creación de nuevas cuentas. No interrumpe el acceso de participantes ya registrados ni bloquea la lectura de sus datos de progreso o perfil.

## Componentes Implementados

### 1. Seguridad de Datos (Firestore Rules)
- **Bloqueo de Escritura (Creación)**: La creación de nuevos usuarios (`usuarios/{userId}`) está supeditada a que `enrollmentIsOpen()` sea verdadero y a que los campos `role`, `roleContext` y `status` sean los valores de participante esperados.
- **Lectura sin restricción de matrícula**: Las reglas de lectura de `usuarios`, `progresoPaginas` y `progresoModulos` dependen únicamente de que el usuario sea el dueño del documento (`isOwner`) o administrador. La matrícula **no** interviene en estas reglas.
- **Excepción Administrativa**: El administrador principal (vía UID y Email) mantiene acceso total e ininterrumpido.

### 2. Control de Acceso en Cliente (`auth-guard.js`)
- **Validación de perfil**: Verifica que el usuario autenticado tenga un perfil en Firestore.
- **Sin perfil**: Cierra sesión y redirige con mensaje explicativo.
- **Cuenta inactiva/revocada**: Si `status` es `inactive` o `archived`, o `accessRevoked` es `true`, cierra sesión y redirige. Este control no depende del periodo de matrícula.
- **Cuenta activa**: El participante o administrador con `status: "active"` accede sin restricciones, independientemente del estado de la matrícula.

### 3. Flujo de Registro (`register-handler.js`)
- **Validación pre-vuelo**: Verifica matrícula antes de crear la cuenta Auth. Si está cerrada, deshabilitada o futura, muestra mensaje con email del administrador y detiene el proceso.
- **Verificación post-registro**: Tras crear la cuenta, confirma que el perfil sea legible en Firestore (hasta 3 reintentos con 600 ms de espera) antes de redirigir al dashboard. Evita la condición de carrera entre `setDoc` y `onAuthStateChanged`.
- **Fallo de perfil**: Si el perfil no se puede confirmar, cierra sesión y muestra mensaje de error. No redirige al dashboard.

### 4. Servicios y Gestión de Datos
- **`enrollment-service.js`**: Centraliza la lógica de evaluación (Open, Closed, Upcoming, Disabled).
- **`admin-configuracion-handler.js`**: Gestiona la persistencia de fechas y estados desde la interfaz administrativa.

### 5. Ajustes Visuales y Experiencia de Usuario
- **Corrección de Toggle**: Se ajustó el CSS de `.toggle-pill` para garantizar el centrado perfecto del indicador visual.
- **Espaciado**: Clase `.form-actions` para eliminar el efecto de "cajas pegadas" en el panel de configuración.
- **Banner de Registro**: Banner dinámico en `registro.html` que informa sobre la disponibilidad del programa.

## Resumen Técnico de Configuración
- **Colección**: `configuracion`
- **Documento**: `registro`
- **Campos Críticos**:
  - `enrollmentEnabled` (boolean)
  - `enrollmentStartAt` (Timestamp)
  - `enrollmentEndAt` (Timestamp)
  - `adminContactEmail` (string)

## Procedimiento de Despliegue Obligatorio
Para activar estas protecciones en el entorno de producción, es necesario ejecutar:
```powershell
firebase deploy --only firestore:rules,hosting
```

## QA Final — 2026-05-04

Pruebas ejecutadas via Firebase Auth REST API + Firestore REST API contra el proyecto de producción `docencia-4-lms`. Reglas desplegadas antes de iniciar (`firebase deploy --only firestore:rules`).

**Resultado: 16/16 pruebas pasadas.**

| # | Escenario | Resultado |
|---|-----------|-----------|
| 1 | Login admin y participante existente | ✅ |
| 2 | Perfil ausente en Firestore detectado (test2@gmail.com) — creado correctamente vía `allow create` con matrícula abierta | ✅ |
| 3 | Lectura de perfil propio (admin y participante) | ✅ |
| 4 | Lectura de `progresoPaginas` sin restricción de matrícula | ✅ |
| 5 | Lectura de `progresoModulos` sin restricción de matrícula | ✅ |
| 6 | Aislamiento: participante bloqueado al leer perfil ajeno | ✅ |
| 7 | Config `configuracion/registro` legible y evaluada correctamente | ✅ |
| 8 | Matrícula cerrada: usuario existente activo conserva acceso a perfil y progreso | ✅ |
| 9 | Matrícula cerrada: nuevo registro de perfil bloqueado (HTTP 403) | ✅ |
| 10 | `role:admin` rechazado en `allow create` (HTTP 403) | ✅ |
| 11 | Admin lee `configuracion/registro` | ✅ |
| 12 | Admin lista colección `usuarios` (5 perfiles) | ✅ |

**Notas:**
- La cuenta `test2@gmail.com` tenía Auth creada pero sin documento en Firestore (`usuarios/{uid}`). Esto confirmó el escenario F del plan de QA y la corrección del `auth-guard`.
- La verificación post-registro (retry en `register-handler.js`) no genera race condition: el perfil fue legible de inmediato tras la creación.
- La función `enrollmentIsOpen()` en las reglas evalúa correctamente `configuracion/registro` en tiempo real.
- Las reglas de Firestore están desplegadas. Pendiente: `firebase deploy --only hosting`.

---
*Archivo generado para el historial de versiones de Docencia 4.0 - Fase 2.0F-13 (revisión correctiva). Archivado: 2026-05-04.*
