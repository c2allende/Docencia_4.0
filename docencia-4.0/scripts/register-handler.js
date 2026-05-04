import { registerUser } from "./auth.js";
import { createUserProfile } from "./user-service.js";
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

// Verificar estado de matrícula al cargar la página
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

    // roleContext fijo — no se lee del DOM para evitar manipulación
    const roleContext = "Participante";

    try {
        // 1. Registro en Firebase Auth
        const userCredential = await registerUser(email, password, displayName);
        const user = userCredential.user;

        // 2. Actualizar perfil con roleContext (segunda llamada — flujo original)
        showMessage('Configurando perfil...', 'info');
        await createUserProfile(user, {
            displayName,
            roleContext
        });

        showMessage('Cuenta creada con éxito. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        console.error("Error en registro:", error);

        // Si Auth se creó pero Firestore rechazó el perfil, cerrar sesión
        if (auth.currentUser) {
            try { await signOut(auth); } catch (_) { /* ignorar */ }
        }

        let errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';

        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Este email ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'La contraseña es muy débil (mínimo 6 caracteres).';
        } else if (error.code === 'permission-denied' || (error.message && error.message.includes('permission'))) {
            errorMsg = 'El periodo de matrícula está cerrado o tu registro no fue autorizado. Comunícate con el administrador.';
        }

        showMessage(errorMsg, 'error');
    }
});
