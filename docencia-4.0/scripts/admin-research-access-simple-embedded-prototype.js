// admin-research-access-simple-prototype.js

const researchAccessSimpleState = {
  consentPretest: {
    enabled: false,
    title: 'Consentimiento informado y preprueba',
    timing: 'Sesión inicial',
    url: 'https://forms.gle/TCx5has4pBDRQQQ57',
    desc: 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.',
    btn: 'Acceder al consentimiento y preprueba'
  },
  posttest: {
    enabled: false,
    title: 'Postprueba',
    timing: 'Cierre del proceso formativo',
    url: 'https://forms.gle/of3qAs9kYcW4yZS36',
    desc: 'Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.',
    btn: 'Acceder a la postprueba'
  },
  focusGroupConsent: {
    enabled: false,
    title: 'Consentimiento para grupo focal',
    timing: 'Solo participantes convocados',
    url: '',
    desc: 'Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.',
    btn: 'Acceder al consentimiento del grupo focal'
  }
};

const dom = {
    toggleConsent: document.getElementById('toggleConsent'),
    togglePosttest: document.getElementById('togglePosttest'),
    toggleFocus: document.getElementById('toggleFocus'),
    urlConsent: document.getElementById('urlConsent'),
    urlPosttest: document.getElementById('urlPosttest'),
    urlFocus: document.getElementById('urlFocus'),
    btnOffAll: document.getElementById('btnOffAll'),
    btnRestore: document.getElementById('btnRestore'),
    btnUpdatePreview: document.getElementById('btnUpdatePreview'),
    previewContainer: document.getElementById('previewContainer')
};

function renderPreview() {
    // Collect active cards
    const activeItems = [];
    if (researchAccessSimpleState.consentPretest.enabled) activeItems.push(researchAccessSimpleState.consentPretest);
    if (researchAccessSimpleState.posttest.enabled) activeItems.push(researchAccessSimpleState.posttest);
    if (researchAccessSimpleState.focusGroupConsent.enabled) activeItems.push(researchAccessSimpleState.focusGroupConsent);

    if (activeItems.length === 0) {
        dom.previewContainer.innerHTML = `
            <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 32px; text-align: center; color: #64748b;">
                <p style="margin: 0;">El bloque de investigación no estará visible para los participantes.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota importante:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    `;

    activeItems.forEach(item => {
        let btnHtml = '';
        if (item.url && item.url.trim() !== '') {
            btnHtml = `<a href="${item.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top: auto; align-self: flex-start;">${item.btn}</a>`;
        } else {
            btnHtml = `
                <button class="btn btn-secondary" type="button" disabled style="margin-top: auto; align-self: flex-start; cursor: not-allowed; opacity: 0.7;">Documento pendiente</button>
            `;
        }

        html += `
            <article class="research-access-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
                <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                    <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">${item.timing}</span>
                </div>
                <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
                <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">${item.desc}</p>
                ${btnHtml}
            </article>
        `;
    });

    html += `</div>`;
    dom.previewContainer.innerHTML = html;
}

function updateStateFromInputs() {
    researchAccessSimpleState.consentPretest.enabled = dom.toggleConsent.checked;
    researchAccessSimpleState.consentPretest.url = dom.urlConsent.value.trim();

    researchAccessSimpleState.posttest.enabled = dom.togglePosttest.checked;
    researchAccessSimpleState.posttest.url = dom.urlPosttest.value.trim();

    researchAccessSimpleState.focusGroupConsent.enabled = dom.toggleFocus.checked;
    researchAccessSimpleState.focusGroupConsent.url = dom.urlFocus.value.trim();
    
    renderPreview();
}

function syncInputsWithState() {
    dom.toggleConsent.checked = researchAccessSimpleState.consentPretest.enabled;
    dom.urlConsent.value = researchAccessSimpleState.consentPretest.url;

    dom.togglePosttest.checked = researchAccessSimpleState.posttest.enabled;
    dom.urlPosttest.value = researchAccessSimpleState.posttest.url;

    dom.toggleFocus.checked = researchAccessSimpleState.focusGroupConsent.enabled;
    dom.urlFocus.value = researchAccessSimpleState.focusGroupConsent.url;
}

function turnOffAll() {
    researchAccessSimpleState.consentPretest.enabled = false;
    researchAccessSimpleState.posttest.enabled = false;
    researchAccessSimpleState.focusGroupConsent.enabled = false;
    syncInputsWithState();
    renderPreview();
}

function restoreOfficial() {
    researchAccessSimpleState.consentPretest.url = 'https://forms.gle/TCx5has4pBDRQQQ57';
    researchAccessSimpleState.posttest.url = 'https://forms.gle/of3qAs9kYcW4yZS36';
    researchAccessSimpleState.focusGroupConsent.url = '';
    syncInputsWithState();
    renderPreview();
}

// Event Listeners
dom.toggleConsent.addEventListener('change', updateStateFromInputs);
dom.togglePosttest.addEventListener('change', updateStateFromInputs);
dom.toggleFocus.addEventListener('change', updateStateFromInputs);
dom.urlConsent.addEventListener('input', updateStateFromInputs);
dom.urlPosttest.addEventListener('input', updateStateFromInputs);
dom.urlFocus.addEventListener('input', updateStateFromInputs);

dom.btnOffAll.addEventListener('click', turnOffAll);
dom.btnRestore.addEventListener('click', restoreOfficial);
dom.btnUpdatePreview.addEventListener('click', renderPreview);

// Init
document.addEventListener('DOMContentLoaded', () => {
    syncInputsWithState();
    renderPreview();
});
