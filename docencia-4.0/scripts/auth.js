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
import { createUserProfile } from "./user-service.js";

// Login con persistencia opcional
export const loginUser = async (email, password, rememberMe) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    return signInWithEmailAndPassword(auth, email, password);
};

// Registro: crea cuenta, setea displayName en Auth, crea perfil en Firestore y envía verificación
export const registerUser = async (email, password, displayName = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName) {
        await updateProfile(user, { displayName });
    }

    // Crear perfil en Firestore
    await createUserProfile(user, { 
        displayName: displayName || user.displayName || "Participante",
        role: "participant",
        status: "active"
    });

    await sendEmailVerification(user);
    return userCredential;
};

// Recuperación de contraseña
export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Cierre de sesión
export const logout = () => signOut(auth);
