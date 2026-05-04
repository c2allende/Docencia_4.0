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

---
*Archivo generado para el historial de versiones de Docencia 4.0 - Fase 2.0F-13 (revisión correctiva).*
