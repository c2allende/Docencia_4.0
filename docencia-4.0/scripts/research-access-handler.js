import { auth, db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const mountPoint = document.getElementById('researchAccessMount');

function shouldShowResearchAccess(config) {
    if (!config || config.sectionEnabled !== true) return false;

    const items = [
        config.consentPretest,
        config.posttest,
        config.focusGroupConsent
    ];

    return items.some((item) => item && item.enabled === true);
}

function renderResearchAccess(config) {
    if (!mountPoint) return;

    const itemsToRender = [];
    
    if (config.consentPretest && config.consentPretest.enabled) {
        itemsToRender.push({
            id: 'consentPretest',
            title: config.consentPretest.title || 'Consentimiento informado y preprueba',
            badge: config.consentPretest.badge || 'Sesión inicial',
            desc: 'Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.',
            btn: config.consentPretest.buttonLabel || 'Acceder al consentimiento y preprueba',
            url: config.consentPretest.url || ''
        });
    }
    
    if (config.posttest && config.posttest.enabled) {
        itemsToRender.push({
            id: 'posttest',
            title: config.posttest.title || 'Postprueba',
            badge: config.posttest.badge || 'Cierre del proceso formativo',
            desc: 'Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.',
            btn: config.posttest.buttonLabel || 'Acceder a la postprueba',
            url: config.posttest.url || ''
        });
    }
    
    if (config.focusGroupConsent && config.focusGroupConsent.enabled) {
        itemsToRender.push({
            id: 'focusGroupConsent',
            title: config.focusGroupConsent.title || 'Consentimiento para grupo focal',
            badge: config.focusGroupConsent.badge || 'Solo participantes convocados',
            desc: 'Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.',
            btn: config.focusGroupConsent.buttonLabel || 'Acceder al consentimiento del grupo focal',
            url: config.focusGroupConsent.url || ''
        });
    }

    if (itemsToRender.length === 0) {
        mountPoint.hidden = true;
        mountPoint.innerHTML = '';
        return;
    }

    let html = `
        <div class="research-access-header" style="margin-top: 48px; margin-bottom: 24px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <p style="color: var(--color-text-body); margin-top: 8px; font-size: 1rem;">Este espacio contiene accesos habilitados por el investigador para completar instrumentos o documentos del estudio.</p>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota ética:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    `;

    itemsToRender.forEach(item => {
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
                    <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">${item.badge}</span>
                </div>
                <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
                <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">${item.desc}</p>
                ${btnHtml}
            </article>
        `;
    });

    html += `</div>`;
    
    mountPoint.innerHTML = html;
    mountPoint.hidden = false;
}

async function initResearchAccess(user) {
    try {
        const docRef = doc(db, 'researchAccess', 'config');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const config = docSnap.data();
            if (shouldShowResearchAccess(config)) {
                renderResearchAccess(config);
            } else {
                if (mountPoint) mountPoint.hidden = true;
            }
        } else {
            if (mountPoint) mountPoint.hidden = true;
        }
    } catch (e) {
        console.error('Error fetching research access config:', e);
        if (mountPoint) mountPoint.hidden = true;
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        initResearchAccess(user);
    } else {
        if (mountPoint) mountPoint.hidden = true;
    }
});
