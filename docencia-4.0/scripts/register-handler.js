import { registerUser } from "./auth.js";
import { createUserProfile } from "./user-service.js";

const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const displayName = document.getElementById('displayName')?.value || '';
    const roleContext = document.getElementById('roleContext')?.value || '';
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
        // 1. Registro en Firebase Auth (con displayName)
        const userCredential = await registerUser(email, password, displayName);
        const user = userCredential.user;

        // 2. Creación de perfil en Firestore
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
        console.error("Error en registro completo:", error);
        let errorMsg = 'Error al crear la cuenta. Intenta de nuevo.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Este email ya está registrado.';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'La contraseña es muy débil (mínimo 6 caracteres).';
        } else if (error.code === 'permission-denied') {
            errorMsg = 'Error de permisos al crear el perfil. Contacta soporte.';
        }
        
        showMessage(errorMsg, 'error');
    }
});
