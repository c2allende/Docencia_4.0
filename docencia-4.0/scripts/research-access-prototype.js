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
    key: 'consentPretest',
    title: 'Consentimiento informado y preprueba',
    typeLabel: 'Formulario externo',
    statusLabel: 'Disponible cuando el investigador lo habilite',
    description:
      'Complete este formulario únicamente después de recibir la orientación presencial del investigador sobre los detalles de la investigación. El consentimiento informado y la preprueba se encuentran en el mismo enlace.',
    url: 'https://forms.gle/TCx5has4pBDRQQQ57',
    buttonLabel: 'Acceder al consentimiento y preprueba',
    ethicalNote:
      'Su participación es voluntaria. Si decide no participar, no debe completar la preprueba.'
  },

  posttest: {
    enabled: false,
    key: 'posttest',
    title: 'Postprueba',
    typeLabel: 'Formulario externo',
    statusLabel: 'Disponible cuando el investigador lo habilite',
    description:
      'Este acceso será habilitado por el investigador al finalizar la experiencia formativa, cuando corresponda completar la medición posterior del estudio.',
    url: 'https://forms.gle/of3qAs9kYcW4yZS36',
    buttonLabel: 'Acceder a la postprueba',
    ethicalNote:
      'Complete la postprueba únicamente cuando el investigador indique que corresponde hacerlo.'
  },

  focusGroupConsent: {
    enabled: false,
    key: 'focusGroupConsent',
    title: 'Consentimiento para grupo focal',
    typeLabel: 'Documento pendiente',
    statusLabel: 'Pendiente de enlace o documento final',
    description:
      'Este acceso se utilizará solo para participantes invitados a la fase cualitativa de grupos focales. El documento de consentimiento para grupo focal se habilitará cuando el investigador lo determine.',
    url: '',
    buttonLabel: 'Acceder al consentimiento del grupo focal',
    ethicalNote:
      'La participación en el grupo focal requerirá consentimiento aparte y solo aplicará a los participantes convocados por el investigador.'
  }
};

function hasAnyResearchAccessEnabled() {
    return Object.values(researchAccessState).some((item) => item.enabled === true);
}

function renderResearchAccess() {
    const container = document.getElementById('researchAccessSection');
    if (!container) return;

    if (!hasAnyResearchAccessEnabled()) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    
    let html = `
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <p style="color: var(--color-text-body); max-width: 800px; margin-top: 8px;">Este espacio contiene accesos que serán habilitados por el investigador únicamente cuando corresponda completar instrumentos o documentos del estudio.</p>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota importante:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y usted puede detenerse o retirarse según los términos explicados en la hoja informativa.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    `;

    const accessItems = [
        researchAccessState.consentPretest,
        researchAccessState.posttest,
        researchAccessState.focusGroupConsent
    ];

    accessItems.forEach(item => {
        if (item.enabled) {
            html += buildCard(item);
        }
    });

    html += `</div>`;
    container.innerHTML = html;
}

function buildCard(item) {
    let btnHtml;
    if (item.url && item.url.startsWith('http')) {
        btnHtml = `<a href="${item.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top: auto; align-self: flex-start;">${item.buttonLabel}</a>`;
    } else {
        btnHtml = `<button class="btn btn-secondary" type="button" disabled style="margin-top: auto; align-self: flex-start; cursor: not-allowed; opacity: 0.7;">Documento pendiente</button>
        <p style="margin-top: 8px; font-size: 0.8rem; color: var(--color-text-muted);">Este acceso todavía no está disponible. El investigador informará cuándo debe completarse.</p>`;
    }

    let badgeText = "";
    if (item.key === 'consentPretest') badgeText = "Sesión inicial";
    if (item.key === 'posttest') badgeText = "Cierre del proceso formativo";
    if (item.key === 'focusGroupConsent') badgeText = "Solo participantes convocados";

    return `
        <article class="research-access-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
            <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">${badgeText}</span>
                <span style="font-size: 0.8rem; color: var(--color-brand-primary); font-weight: 600;">${item.typeLabel}</span>
            </div>
            <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
            <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 12px;">${item.description}</p>
            <p style="color: var(--color-text-muted); font-size: 0.85rem; font-style: italic; margin-bottom: 24px;">${item.ethicalNote}</p>
            ${btnHtml}
        </article>
    `;
}

// Simulación de control
function setupSimulationPanel() {
    const simPretest = document.getElementById('sim-consent');
    const simPosttest = document.getElementById('sim-posttest');
    const simFocusGroup = document.getElementById('sim-focusgroup');
    
    const urlPretest = document.getElementById('consentPretestUrl');
    const urlPosttest = document.getElementById('posttestUrl');
    const urlFocusGroup = document.getElementById('focusGroupConsentUrl');

    const updateBtn = document.getElementById('sim-update-btn');

    if (!simPretest || !simPosttest || !simFocusGroup || !updateBtn) return;

    // init state
    simPretest.checked = researchAccessState.consentPretest.enabled;
    simPosttest.checked = researchAccessState.posttest.enabled;
    simFocusGroup.checked = researchAccessState.focusGroupConsent.enabled;
    
    urlPretest.value = researchAccessState.consentPretest.url;
    urlPosttest.value = researchAccessState.posttest.url;
    urlFocusGroup.value = researchAccessState.focusGroupConsent.url;

    updateBtn.addEventListener('click', () => {
        researchAccessState.consentPretest.enabled = simPretest.checked;
        researchAccessState.posttest.enabled = simPosttest.checked;
        researchAccessState.focusGroupConsent.enabled = simFocusGroup.checked;
        
        researchAccessState.consentPretest.url = urlPretest.value;
        researchAccessState.posttest.url = urlPosttest.value;
        researchAccessState.focusGroupConsent.url = urlFocusGroup.value;

        renderResearchAccess();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderResearchAccess();
    setupSimulationPanel();
});
