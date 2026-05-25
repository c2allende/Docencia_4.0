import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const researchAccessSimpleState = {
  sectionEnabled: false,
  audienceMode: 'test_only',
  testParticipantEmails: [],
  testParticipantUids: [],
  consentPretest: {
    enabled: false,
    title: 'Consentimiento informado y preprueba',
    badge: 'Sesión inicial',
    url: 'https://forms.gle/TCx5has4pBDRQQQ57',
    desc: 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.',
    btn: 'Acceder al consentimiento y preprueba'
  },
  posttest: {
    enabled: false,
    title: 'Postprueba',
    badge: 'Cierre del proceso formativo',
    url: 'https://forms.gle/of3qAs9kYcW4yZS36',
    desc: 'Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.',
    btn: 'Acceder a la postprueba'
  },
  focusGroupConsent: {
    enabled: false,
    title: 'Consentimiento para grupo focal',
    badge: 'Solo participantes convocados',
    url: '',
    desc: 'Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.',
    btn: 'Acceder al consentimiento del grupo focal'
  }
};

const dom = {
    toggleSection: document.getElementById('toggleSection'),
    testParticipantEmail: document.getElementById('researchTestParticipantEmail'),
    toggleConsent: document.getElementById('toggleConsent'),
    togglePosttest: document.getElementById('togglePosttest'),
    toggleFocus: document.getElementById('toggleFocus'),
    urlConsent: document.getElementById('urlConsent'),
    urlPosttest: document.getElementById('urlPosttest'),
    urlFocus: document.getElementById('urlFocus'),
    btnOffAll: document.getElementById('btnOffAll'),
    btnRestore: document.getElementById('btnRestore'),
    btnSaveConfig: document.getElementById('btnSaveConfig'),
    previewContainer: document.getElementById('previewContainer')
};

async function loadConfig() {
    try {
        const docRef = doc(db, 'researchAccess', 'config');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            researchAccessSimpleState.sectionEnabled = data.sectionEnabled || false;
            researchAccessSimpleState.audienceMode = data.audienceMode || 'test_only';
            researchAccessSimpleState.testParticipantEmails = data.testParticipantEmails || [];
            
            if (data.consentPretest) {
                researchAccessSimpleState.consentPretest.enabled = data.consentPretest.enabled || false;
                researchAccessSimpleState.consentPretest.url = data.consentPretest.url || '';
            }
            if (data.posttest) {
                researchAccessSimpleState.posttest.enabled = data.posttest.enabled || false;
                researchAccessSimpleState.posttest.url = data.posttest.url || '';
            }
            if (data.focusGroupConsent) {
                researchAccessSimpleState.focusGroupConsent.enabled = data.focusGroupConsent.enabled || false;
                researchAccessSimpleState.focusGroupConsent.url = data.focusGroupConsent.url || '';
            }
        }
        syncInputsWithState();
        renderPreview();
    } catch (e) {
        console.error('Error loading config:', e);
    }
}

async function saveConfig() {
    // Basic validation
    if (researchAccessSimpleState.sectionEnabled) {
        if (!researchAccessSimpleState.testParticipantEmails || researchAccessSimpleState.testParticipantEmails.length === 0 || researchAccessSimpleState.testParticipantEmails[0].trim() === '') {
            alert('Debe indicar el email del participante test antes de habilitar el espacio.');
            return;
        }
    }

    dom.btnSaveConfig.disabled = true;
    dom.btnSaveConfig.textContent = 'Guardando...';

    try {
        const docRef = doc(db, 'researchAccess', 'config');
        await setDoc(docRef, {
            sectionEnabled: researchAccessSimpleState.sectionEnabled,
            audienceMode: 'test_only',
            testParticipantEmails: researchAccessSimpleState.testParticipantEmails,
            testParticipantUids: [],
            consentPretest: {
                enabled: researchAccessSimpleState.consentPretest.enabled,
                url: researchAccessSimpleState.consentPretest.url,
                title: researchAccessSimpleState.consentPretest.title,
                badge: researchAccessSimpleState.consentPretest.badge,
                buttonLabel: researchAccessSimpleState.consentPretest.btn
            },
            posttest: {
                enabled: researchAccessSimpleState.posttest.enabled,
                url: researchAccessSimpleState.posttest.url,
                title: researchAccessSimpleState.posttest.title,
                badge: researchAccessSimpleState.posttest.badge,
                buttonLabel: researchAccessSimpleState.posttest.btn
            },
            focusGroupConsent: {
                enabled: researchAccessSimpleState.focusGroupConsent.enabled,
                url: researchAccessSimpleState.focusGroupConsent.url,
                title: researchAccessSimpleState.focusGroupConsent.title,
                badge: researchAccessSimpleState.focusGroupConsent.badge,
                buttonLabel: researchAccessSimpleState.focusGroupConsent.btn
            },
            updatedAt: serverTimestamp(),
            updatedBy: 'admin'
        }, { merge: true });

        setTimeout(() => {
            dom.btnSaveConfig.textContent = '¡Guardado!';
            setTimeout(() => {
                dom.btnSaveConfig.disabled = false;
                dom.btnSaveConfig.textContent = 'Guardar configuración';
            }, 2000);
        }, 500);
    } catch (e) {
        console.error('Error saving config:', e);
        alert('Error al guardar la configuración: ' + e.message);
        dom.btnSaveConfig.disabled = false;
        dom.btnSaveConfig.textContent = 'Guardar configuración';
    }
}

