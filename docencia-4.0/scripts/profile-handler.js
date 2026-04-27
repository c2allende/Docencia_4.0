import { auth } from "./firebase-config.js";
import { logout } from "./auth.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authMessage = document.getElementById('authMessage');
const userEmailDisplay = document.getElementById('userEmailDisplay') || document.getElementById('email');
const verificationStatus = document.getElementById('verificationStatus');
const resendVerificationBtn = document.getElementById('resendVerificationBtn');
const logoutBtn = document.getElementById('logoutBtn');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Cargar datos del usuario
        if (userEmailDisplay) userEmailDisplay.value = user.email;
        
        if (verificationStatus) {
            verificationStatus.textContent = user.emailVerified ? 'Verificado' : 'Pendiente de verificación';
            verificationStatus.className = user.emailVerified ? 'status-badge verified' : 'status-badge pending';
        }

        if (resendVerificationBtn) {
            resendVerificationBtn.style.display = user.emailVerified ? 'none' : 'inline-block';
        }
    }
});

logoutBtn?.addEventListener('click', async () => {
    try {
        await logout();
        window.location.href = "index.html";
    } catch (error) {
        showMessage('Error al cerrar sesión.', 'error');
    }
});

resendVerificationBtn?.addEventListener('click', async () => {
    if (auth.currentUser) {
        try {
            await sendEmailVerification(auth.currentUser);
            showMessage('Email de verificación enviado. Revisa tu bandeja de entrada.', 'success');
        } catch (error) {
            showMessage('Error al enviar el email. Intenta más tarde.', 'error');
        }
    }
});
