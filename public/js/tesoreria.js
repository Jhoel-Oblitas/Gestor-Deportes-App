import { db } from './firebase-config.js';
import { ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Función para generar un PIN aleatorio
window.generarPIN = (canchaId) => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const orgId = sessionStorage.getItem('orgId');
    
    // Guardar el PIN en Firebase para que la mesa lo valide
    update(ref(db, `tesoreria/${orgId}/mesas_activas/${canchaId}`), {
        pin_pendiente: pin,
        expiracion_pin: Date.now() + (5 * 60 * 1000) // 5 minutos de validez
    });

    document.getElementById(`pin-display-${canchaId.split('_')[1]}`).innerText = `PIN: ${pin}`;
};

// Escuchar cambios en la Caja Central para actualizar la UI en tiempo real
const totalCajaRef = ref(db, `tesoreria/${orgId}/caja_central`);
onValue(totalCajaRef, (snapshot) => {
    document.getElementById('total-caja').innerText = `${snapshot.val()} BS`;
});