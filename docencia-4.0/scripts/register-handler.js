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
        // PASO 1: Establecer banderas ANTES de crear Auth para silenciar public-auth-check.js
        sessionStorage.setItem("registration_in_progress", "true");
        sessionStorage.setItem("registration_just_completed", "true");

        const userCredential = await registerUser(email, password, displayName);
        
        // PASO 6: Logs temporales para diagnóstico
        console.log("[REGISTER] auth uid", auth.currentUser?.uid);
        console.log("[REGISTER] profile path", `usuarios/${auth.currentUser?.uid}`);

        const user = userCredential.user;

        // FORZAR REFRESH DE TOKEN
        await user.getIdToken(true);
        await user.reload();

        // Verificación única: si falla por propagación lenta, el auth-guard del dashboard reintentará
        try {
            const profile = await getUserProfile(user.uid);
            if (profile && profile.status === "active") {
                console.log("[REGISTER] Perfil verificado exitosamente.");
            }
        } catch (e) {
            console.warn("[REGISTER] Lectura inicial falló (esperado en algunos casos):", e.code);
        }

        // Éxito: Limpiar bandera de "en progreso" para que public-auth-check.js sepa que ya terminó el paso de Auth
        // Pero MANTENER "registration_just_completed" para que el auth-guard en el dashboard haga los reintentos
        sessionStorage.removeItem("registration_in_progress");

        showMessage('Cuenta creada con éxito. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {
        // Error: Limpiar AMBAS banderas para permitir reintentos limpios
        sessionStorage.removeItem("registration_in_progress");
        sessionStorage.removeItem("registration_just_completed");
        
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
