import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

// Login con persistencia opcional
export const loginUser = async (email, password, rememberMe) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    return signInWithEmailAndPassword(auth, email, password);
};

// Registro: crea cuenta, setea displayName en Auth y envía verificación
export const registerUser = async (email, password, displayName = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
        await updateProfile(userCredential.user, { displayName });
    }
    await sendEmailVerification(userCredential.user);
    return userCredential;
};

// Recuperación de contraseña
export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Cierre de sesión
export const logout = () => signOut(auth);
