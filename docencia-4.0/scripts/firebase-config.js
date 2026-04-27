import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA",
  authDomain: "docencia-4-lms.firebaseapp.com",
  projectId: "docencia-4-lms",
  storageBucket: "docencia-4-lms.firebasestorage.app",
  messagingSenderId: "933926490691",
  appId: "1:933926490691:web:75c43c1cb528448702baf6",
  measurementId: "G-B16T0DQRYH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
