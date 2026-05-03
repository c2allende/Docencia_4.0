import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

async function findParticipantUid() {
    const email = "carmelo.allende@upr.edu";
    console.log(`Buscando UID para: ${email}`);
    
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("email", "==", email));
    const snap = await getDocs(q);
    
    if (snap.empty) {
        console.log("No se encontró ningún usuario con ese email.");
        return;
    }
    
    snap.forEach(doc => {
        console.log(`UID ENCONTRADO: ${doc.id}`);
        console.log("Datos:", JSON.stringify(doc.data(), null, 2));
    });
}

// findParticipantUid();
