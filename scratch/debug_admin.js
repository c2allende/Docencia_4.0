import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA",
  authDomain: "docencia-4-lms.firebaseapp.com",
  projectId: "docencia-4-lms",
  storageBucket: "docencia-4-lms.firebasestorage.app",
  messagingSenderId: "933926490691",
  appId: "1:933926490691:web:75c43c1cb528448702baf6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Este script es para ser ejecutado en la consola del navegador por el subagente para ver el estado real del ADMIN
async function debugAdmin() {
    console.log("DEBUG ADMIN STATUS:");
    const user = auth.currentUser;
    if (!user) {
        console.error("No hay usuario autenticado.");
        return;
    }
    console.log("Auth UID:", user.uid);
    console.log("Auth Email:", user.email);

    const snap = await getDoc(doc(db, "usuarios", user.uid));
    if (snap.exists()) {
        console.log("Firestore Profile:", snap.data());
    } else {
        console.error("No se encontró perfil en Firestore para este UID.");
    }
}

// debugAdmin(); // El subagente lo llamará manualmente
