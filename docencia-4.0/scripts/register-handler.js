import { registerUser } from "./auth.js";
import { getUserProfile } from "./user-service.js";
import { getEnrollmentConfig, evaluateEnrollmentStatus } from "./enrollment-service.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const registerForm = document.getElementById('registerForm');
const authMessageEl = document.getElementById('authMessage');
const submitBtn = document.getElementById('registerSubmitBtn');

function showMessage(text, type = 'info') {
    if (!authMessageEl) return;
    authMessageEl.textContent = text;
    authMessageEl.className = `auth-message is-visible is-${type}`;
}

function setEnrollmentBannerText(text) {
    const el = document.getElementById('enrollmentBannerText');
    if (el) el.textContent = text;
}

function setEnrollmentBanner(status) {
    const banner = document.getElementById('enrollmentBanner');
    if (!banner) return;

    setEnrollmentBannerText(status.message);
    banner.className = 'enrollment-banner';

    if (status.isOpen) {
        banner.classList.add('is-open');
    } else {
        banner.classList.add('is-closed');
        if (submitBtn) submitBtn.disabled = true;
    }
    banner.removeAttribute('hidden');
}

async function initEnrollmentStatus() {
    const banner = document.getElementById('enrollmentBanner');
    if (banner) {
        setEnrollmentBannerText('Verificando periodo de matrícula...');
        banner.className = 'enrollment-banner is-loading';
        banner.removeAttribute('hidden');
    }

    const config = await getEnrollmentConfig();
    const status = evaluateEnrollmentStatus(config);
    setEnrollmentBanner(status);
}

document.addEventListener('DOMContentLoaded', initEnrollmentStatus);

registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const displayName = document.getElementById('displayName')?.value.trim() || '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms')?.checked;

    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden.', 'error');
        return;
    }

    if (!acceptTerms) {
        showMessage('Debes aceptar el uso responsable.', 'error');
        return;
    }

    // Pre-flight: verificar matrícula antes de crear cuenta Auth
    showMessage('Verificando periodo de matrícula...', 'info');
    const config = await getEnrollmentConfig();
    const enrollmentStatus = evaluateEnrollmentStatus(config);

    if (!enrollmentStatus.isOpen) {
        showMessage(enrollmentStatus.message, 'error');
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    showMessage('Creando cuenta...', 'info');

    try {
        const userCredential = await registerUser(email, password, displayName);
        const uid = userCredential.user.uid;

        // Verificar que el perfil sea legible en Firestore antes de redirigir.
        // Evita que auth-guard llegue al dashboard antes de que el documento esté disponible.
        let profile = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            profile = await getUserProfile(uid);
            if (profile) break;
            if (attempt < 3) await new Promise(r => setTimeout(r, 600));
        }

        if (!profile) {
            try { await signOut(auth); } catch (_) { /* ignorar */ }
            showMessage(
                'La cuenta fue creada pero hubo un problema al inicializar el perfil. ' +
                (enrollmentStatus.adminContactEmail
                    ? 'Comunícate con: ' + enrollmentStatus.adminContactEmail
                    : 'Comunícate con el administrador.'),
                'error'
            );
            return;
        }

        showMessage('Cuenta creada con éxito. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);

    } catch (error) {
        console.error("Error en registro:", error);

        if (auth.currentUser) {
            try { await signOut(auth); } catch (_) { /* ignorar */ }
        }

        let errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';

        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Este email ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'La contraseña es muy débil (mínimo 6 caracteres).';
        } else if (error.code === 'permission-denied' || (error.message && error.message.includes('permission'))) {
            errorMsg = 'El periodo de matrícula está cerrado o tu registro no fue autorizado. ' +
                (enrollmentStatus.adminContactEmail
                    ? 'Comunícate con: ' + enrollmentStatus.adminContactEmail
                    : 'Comunícate con el administrador.');
        }

        showMessage(errorMsg, 'error');
    }
});
