import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Valores obtidos em: Firebase Console → Definições do projeto → As tuas apps → Configuração do SDK
// Não são secretos — são feitos para estar no código do lado do cliente.
const firebaseConfig = {
  apiKey: "AIzaSyDnw8nJMqpguBCADgAyDJ_WUeqNCGPR0Wc",
  authDomain: "rachas-app.firebaseapp.com",
  projectId: "rachas-app",
  storageBucket: "rachas-app.firebasestorage.app",
  messagingSenderId: "377210661358",
  appId: "1:377210661358:web:6e7751984c7b0f7ff946ff",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
