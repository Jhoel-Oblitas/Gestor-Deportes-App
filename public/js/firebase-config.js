import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";



const firebaseConfig = {
  apiKey: "AIzaSyClDN9b3Xe80HFf0J03cskaLBFzXHtPako",
  authDomain: "gestor-deportes-app.firebaseapp.com",
  databaseURL: "https://gestor-deportes-app-default-rtdb.firebaseio.com",
  projectId: "gestor-deportes-app",
  storageBucket: "gestor-deportes-app.firebasestorage.app",
  messagingSenderId: "555762365126",
  appId: "1:555762365126:web:3b40f85869cfb435e95dc7"
};

// 1. Inicializar la App primero
const app = initializeApp(firebaseConfig);

// 2. Exportar usando la instancia 'app'
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);