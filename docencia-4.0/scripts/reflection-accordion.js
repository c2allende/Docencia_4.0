/**
 * Reflection Accordion Controller with Contextual Auto-close
 * Maneja la lógica de expansión/contracción y cierre automático por visibilidad.
 * Cumple con estándares de accesibilidad ARIA y preferencias de movimiento.
 */

document.addEventListener('DOMContentLoaded', () => {
    initReflectionAccordions();
});

function initReflectionAccordions() {
    const accordions = document.querySelectorAll('[data-reflection-accordion]');

    accordions.forEach(accordion => {
        const toggle = accordion.querySelector('[data-reflection-toggle]');
        const panel = accordion.querySelector('[data-reflection-panel]');
        const actionText = accordion.querySelector('[data-reflection-action]');

        if (!toggle || !panel || !actionText) return;

        const textOpen = "Ocultar orientación";
        const textClosed = "Ver orientación completa";

        // Función para cerrar el acordeón
        const closeAccordion = () => {
            if (toggle.getAttribute('aria-expanded') === 'true') {
                toggle.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                actionText.textContent = textClosed;
            }
        };

        // Evento de clic manual
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;

            toggle.setAttribute('aria-expanded', newState);
            panel.setAttribute('aria-hidden', !newState);
            actionText.textContent = newState ? textOpen : textClosed;
        });

        // Lógica de Auto-cierre Contextual con IntersectionObserver
        const observerOptions = {
            threshold: 0.25 // Se activa cuando menos del 25% es visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el componente ya no es suficientemente visible
                if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
                    // Solo cerrar si está abierto y el foco NO está dentro
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    const isFocusInside = accordion.contains(document.activeElement);

                    if (isExpanded && !isFocusInside) {
                        closeAccordion();
                    }
                }
            });
        }, observerOptions);

        observer.observe(accordion);
    });
}
