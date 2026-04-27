import { loginUser } from "./auth.js";

const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-session')?.checked;

    showMessage('Iniciando sesión...', 'info');

    try {
        await loginUser(email, password, rememberMe);
        // El auth-guard se encargará de redirigir al dashboard si detecta al usuario
    } catch (error) {
        console.error("Error en login:", error);
        let errorMsg = 'Error al iniciar sesión. Verifica tus datos.';
        
        if (error.code === 'auth/invalid-credential') {
            errorMsg = 'Email o contraseña incorrectos.';
        } else if (error.code === 'auth/user-not-found') {
            errorMsg = 'No existe una cuenta con este email.';
        }
        
        showMessage(errorMsg, 'error');
    }
});
