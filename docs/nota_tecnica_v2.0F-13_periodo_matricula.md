# Nota Técnica: Fase 2.0F-13 — Control de Periodo de Matrícula y Acceso Total

## Objetivo
Implementar un sistema de control dinámico y robusto para las nuevas inscripciones y el acceso a la plataforma Docencia 4.0, permitiendo cierres operativos totales basados en fechas.

## Componentes Implementados

### 1. Seguridad de Datos (Firestore Rules)
- **Bloqueo de Escritura**: La creación de nuevos usuarios (`usuarios/{userId}`) está estrictamente supeditada a que `enrollmentIsOpen()` sea verdadero.
- **Bloqueo de Lectura (Cierre Total)**: Se han reforzado las reglas de lectura para `usuarios`, `progresoPaginas` y `progresoModulos`. Ahora, si la matrícula no está abierta, los participantes pierden el acceso a sus datos de forma inmediata a nivel de base de datos.
- **Excepción Administrativa**: El administrador principal (vía UID y Email) mantiene acceso total e ininterrumpido independientemente del estado de la matrícula.

### 2. Control de Acceso en Cliente (`auth-guard.js`)
- **Validación en Tiempo Real**: El guardián de rutas ahora consulta la configuración de matrícula al iniciar sesión.
- **Expulsión Automática**: Si un participante intenta navegar fuera del periodo autorizado, el sistema cierra su sesión (`signOut`) y lo redirige al inicio con un mensaje explicativo generado por el servicio.

### 3. Servicios y Gestión de Datos
- **`enrollment-service.js`**: Centraliza la lógica de evaluación (Open, Closed, Upcoming, Disabled).
- **`admin-configuracion-handler.js`**: Gestiona la persistencia de fechas y estados desde la interfaz administrativa.

### 4. Ajustes Visuales y Experiencia de Usuario
- **Corrección de Toggle**: Se ajustó el CSS de `.toggle-pill` para garantizar el centrado perfecto del indicador visual y evitar desbordamientos.
- **Espaciado (Spacing)**: Se implementó la clase `.form-actions` para eliminar el efecto de "cajas pegadas" entre los campos de entrada y los botones de acción en todo el panel de configuración.
- **Banner de Registro**: Banner dinámico en `registro.html` que informa preventivamente al usuario sobre la disponibilidad del programa.

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
*Archivo generado para el historial de versiones de Docencia 4.0 - Fase 2.0F-13.*
