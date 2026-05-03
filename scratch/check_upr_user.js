import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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
const db = getFirestore(app);

// UID de carmelo.allende@upr.edu (asumo que es este si el usuario lo conoce o si puedo buscarlo)
// Como no tengo el UID, voy a intentar listar los usuarios de la coleccion 'usuarios' y filtrar por email manualmente en JS
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function checkUser() {
    console.log("Buscando usuario carmelo.allende@upr.edu en Firestore...");
    const q = query(collection(db, "usuarios"), where("email", "==", "carmelo.allende@upr.edu"));
    const snap = await getDocs(q);
    
    if (snap.empty) {
        console.log("❌ RESULTADO: El usuario carmelo.allende@upr.edu NO existe en Firestore.");
    } else {
        snap.forEach(doc => {
            console.log("✅ RESULTADO: Usuario encontrado:", doc.id, doc.data());
        });
    }
}

checkUser();
