import { resetPassword } from "./auth.js";

const resetPasswordForm = document.getElementById('resetPasswordForm');
const authMessage = document.getElementById('authMessage');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

resetPasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;

    showMessage('Enviando instrucciones...', 'info');

    try {
        await resetPassword(email);
        showMessage('Se han enviado las instrucciones a tu correo. Revisa tu bandeja de entrada.', 'success');
    } catch (error) {
        console.error("Error en reset password:", error);
        let errorMsg = 'Error al enviar el correo. Verifica el email e intenta de nuevo.';
        
        if (error.code === 'auth/user-not-found') {
            errorMsg = 'No existe una cuenta asociada a este email.';
        }
        
        showMessage(errorMsg, 'error');
    }
});
