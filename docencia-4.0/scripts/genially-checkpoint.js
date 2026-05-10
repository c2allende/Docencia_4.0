/**
 * Genially Checkpoint Integration - Docencia 4.0
 * Patrón V3: Carga progresiva e integración interna
 * (Test comment)
 */
document.addEventListener('DOMContentLoaded', () => {
    const checkpoints = document.querySelectorAll('[data-genially-checkpoint]');
    
    checkpoints.forEach(checkpoint => {
        const toggleBtn = checkpoint.querySelector('[data-genially-toggle]');
        const panel = checkpoint.querySelector('[data-genially-panel]');
        const iframe = panel ? panel.querySelector('iframe') : null;
        
        if (!toggleBtn || !panel || !iframe) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Ocultar
                toggleBtn.setAttribute('aria-expanded', 'false');
                panel.hidden = true;
                toggleBtn.textContent = 'Realizar checkpoint aquí';
            } else {
                // Mostrar
                toggleBtn.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
                toggleBtn.textContent = 'Ocultar checkpoint';
                
                // Carga diferida (Lazy Load)
                if (iframe.src === 'about:blank' || !iframe.src) {
                    const embedUrl = iframe.getAttribute('data-src');
                    if (embedUrl) {
                        iframe.src = embedUrl;
                    }
                }
            }
        });
    });
});
