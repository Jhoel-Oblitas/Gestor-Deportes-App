import { db } from './firebase-config.js';
import { ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let equiposTemporales = [];

// 1. Agregar equipo a la lista visual (sin guardar en DB aún)
window.agregarEquipoLista = () => {
    const nombre = document.getElementById('equipo-nombre').value;
    const logo = document.getElementById('equipo-logo').value;

    if(nombre === "") return alert("Pon un nombre al equipo");

    equiposTemporales.push({ nombre, logo });
    actualizarListaVisual();
    document.getElementById('equipo-nombre').value = ""; // Limpiar input
};

// 2. Guardar todo el paquete en Firebase
window.guardarTorneoCompleto = async () => {
    const orgId = sessionStorage.getItem('orgId'); // Obtenido en el Login
    const nombreTorneo = document.getElementById('torneo-nombre').value;
    
    if(!orgId || !nombreTorneo) return alert("Faltan datos críticos");

    const nuevoTorneoRef = push(ref(db, `torneos/${orgId}`)); // Genera ID automático
    
    const datosTorneo = {
        metadata: {
            nombre: nombreTorneo,
            estado: "PREPARACION",
            fecha: new Date().toISOString()
        },
        reglas: {
            amarilla: document.getElementById('costo-amarilla').value,
            roja: document.getElementById('costo-roja').value
        },
        equipos: equiposTemporales // Array de equipos
    };

    try {
        await set(nuevoTorneoRef, datosTorneo);
        alert("¡Torneo creado con éxito!");
        window.location.href = "dashboard.html"; // Regresar al panel principal
    } catch (error) {
        console.error(error);
        alert("Error al guardar: " + error.message);
    }
function generarFixtureAutomatico(listaEquipos) {
    let numEquipos = listaEquipos.length;
    if (numEquipos % 2 !== 0) {
        listaEquipos.push({ nombre: "DESCANSO", id: "bye" }); // Para número impar
        numEquipos++;
    }

    let rondas = numEquipos - 1;
    let partidosPorRonda = numEquipos / 2;
    let encuentros = [];

    for (let i = 0; i < rondas; i++) {
        for (let j = 0; j < partidosPorRonda; j++) {
            let local = listaEquipos[j];
            let visitante = listaEquipos[numEquipos - 1 - j];
            
            if(local.id !== "bye" && visitante.id !== "bye") {
                encuentros.push({
                    fecha_nro: i + 1,
                    local: local.nombre,
                    visitante: visitante.nombre,
                    estado: "PROGRAMADO"
                });
            }
        }
        // Rotación de equipos (dejando el primero fijo)
        listaEquipos.splice(1, 0, listaEquipos.pop());
    }
    return encuentros;
}
};