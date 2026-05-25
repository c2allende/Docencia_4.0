/**
 * Prototipo: Espacio de Consentimiento, Preprueba y Postprueba
 * 
 * NOTA PARA FUTURA PRODUCCIÓN:
 * En producción real, la configuración de 'researchAccessState' debe provenir 
 * de Firestore (e.g. 'configuracionInvestigacion/accesos'), y este panel de
 * simulación debe ser reemplazado por un panel de administración real (admin_dashboard).
 * Los participantes solo leerán el estado habilitado, no podrán cambiarlo.
 */

const researchAccessState = {
  consentPretest: {
    enabled: false,
    title: 'Consentimiento informado y preprueba',
    description: 'Disponible durante la sesión presencial según las indicaciones del investigador. Complete este paso solo después de recibir la orientación sobre la investigación.',
    url: 'PENDIENTE_ENLACE_CONSENTIMIENTO_PREPRUEBA',
    buttonLabel: 'Acceder al consentimiento y preprueba'
  },
  posttest: {
    enabled: false,
    title: 'Postprueba',
    description: 'Disponible cuando el investigador indique que corresponde completar la medición posterior del estudio.',
    url: 'PENDIENTE_ENLACE_POSTPRUEBA',
    buttonLabel: 'Acceder a la postprueba'
  }
};

function renderResearchAccess() {
    const container = document.getElementById('researchAccessSection');
    if (!container) return;

    if (!researchAccessState.consentPretest.enabled && !researchAccessState.posttest.enabled) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    
    let html = `
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <p style="color: var(--color-text-body); max-width: 800px; margin-top: 8px;">Accesos habilitados por el investigador para completar el consentimiento, la preprueba y la postprueba del estudio.</p>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota importante:</strong> Complete estos formularios únicamente cuando el investigador lo indique. Si tiene preguntas sobre la investigación, consulte al investigador antes de continuar.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    `;

    if (researchAccessState.consentPretest.enabled) {
        html += buildCard(researchAccessState.consentPretest);
    }
    
    if (researchAccessState.posttest.enabled) {
        html += buildCard(researchAccessState.posttest);
    }

    html += `</div>`;
    container.innerHTML = html;
}

function buildCard(item) {
    const btnHtml = item.url.startsWith('PENDIENTE') 
        ? `<button class="btn btn-primary" onclick="alert('Enlace pendiente de configuración: ${item.url}')" style="margin-top: auto; align-self: flex-start;">${item.buttonLabel}</button>`
        : `<a href="${item.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top: auto; align-self: flex-start;">${item.buttonLabel}</a>`;

    return `
        <article class="research-access-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
            <div style="margin-bottom: 12px;">
                <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">Disponible</span>
            </div>
            <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
            <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">${item.description}</p>
            ${btnHtml}
        </article>
    `;
}

// Simulación de control
function setupSimulationPanel() {
    const simPretest = document.getElementById('sim-consent');
    const simPosttest = document.getElementById('sim-posttest');
    const updateBtn = document.getElementById('sim-update-btn');

    if (!simPretest || !simPosttest || !updateBtn) return;

    // init state
    simPretest.checked = researchAccessState.consentPretest.enabled;
    simPosttest.checked = researchAccessState.posttest.enabled;

    updateBtn.addEventListener('click', () => {
        researchAccessState.consentPretest.enabled = simPretest.checked;
        researchAccessState.posttest.enabled = simPosttest.checked;
        renderResearchAccess();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderResearchAccess();
    setupSimulationPanel();
});
