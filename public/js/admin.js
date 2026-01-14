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
// ... (mismo inicio de tu código)

function actualizarListaVisual() {
    const lista = document.getElementById('lista-equipos-temp');
    lista.innerHTML = "";
    equiposTemporales.forEach((eq, index) => {
        lista.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${eq.nombre} <span class="badge bg-primary">${eq.logo}</span>
        </li>`;
    });
}

window.guardarTorneoCompleto = async () => {
    const orgId = sessionStorage.getItem('orgId');
    const nombreTorneo = document.getElementById('torneo-nombre').value;
    const modoFixture = document.getElementById('fixture-modo').value;
    
    if(!orgId || !nombreTorneo || equiposTemporales.length < 2) {
        return alert("Datos insuficientes para crear el torneo");
    }

    const nuevoTorneoRef = push(ref(db, `torneos/${orgId}`));
    
    let datosTorneo = {
        metadata: {
            nombre: nombreTorneo,
            estado: "PREPARACION",
            fixture_modo: modoFixture,
            fecha: new Date().toISOString()
        },
        reglas: {
            amarilla: document.getElementById('costo-amarilla').value,
            roja: document.getElementById('costo-roja').value
        },
        equipos: equiposTemporales
    };

    // Si es automático, generar partidos de una vez
    if(modoFixture === "automatico") {
        datosTorneo.partidos = generarFixtureAutomatico([...equiposTemporales]);
    }

    try {
        await set(nuevoTorneoRef, datosTorneo);
        alert("¡Torneo y Fixture creados!");
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
};
};