function renderPreview() {
    // Collect active cards
    const activeItems = [];
    if (researchAccessSimpleState.consentPretest.enabled) activeItems.push(researchAccessSimpleState.consentPretest);
    if (researchAccessSimpleState.posttest.enabled) activeItems.push(researchAccessSimpleState.posttest);
    if (researchAccessSimpleState.focusGroupConsent.enabled) activeItems.push(researchAccessSimpleState.focusGroupConsent);

    if (!researchAccessSimpleState.sectionEnabled || activeItems.length === 0) {
        dom.previewContainer.innerHTML = \`
            <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 32px; text-align: center; color: #64748b;">
                <p style="margin: 0;">El bloque de investigación no estará visible para los participantes.</p>
            </div>
        \`;
        return;
    }

    let html = \`
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <p style="color: var(--color-text-body); margin-top: 8px; font-size: 1rem;">Este espacio contiene accesos habilitados por el investigador para completar instrumentos o documentos del estudio.</p>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota ética:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    \`;

    activeItems.forEach(item => {
        let btnHtml = '';
        if (item.url && item.url.trim() !== '') {
            btnHtml = \`<a href="\${item.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top: auto; align-self: flex-start;">\${item.btn}</a>\`;
        } else {
            btnHtml = \`
                <button class="btn btn-secondary" type="button" disabled style="margin-top: auto; align-self: flex-start; cursor: not-allowed; opacity: 0.7;">Documento pendiente</button>
            \`;
        }

        html += \`
            <article class="research-access-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
                <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                    <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">\${item.badge}</span>
                </div>
                <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">\${item.title}</h3>
                <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">\${item.desc}</p>
                \${btnHtml}
            </article>
        \`;
    });

    html += \`</div>\`;
    dom.previewContainer.innerHTML = html;
}

function updateStateFromInputs() {
    researchAccessSimpleState.sectionEnabled = dom.toggleSection.checked;
    
    const emails = dom.testParticipantEmail.value.split(',').map(e => e.trim()).filter(e => e.length > 0);
    researchAccessSimpleState.testParticipantEmails = emails;

    researchAccessSimpleState.consentPretest.enabled = dom.toggleConsent.checked;
    researchAccessSimpleState.consentPretest.url = dom.urlConsent.value.trim();

    researchAccessSimpleState.posttest.enabled = dom.togglePosttest.checked;
    researchAccessSimpleState.posttest.url = dom.urlPosttest.value.trim();

    researchAccessSimpleState.focusGroupConsent.enabled = dom.toggleFocus.checked;
    researchAccessSimpleState.focusGroupConsent.url = dom.urlFocus.value.trim();
    
    renderPreview();
}

function syncInputsWithState() {
    dom.toggleSection.checked = researchAccessSimpleState.sectionEnabled;
    dom.testParticipantEmail.value = researchAccessSimpleState.testParticipantEmails.join(', ');

    dom.toggleConsent.checked = researchAccessSimpleState.consentPretest.enabled;
    dom.urlConsent.value = researchAccessSimpleState.consentPretest.url;

    dom.togglePosttest.checked = researchAccessSimpleState.posttest.enabled;
    dom.urlPosttest.value = researchAccessSimpleState.posttest.url;

    dom.toggleFocus.checked = researchAccessSimpleState.focusGroupConsent.enabled;
    dom.urlFocus.value = researchAccessSimpleState.focusGroupConsent.url;
}

function turnOffAll() {
    researchAccessSimpleState.sectionEnabled = false;
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

function bindResearchUrlInputs() {
    if (dom.toggleSection) dom.toggleSection.addEventListener('change', updateStateFromInputs);
    if (dom.testParticipantEmail) dom.testParticipantEmail.addEventListener('input', updateStateFromInputs);
    if (dom.toggleConsent) dom.toggleConsent.addEventListener('change', updateStateFromInputs);
    if (dom.togglePosttest) dom.togglePosttest.addEventListener('change', updateStateFromInputs);
    if (dom.toggleFocus) dom.toggleFocus.addEventListener('change', updateStateFromInputs);
    if (dom.urlConsent) dom.urlConsent.addEventListener('input', updateStateFromInputs);
    if (dom.urlPosttest) dom.urlPosttest.addEventListener('input', updateStateFromInputs);
    if (dom.urlFocus) dom.urlFocus.addEventListener('input', updateStateFromInputs);
}

// Event Listeners
bindResearchUrlInputs();

if (dom.btnOffAll) dom.btnOffAll.addEventListener('click', turnOffAll);
if (dom.btnRestore) dom.btnRestore.addEventListener('click', restoreOfficial);
if (dom.btnSaveConfig) dom.btnSaveConfig.addEventListener('click', saveConfig);

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
} else {
    loadConfig();
}
