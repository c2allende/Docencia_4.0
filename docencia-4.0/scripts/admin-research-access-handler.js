const OFFICIAL_RESEARCH_LINKS = {
    consentPretest: 'https://forms.gle/TCx5has4pBDRQQQ57',
    posttest: 'https://forms.gle/of3qAs9kYcW4yZS36',
    focusGroupConsent: ''
};

let researchState = {
    sectionEnabled: false,
    consentPretest: {
        enabled: false,
        title: 'Consentimiento informado y preprueba',
        badge: 'Sesión inicial',
        url: OFFICIAL_RESEARCH_LINKS.consentPretest,
        buttonLabel: 'Acceder al consentimiento y preprueba'
    },
    posttest: {
        enabled: false,
        title: 'Postprueba',
        badge: 'Cierre del proceso formativo',
        url: OFFICIAL_RESEARCH_LINKS.posttest,
        buttonLabel: 'Acceder a la postprueba'
    },
    focusGroupConsent: {
        enabled: false,
        title: 'Consentimiento para grupo focal',
        badge: 'Solo participantes convocados',
        url: '',
        buttonLabel: 'Acceder al consentimiento del grupo focal'
    }
};

function syncStateFromDom() {
    researchState.sectionEnabled = document.getElementById('toggleSection')?.checked || false;

    researchState.consentPretest.enabled = document.getElementById('toggleConsent')?.checked || false;
    researchState.consentPretest.url = document.getElementById('urlConsent')?.value.trim() || '';

    researchState.posttest.enabled = document.getElementById('togglePosttest')?.checked || false;
    researchState.posttest.url = document.getElementById('urlPosttest')?.value.trim() || '';

    researchState.focusGroupConsent.enabled = document.getElementById('toggleFocus')?.checked || false;
    researchState.focusGroupConsent.url = document.getElementById('urlFocus')?.value.trim() || '';
}

function syncDomFromState() {
    if (document.getElementById('toggleSection')) document.getElementById('toggleSection').checked = researchState.sectionEnabled;
    
    if (document.getElementById('toggleConsent')) document.getElementById('toggleConsent').checked = researchState.consentPretest.enabled;
    if (document.getElementById('urlConsent')) document.getElementById('urlConsent').value = researchState.consentPretest.url;

    if (document.getElementById('togglePosttest')) document.getElementById('togglePosttest').checked = researchState.posttest.enabled;
    if (document.getElementById('urlPosttest')) document.getElementById('urlPosttest').value = researchState.posttest.url;

    if (document.getElementById('toggleFocus')) document.getElementById('toggleFocus').checked = researchState.focusGroupConsent.enabled;
    if (document.getElementById('urlFocus')) document.getElementById('urlFocus').value = researchState.focusGroupConsent.url;
}

function getParticipantDescription(title) {
    if (title.includes('preprueba')) {
        return 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.';
    }

    if (title.includes('Postprueba')) {
        return 'Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.';
    }

    return 'Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.';
}

