# Plan Backend Seguro — Comunicaciones Docencia 4.0

## Objetivo

Operacionalizar envío real de emails desde backend seguro.

## No se modifica

- firebase-config.js
- auth.js
- progress-tracker.js
- styles/main.css
- contenido académico
- reglas Firestore existentes sin revisión separada

## Arquitectura

Frontend admin_comunicaciones.html → callable Cloud Function → proveedor de email → Firestore status update.

## Función propuesta

sendCommunicationEmail

## Modo inicial

dryRun: true por defecto.

## Pruebas iniciales

Solo destinatarios controlados:

- email del administrador autenticado
- carmelo.allende@upr.edu
- otro email de prueba autorizado por el usuario

## Salida esperada

Registro por destinatario:

- queued
- sent
- failed
- skipped
