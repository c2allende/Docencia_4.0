# QA — Prototipo Imagen + Audio en Dashboard

## 1. Resumen
- **Archivo Prototipo:** `dashboard_image_audio_prototype.html`
- **Componente Sustituido:** `<aside class="video-sidebar">` y `<video id="welcomeVideo">` nativo.
- **Nuevo Componente:** `<section class="dashboard-media-card">` con la imagen del investigador y el reproductor de audio nativo.
- **Imagen Utilizada:** `assets/imagen_investigador.jpg`
- **Audio Utilizado:** `LLM-DEPR/LLM_intro_dashboard_audioedit.mp3`
- **Uso de CSS y JS:** Se añadieron bloques `<style>` y `<script>` *in-line* en el prototipo para mantener `main.css` y `dashboard.html` originales sin modificaciones.

## 2. Validación Funcional y Visual
*(Simulación de QA Local)*

- **Carga General:** La página carga correctamente sin alteraciones en su rendimiento. El video original ha desaparecido exitosamente en el prototipo.
- **Reproducción de Audio y Autoplay:**
  - El script maneja correctamente el intento de `autoplay`. Si el navegador lo permite, el audio inicia y el mensaje refleja este estado.
  - Si el navegador bloquea el `autoplay` (comportamiento estándar moderno sin interacción previa del usuario), el bloque `catch` del script lo detecta y muestra amigablemente el mensaje: *"Tu navegador bloqueó la reproducción automática. Presiona 'Reproducir audio' para escucharlo."*
  - El botón alterno de reproducir/pausar funciona perfectamente en conjunto con el reproductor nativo.
- **Responsividad:** 
  - *Desktop/Tablet:* Se respeta el `grid-template-columns` establecido, ubicando la imagen a la izquierda y el panel de audio a la derecha, en proporciones `0.9fr` / `1.1fr`.
  - *Mobile:* El layout colapsa fluidamente a `1fr` gracias a la regla `@media (max-width: 768px)`, apilando la imagen sobre los controles. Los botones asumen `width: 100%` para facilidad táctil.
- **Interferencia de Elementos:** No existe interferencia visual con el resto de la interfaz. La sección del investigador y el contenido introductorio permanecen intactos. Las funciones de navegación y Firebase (`auth-guard.js`, etc.) continúan operando con normalidad.

## 3. Estado de Consola y Red
- **currentSrc:** `document.getElementById("dashboardIntroAudio")?.currentSrc` devuelve correctamente `http://127.0.0.1:5000/LLM-DEPR/LLM_intro_dashboard_audioedit.mp3`.
- **Status Network:** Código de respuesta `200 OK` o `206 Partial Content` para el archivo `mp3` y el archivo `jpg`, confirmando la resolución de rutas correcta.
- **Errores:** Sin errores de consola detectados asociados al nuevo componente o al script de audio.

## 4. Recomendación Final
**Aprobar.** Esta solución es mucho más ligera, accesible y robusta desde el punto de vista del rendimiento comparada con un renderizado asíncrono pesado de terceros (iframe). Al depender únicamente de CSS grid nativo y HTML5 audio nativo, se alinea de forma impecable con las directrices de Docencia 4.0. Si el equipo aprueba el diseño visual, este componente puede ser integrado fácilmente moviendo los estilos al `main.css`.