function createAccessCard(item, fallbackText) {
    const hasUrl = item.url && item.url.trim().length > 0;

    const actionHtml = hasUrl
        ? \`<a class="btn btn-primary" href="\${item.url}" target="_blank" rel="noopener noreferrer">\${item.buttonLabel}</a>\`
        : \`<button class="btn btn-secondary" type="button" disabled>\${fallbackText || 'Documento pendiente'}</button>\`;

    return \`
      <article class="research-access-preview-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
        <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
            <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">\${item.badge}</span>
        </div>
        <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">\${item.title}</h3>
        <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">\${getParticipantDescription(item.title)}</p>
        <div style="margin-top: auto; align-self: flex-start;">\${actionHtml}</div>
      </article>
    \`;
}

function renderPreview() {
    const preview = document.getElementById('previewContainer');
    if (!preview) return;

    syncStateFromDom();

    const activeItems = [];
    if (researchState.consentPretest.enabled) activeItems.push(researchState.consentPretest);
    if (researchState.posttest.enabled) activeItems.push(researchState.posttest);
    if (researchState.focusGroupConsent.enabled) activeItems.push(researchState.focusGroupConsent);

    if (!researchState.sectionEnabled || activeItems.length === 0) {
        preview.innerHTML = \`
          <div class="research-access-empty-preview" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 32px; text-align: center; color: #64748b;">
            El bloque de investigación no estará visible para los participantes.
          </div>
        \`;
        return;
    }

    const cards = [];

    if (researchState.consentPretest.enabled) {
        cards.push(createAccessCard(researchState.consentPretest));
    }

    if (researchState.posttest.enabled) {
        cards.push(createAccessCard(researchState.posttest));
    }

    if (researchState.focusGroupConsent.enabled) {
        cards.push(createAccessCard(researchState.focusGroupConsent, 'Documento pendiente'));
    }

    preview.innerHTML = \`
      <section class="research-access-preview-shell">
        <div class="research-access-header" style="margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota ética:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-preview-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          \${cards.join('')}
        </div>
      </section>
    \`;
}

function turnOffAll() {
    if (document.getElementById('toggleSection')) document.getElementById('toggleSection').checked = false;
    if (document.getElementById('toggleConsent')) document.getElementById('toggleConsent').checked = false;
    if (document.getElementById('togglePosttest')) document.getElementById('togglePosttest').checked = false;
    if (document.getElementById('toggleFocus')) document.getElementById('toggleFocus').checked = false;
    renderPreview();
    const status = document.getElementById('researchAccessStatus');
    if (status) {
        status.textContent = 'Accesos apagados. Recuerde guardar la configuración.';
        status.style.color = '#d97706';
    }
}

function restoreOfficialLinks() {
    if (document.getElementById('urlConsent')) document.getElementById('urlConsent').value = OFFICIAL_RESEARCH_LINKS.consentPretest;
    if (document.getElementById('urlPosttest')) document.getElementById('urlPosttest').value = OFFICIAL_RESEARCH_LINKS.posttest;
    if (document.getElementById('urlFocus')) document.getElementById('urlFocus').value = '';
    renderPreview();
    const status = document.getElementById('researchAccessStatus');
    if (status) {
        status.textContent = 'Enlaces oficiales restaurados. Recuerde guardar la configuración.';
        status.style.color = '#0284c7';
    }
}

async function loadResearchConfigFromFirestore() {
    try {
        const db = window.db || window.firestoreDb || window.firebaseDB;
        if (db && window.getDoc && window.doc) {
            const snap = await window.getDoc(window.doc(db, 'researchAccess', 'config'));
            if (snap.exists()) {
                const loadedConfig = snap.data();
                researchState.sectionEnabled = loadedConfig.sectionEnabled || false;
                
                if (loadedConfig.consentPretest) {
                    researchState.consentPretest.enabled = loadedConfig.consentPretest.enabled || false;
                    researchState.consentPretest.url = loadedConfig.consentPretest.url || '';
                }
                
                if (loadedConfig.posttest) {
                    researchState.posttest.enabled = loadedConfig.posttest.enabled || false;
                    researchState.posttest.url = loadedConfig.posttest.url || '';
                }
                
                if (loadedConfig.focusGroupConsent) {
                    researchState.focusGroupConsent.enabled = loadedConfig.focusGroupConsent.enabled || false;
                    researchState.focusGroupConsent.url = loadedConfig.focusGroupConsent.url || '';
                }

                syncDomFromState();
                renderPreview();
                const status = document.getElementById('researchAccessStatus');
                if (status) {
                    status.textContent = 'Configuración cargada desde el servidor.';
                    status.style.color = '#059669';
                    setTimeout(() => { status.textContent = ''; }, 3000);
                }
            }
        }
    } catch (error) {
        console.error('[ResearchAccess] Error al cargar configuración:', error);
    }
}

async function saveResearchConfig() {
    syncStateFromDom();
    const status = document.getElementById('researchAccessStatus');
    const btn = document.getElementById('btnSaveResearchConfig');
    
    if (btn) btn.disabled = true;
    if (status) {
        status.textContent = 'Guardando configuración...';
        status.style.color = '#2563eb';
    }

    const payload = {
        sectionEnabled: researchState.sectionEnabled,
        consentPretest: researchState.consentPretest,
        posttest: researchState.posttest,
        focusGroupConsent: researchState.focusGroupConsent,
        updatedAt: window.serverTimestamp ? window.serverTimestamp() : new Date().toISOString()
    };

    try {
        const db = window.db || window.firestoreDb || window.firebaseDB;
        if (db && window.setDoc && window.doc) {
            await window.setDoc(
                window.doc(db, 'researchAccess', 'config'),
                payload,
                { merge: true }
            );
            if (status) {
                status.textContent = 'Configuración guardada correctamente.';
                status.style.color = '#059669';
            }
        } else {
            throw new Error('Firestore no está disponible.');
        }
    } catch (error) {
        console.error('[ResearchAccess] Error al guardar configuración:', error);
        if (status) {
            status.textContent = \`Error al guardar: \${error.message}\`;
            status.style.color = '#dc2626';
        }
        alert(\`No se pudo guardar la configuración: \${error.message}\`);
    } finally {
        if (btn) btn.disabled = false;
    }
}

function bindResearchEvents() {
    [
        'toggleSection',
        'toggleConsent',
        'togglePosttest',
        'toggleFocus',
        'urlConsent',
        'urlPosttest',
        'urlFocus'
    ].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', renderPreview);
            element.addEventListener('change', renderPreview);
        } else {
            console.warn('[ResearchAccess] No se encontró:', id);
        }
    });

    if (document.getElementById('btnOffAll')) document.getElementById('btnOffAll').addEventListener('click', turnOffAll);
    if (document.getElementById('btnRestore')) document.getElementById('btnRestore').addEventListener('click', restoreOfficialLinks);
    if (document.getElementById('btnUpdatePreview')) document.getElementById('btnUpdatePreview').addEventListener('click', renderPreview);
    if (document.getElementById('btnSaveResearchConfig')) document.getElementById('btnSaveResearchConfig').addEventListener('click', saveResearchConfig);
}

function initResearchAccessAdmin() {
    console.log('[ResearchAccess] Inicializando control de investigación');

    const preview = document.getElementById('previewContainer');

    if (!preview) {
        console.error('[ResearchAccess] No existe #previewContainer');
        return;
    }

    bindResearchEvents();
    renderPreview();
    loadResearchConfigFromFirestore();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResearchAccessAdmin, { once: true });
} else {
    initResearchAccessAdmin();
}
