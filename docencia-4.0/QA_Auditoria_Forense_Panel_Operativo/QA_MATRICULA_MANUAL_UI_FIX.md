# QA — Matrícula Manual UI Fix

## Estado

QA: **APROBADO**

## Cambios realizados

### admin_dashboard.html
- Rediseño completo de la tarjeta `.manual-enrollment-card` con CSS encapsulado
- Formulario en grid de 2 columnas (Nombre/Apellidos) + Email a ancho completo
- Inputs con `min-height: 64px`, foco con anillo cyan institucional
- Aviso de matrícula con diseño de nota (border naranja suave)
- Botón "Matricular participante" con `min-width: 320px`, `min-height: 58px`
- Resultado de éxito con tarjeta institucional cyan/slate (sin verde)
- Caja de contraseña temporal con fondo amarillo suave y advertencia
- Botón "Copiar contraseña" en cyan institucional (`var(--color-brand-primary)`)
- Responsive: todo a 1 columna en móvil

### admin-dashboard-handler.js
- Renderizado del resultado de éxito con estructura semántica:
  - Header con icono check cyan + título + descripción
  - Summary grid (Email / Nombre)
  - Password box con código monospace + botón copiar
  - Aviso de seguridad e instrucción
- Evento de copia al portapapeles

## No modificado
- `styles/main.css`
- `firebase-config.js`
- `functions/index.js`
- Lógica de creación de usuario
- Flujo de cambio obligatorio de contraseña
- Módulos, lecciones, actividades, foros, chatbot, comunicaciones

## Verificación
- [x] Matrícula manual crea usuario en Authentication
- [x] Se genera contraseña temporal
- [x] UI muestra contraseña con botón copiar
- [x] mustChangePassword: true en Firestore
- [x] Login redirige a cambiar_password.html
- [x] Cambio de contraseña obligatorio funciona
- [x] Post-cambio accede al Dashboard
- [x] Sin verde no institucional
- [x] Identidad visual Docencia 4.0 preservada
