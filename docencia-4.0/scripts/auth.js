import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    sendEmailVerification,
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

// Registro y envío automático de verificación
export const registerUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential;
};

// Recuperación de contraseña
export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Cierre de sesión
export const logout = () => signOut(auth);
