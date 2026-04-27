import { registerUser } from "./auth.js";

const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
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

    showMessage('Creando cuenta...', 'info');

    try {
        await registerUser(email, password);
        showMessage('Cuenta creada con éxito. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } catch (error) {
        console.error("Error en registro:", error);
        let errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Este email ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'La contraseña es muy débil (mínimo 6 caracteres en Firebase).';
        }
        
        showMessage(errorMsg, 'error');
    }
});
