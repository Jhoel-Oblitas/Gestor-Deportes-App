import { db } from './firebase-config.js';
import { ref, update, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Función para registrar un GOL
window.registrarGol = async (partidoId, lado) => {
    const partidoRef = ref(db, `partidos/${orgId}/${partidoId}/marcador`);
    
    // Obtenemos valor actual y sumamos (Lógica Simple)
    // En Firebase Realtime, esto es instantáneo para el público
    const updates = {};
    updates[lado] = increment(1); // Función nativa de Firebase
    await update(partidoRef, updates);
    
    // Guardar en el Log para transparencia
    const logRef = ref(db, `partidos/${orgId}/${partidoId}/logs`);
    push(logRef, {
        evento: "GOL",
        equipo: lado,
        tiempo: document.getElementById('cronometro').innerText,
        timestamp: serverTimestamp()
    });
};

// Función para registrar TARJETA y DEUDA
window.registrarSancion = async (partidoId, tipo, jugador) => {
    const costo = (tipo === 'amarilla') ? 3 : 5; // Valores del torneo
    
    // 1. Registrar la sanción en el partido
    const sancionRef = ref(db, `partidos/${orgId}/${partidoId}/sanciones`);
    push(sancionRef, { tipo, jugador, costo, pagado: false });

    // 2. Aumentar el saldo pendiente de la MESA
    const mesaRef = ref(db, `canchas/${orgId}/cancha_1`);
    update(mesaRef, { saldo_pendiente: increment(costo) });
};