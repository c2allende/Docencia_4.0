/**
 * admin-access-handler.js
 * Conecta los toggles del admin_dashboard.html y admin_accesos.html a Firestore.
 * Reemplaza el sistema localStorage + visual puro.
 * v1.0.0 — Microfase 2.0F-1
 *
 * Uso en admin_dashboard.html:
 *   <script type="module" src="scripts/admin-access-handler.js"></script>
 *
 * Cada toggle debe tener:
 *   data-module-id="modulo1"
 *   data-section="lecciones"
 */

import { subscribeModuleAccessConfig, updateModuleAccess } from './module-access-service.js';

// ─── Feedback discreto ────────────────────────────────────────────────────────
function showFeedback(message, type = 'success') {
    // Buscar o crear un elemento de feedback
    let fb = document.getElementById('accessFeedback');
    if (!fb) {
        fb = document.createElement('div');
        fb.id = 'accessFeedback';
        fb.setAttribute('role', 'status');
        fb.setAttribute('aria-live', 'polite');
        fb.style.cssText = [
            'position:fixed',
            'bottom:1.5rem',
            'right:1.5rem',
            'z-index:9000',
            'padding:.6rem 1.25rem',
            'border-radius:9999px',
            'font-size:.8rem',
            'font-weight:700',
            'opacity:0',
            'transition:opacity .3s',
            'pointer-events:none',
        ].join(';');
        document.body.appendChild(fb);
    }

    fb.textContent = message;
    fb.style.background = type === 'success'
        ? 'var(--color-brand-primary,#6366f1)'
        : 'var(--color-error,#ef4444)';
    fb.style.color = '#fff';
    fb.style.opacity = '1';

    clearTimeout(fb._timeout);
    fb._timeout = setTimeout(() => { fb.style.opacity = '0'; }, 2500);
}

// ─── Aplicar estado al toggle (sin disparar eventos) ─────────────────────────
function applyToggleState(toggle, value) {
    toggle.setAttribute('aria-pressed', String(value));
}

// ─── Inicializar todos los toggles de la página ───────────────────────────────
export function initAccessToggles() {
    const toggles = document.querySelectorAll('.toggle-pill[data-module-id][data-section]');
    if (!toggles.length) return;

    // Suscribirse a Firestore en tiempo real
    const unsubscribe = subscribeModuleAccessConfig((config) => {
        toggles.forEach((toggle) => {
            const moduleId  = toggle.dataset.moduleId;
            const section   = toggle.dataset.section;
            const moduleCfg = config[moduleId];
            if (!moduleCfg) return;
            applyToggleState(toggle, moduleCfg[section] !== false);
        });
    });

    // Escuchar clics en los toggles
    toggles.forEach((toggle) => {
        toggle.addEventListener('click', async () => {
            const moduleId = toggle.dataset.moduleId;
            const section  = toggle.dataset.section;
            const current  = toggle.getAttribute('aria-pressed') === 'true';
            const newValue = !current;

            // Actualizar UI inmediatamente (optimistic update)
            applyToggleState(toggle, newValue);
            toggle.disabled = true;

            try {
                await updateModuleAccess(moduleId, section, newValue);
                showFeedback(`${moduleId} › ${section}: ${newValue ? 'Activado' : 'Desactivado'}`, 'success');
            } catch (err) {
                // Revertir si falla
                applyToggleState(toggle, current);
                showFeedback('Error al guardar. Verifica permisos.', 'error');
                console.error('[admin-access-handler] Error al actualizar:', err);
            } finally {
                toggle.disabled = false;
            }
        });
    });

    return unsubscribe;
}
