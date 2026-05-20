# QA — Dashboard Imagen + Audio + Título Actualizado

## 1. Resumen de Cambios Aplicados en dashboard.html
- **Componente Eliminado:** El reproductor de video nativo y su contenedor `<aside class="video-sidebar">`.
- **Componente Nuevo:** Estructura limpia `<div class="dashboard-profile-media">` conteniendo:
  1. Imagen del investigador docente (`assets/imagen_investigador.jpg`).
  2. Reproductor de audio HTML5 nativo (`LLM-DEPR/LLM_intro_dashboard_audioedit.mp3`).
- **Título Actualizado:** El título de la sección se modificó de *"Programa de Formación Profesional en LLM"* a *"Programa de Formación Profesional en LLM y de bots o aplicaciones que los integran"*.
- **Uso de CSS:** Se añadieron estilos locales *in-line* en `<head>` para no afectar `main.css`.

## 2. Validación Funcional y Visual
*(Validación en http://127.0.0.1:5000/dashboard.html)*

- **Estructura del Layout:** 
  - La columna izquierda ahora contiene la imagen, seguida del audio, y debajo, el perfil del investigador intacto.
  - La columna derecha (donde reside el nuevo título largo y los objetivos) mantiene su ancho y flujo originales sin desbordarse ni ser empujada por los nuevos elementos multimedia.
- **Reproducción de Audio y Autoplay:**
  - El atributo `autoplay preload="metadata"` fue integrado exitosamente. 
  - Las políticas de los navegadores (como Chrome/Safari) gestionarán silenciosamente el bloqueo si no hay interacción previa, dejando los controles listos para reproducción manual a voluntad del participante.
- **Responsividad:** 
  - El título ajustado se quiebra de forma natural según el ancho de pantalla.
  - La imagen mantiene la proporción (`object-fit: cover`) y el reproductor de audio aprovecha el 100% del ancho disponible sin rebasar su contenedor.
- **Navegación e Integración:** Scripts de Firebase Auth, seguimiento de progreso y campana de notificaciones siguen operativos sin generar advertencias relacionadas al video retirado.

## 3. Estado de Entorno de Entrega
- El archivo modificado fue **únicamente** `dashboard.html`.
- **No** se modificó el archivo `styles/main.css`.
- **No** se ha realizado deploy.
- **No** se ha iniciado la migración de la Fase B1.
- **No** se ejecutó `git add .` (estamos a la espera de confirmación o commit dirigido).

Todo se encuentra listo y aislado para revisión final.
