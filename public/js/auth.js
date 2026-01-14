import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Obtener el perfil del usuario desde Realtime Database
        const userSnap = await get(ref(db, `users/${uid}`));
        
        if (userSnap.exists()) {
            const userData = userSnap.val();
            
            // Guardamos info crítica en la sesión del navegador
            sessionStorage.setItem('orgId', userData.orgId);
            sessionStorage.setItem('rol', userData.rol);

            // Redirección lógica
            if (userData.rol === 'ROOT') {
                window.location.href = 'admin-control.html'; // Tu panel de control global
            } else if (userData.rol === 'ADMIN_ORG') {
                window.location.href = 'dashboard.html'; // Panel del colegio
            } else {
                window.location.href = 'mesa-control.html'; // Panel de anotadores
            }
        }
    } catch (error) {
        alert("Acceso denegado: Verifica tus credenciales.");
    }
});