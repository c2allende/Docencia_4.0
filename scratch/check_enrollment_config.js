import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA",
    authDomain: "docencia-4-lms.firebaseapp.com",
    projectId: "docencia-4-lms",
    storageBucket: "docencia-4-lms.firebasestorage.app",
    messagingSenderId: "933926490691",
    appId: "1:933926490691:web:75c43c1cb528448702baf6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkConfig() {
    const ref = doc(db, "configuracion", "registro");
    const snap = await getDoc(ref);
    if (snap.exists()) {
        console.log("CONFIGURACIÓN ACTUAL:", JSON.stringify(snap.data(), null, 2));
    } else {
        console.log("EL DOCUMENTO configuracion/registro NO EXISTE.");
    }
}

checkConfig();
