import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);

const CONFIG_DOC_PATH = "researchAccess/config";

const OFFICIAL_URLS = {
    consentPretest: 'https://forms.gle/TCx5has4pBDRQQQ57',
    posttest: 'https://forms.gle/of3qAs9kYcW4yZS36',
    focusGroupConsent: ''
};

// UI Elements
const dom = {
    sectionEnabled: document.getElementById('sectionEnabled'),
    consentPretestEnabled: document.getElementById('consentPretestEnabled'),
    consentPretestUrl: document.getElementById('consentPretestUrl'),
    posttestEnabled: document.getElementById('posttestEnabled'),
    posttestUrl: document.getElementById('posttestUrl'),
    focusGroupConsentEnabled: document.getElementById('focusGroupConsentEnabled'),
    focusGroupConsentUrl: document.getElementById('focusGroupConsentUrl'),
    saveBtn: document.getElementById('saveConfigBtn'),
    disableAllBtn: document.getElementById('disableAllBtn'),
    restoreUrlsBtn: document.getElementById('restoreUrlsBtn')
};

async function checkAdminRole(user) {
    if (!user) return false;
    try {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            return data.role === 'admin';
        }
        return false;
    } catch (e) {
        console.error("Error checking role:", e);
        return false;
    }
}

async function loadConfig() {
    try {
        dom.saveBtn.textContent = 'Cargando...';
        dom.saveBtn.disabled = true;

        const docRef = doc(db, CONFIG_DOC_PATH);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            dom.sectionEnabled.checked = data.sectionEnabled || false;
            
            dom.consentPretestEnabled.checked = data.consentPretest?.enabled || false;
            dom.consentPretestUrl.value = data.consentPretest?.url || '';

            dom.posttestEnabled.checked = data.posttest?.enabled || false;
            dom.posttestUrl.value = data.posttest?.url || '';

            dom.focusGroupConsentEnabled.checked = data.focusGroupConsent?.enabled || false;
            dom.focusGroupConsentUrl.value = data.focusGroupConsent?.url || '';
        } else {
            // Initial load with empty config
            dom.sectionEnabled.checked = false;
            dom.consentPretestEnabled.checked = false;
            dom.consentPretestUrl.value = OFFICIAL_URLS.consentPretest;
            dom.posttestEnabled.checked = false;
            dom.posttestUrl.value = OFFICIAL_URLS.posttest;
            dom.focusGroupConsentEnabled.checked = false;
            dom.focusGroupConsentUrl.value = OFFICIAL_URLS.focusGroupConsent;
        }
    } catch (e) {
        console.error("Error loading config:", e);
        alert("Error al cargar la configuración. Revise sus permisos o la consola.");
    } finally {
        dom.saveBtn.textContent = 'Guardar configuración';
        dom.saveBtn.disabled = false;
    }
}

async function saveConfig() {
    try {
        dom.saveBtn.textContent = 'Guardando...';
        dom.saveBtn.disabled = true;

        const payload = {
            sectionEnabled: dom.sectionEnabled.checked,
            consentPretest: {
                enabled: dom.consentPretestEnabled.checked,
                url: dom.consentPretestUrl.value.trim(),
                title: 'Consentimiento informado y preprueba',
                buttonLabel: 'Acceder al consentimiento y preprueba',
                updatedAt: serverTimestamp(),
                updatedBy: auth.currentUser?.uid || 'admin'
            },
            posttest: {
                enabled: dom.posttestEnabled.checked,
                url: dom.posttestUrl.value.trim(),
                title: 'Postprueba',
                buttonLabel: 'Acceder a la postprueba',
                updatedAt: serverTimestamp(),
                updatedBy: auth.currentUser?.uid || 'admin'
            },
            focusGroupConsent: {
                enabled: dom.focusGroupConsentEnabled.checked,
                url: dom.focusGroupConsentUrl.value.trim(),
                title: 'Consentimiento para grupo focal',
                buttonLabel: 'Acceder al consentimiento del grupo focal',
                status: dom.focusGroupConsentUrl.value.trim() === '' ? 'pending' : 'ready',
                onlyForInvitedParticipants: true,
                updatedAt: serverTimestamp(),
                updatedBy: auth.currentUser?.uid || 'admin'
            },
            updatedAt: serverTimestamp(),
            updatedBy: auth.currentUser?.uid || 'admin'
        };

        const docRef = doc(db, CONFIG_DOC_PATH);
        await setDoc(docRef, payload, { merge: true });

        alert("Configuración guardada correctamente.");
    } catch (e) {
        console.error("Error saving config:", e);
        alert("Error al guardar la configuración.");
    } finally {
        dom.saveBtn.textContent = 'Guardar configuración';
        dom.saveBtn.disabled = false;
    }
}

function disableAll() {
    dom.sectionEnabled.checked = false;
    dom.consentPretestEnabled.checked = false;
    dom.posttestEnabled.checked = false;
    dom.focusGroupConsentEnabled.checked = false;
    saveConfig();
}

function restoreUrls() {
    dom.consentPretestUrl.value = OFFICIAL_URLS.consentPretest;
    dom.posttestUrl.value = OFFICIAL_URLS.posttest;
    dom.focusGroupConsentUrl.value = OFFICIAL_URLS.focusGroupConsent;
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const isAdmin = await checkAdminRole(user);
        if (!isAdmin) {
            alert("No tiene permisos administrativos.");
            window.location.href = "dashboard.html";
            return;
        }
        
        loadConfig();
        
        dom.saveBtn.addEventListener('click', saveConfig);
        dom.disableAllBtn.addEventListener('click', disableAll);
        dom.restoreUrlsBtn.addEventListener('click', restoreUrls);
    } else {
        window.location.href = "index.html";
    }
});
