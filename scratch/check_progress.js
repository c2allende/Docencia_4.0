import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

async function checkParticipantProgress() {
    const uid = "z9ynPl166gT7kOIdccjTZnnp5s03";
    console.log(`Auditoría de progreso para UID: ${uid}`);

    // 1. Módulo 1
    const mod1Ref = doc(db, "usuarios", uid, "progresoModulos", "modulo1");
    const mod1Snap = await getDoc(mod1Ref);
    if (mod1Snap.exists()) {
        console.log("PROGRESO MÓDULO 1:", JSON.stringify(mod1Snap.data(), null, 2));
    } else {
        console.log("No hay documento de progreso para Módulo 1.");
    }

    // 2. Páginas
    console.log("PÁGINAS COMPLETADAS:");
    const pagesRef = collection(db, "usuarios", uid, "progresoPaginas");
    const pagesSnap = await getDocs(pagesRef);
    pagesSnap.forEach(doc => {
        const d = doc.data();
        console.log(`- ${d.pageId}: ${d.status} (${d.completedAt ? 'Completado' : 'Pendiente'})`);
    });
}

// checkParticipantProgress();
