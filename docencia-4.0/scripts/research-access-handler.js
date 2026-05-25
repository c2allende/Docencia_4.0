import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);
const CONFIG_DOC_PATH = "researchAccess/config";

async function loadResearchAccess() {
    const mountPoint = document.getElementById('researchAccessMount');
    if (!mountPoint) return;

    try {
        const docRef = doc(db, CONFIG_DOC_PATH);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            mountPoint.hidden = true;
            return;
        }

        const config = docSnap.data();

        if (!config.sectionEnabled) {
            mountPoint.hidden = true;
            return;
        }

        const activeItems = [];
        if (config.consentPretest?.enabled) activeItems.push({ key: 'consentPretest', ...config.consentPretest });
        if (config.posttest?.enabled) activeItems.push({ key: 'posttest', ...config.posttest });
        if (config.focusGroupConsent?.enabled) activeItems.push({ key: 'focusGroupConsent', ...config.focusGroupConsent });

        if (activeItems.length === 0) {
            mountPoint.hidden = true;
            return;
        }

        renderResearchAccess(mountPoint, activeItems);

    } catch (e) {
        console.error("Error fetching research access config:", e);
        mountPoint.hidden = true;
    }
}

function renderResearchAccess(mountPoint, items) {
    mountPoint.hidden = false;
    
    let html = `
        <div class="research-access-header" style="margin-bottom: 24px; margin-top: 40px;">
            <p class="section-kicker" style="color: var(--color-brand-primary); font-weight: bold; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; margin-bottom: 8px;">Investigación</p>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.5rem; color: var(--color-text-display); margin-top: 0;">Participación en la investigación</h2>
            <p style="color: var(--color-text-body); max-width: 800px; margin-top: 8px;">Este espacio contiene accesos que serán habilitados por el investigador únicamente cuando corresponda completar instrumentos o documentos del estudio.</p>
            <div style="background-color: var(--color-brand-light, #f0f7ff); border-left: 4px solid var(--color-brand-primary); padding: 12px 16px; margin-top: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-display);"><strong>Nota importante:</strong> Complete cada formulario o documento únicamente cuando el investigador lo indique. La participación en la investigación es voluntaria y el LMS no recopila sus respuestas a estos instrumentos.</p>
            </div>
        </div>
        <div class="research-access-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px;">
    `;

    items.forEach(item => {
        html += buildCard(item);
    });

    html += `</div>`;
    mountPoint.innerHTML = html;
}

function buildCard(item) {
    let btnHtml;
    let description = "";
    let badgeText = "";

    if (item.key === 'consentPretest') {
        badgeText = "Sesión inicial";
        description = "Acceso al formulario que incluye el consentimiento informado y la preprueba. Debe completarse solo después de la orientación presencial del investigador.";
    } else if (item.key === 'posttest') {
        badgeText = "Cierre del proceso formativo";
        description = "Acceso al instrumento posterior que se habilitará al finalizar los talleres, actividades y foros correspondientes.";
    } else if (item.key === 'focusGroupConsent') {
        badgeText = "Solo participantes convocados";
        description = "Acceso destinado únicamente a participantes invitados a la fase cualitativa de grupos focales. Requerirá consentimiento aparte y se habilitará cuando el investigador tenga el documento o enlace final.";
    }

    if (item.url && item.url.trim() !== '') {
        btnHtml = `<a href="${item.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" style="margin-top: auto; align-self: flex-start;">${item.buttonLabel}</a>`;
    } else {
        btnHtml = `<button class="btn btn-secondary" type="button" disabled style="margin-top: auto; align-self: flex-start; cursor: not-allowed; opacity: 0.7;">Documento pendiente</button>
        <p style="margin-top: 8px; font-size: 0.8rem; color: var(--color-text-muted);">Documento pendiente de habilitación por el investigador.</p>`;
    }

    return `
        <article class="research-access-card card" style="display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--color-border); border-radius: 12px; background: white; box-shadow: var(--shadow-sm);">
            <div style="margin-bottom: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                <span class="badge" style="background-color: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #a7f3d0;">${badgeText}</span>
            </div>
            <h3 style="font-family: var(--font-family-heading); font-size: 1.15rem; color: var(--color-text-display); margin-top: 0; margin-bottom: 12px;">${item.title}</h3>
            <p style="color: var(--color-text-body); font-size: 0.95rem; margin-bottom: 24px;">${description}</p>
            ${btnHtml}
        </article>
    `;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadResearchAccess();
    }
});
