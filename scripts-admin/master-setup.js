const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Inicialización con privilegios de administrador
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://TU_PROYECTO.firebaseio.com" // Usa tu URL de us-central1
});

const db = admin.database();

async function inicializarSistema() {
    const orgId = "COL-PANTALEON-2026"; // ID único para el colegio
    const rootUID = "PEGAR_AQUI_TU_UID_DE_FIREBASE_AUTH"; // Obtenlo de la pestaña Authentication

    const updates = {};

    // 1. Crear la Organización
    updates[`organizadores/${orgId}`] = {
        nombre: "Colegio Pantaleón Dalence",
        plan: "SPARK", // Plan gratuito sin facturación
        estado: "ACTIVO",
        color_primario: "#2563eb",
        logo_url: "default_logo.png"
    };

    // 2. Crearte a ti como ROOT
    updates[`users/${rootUID}`] = {
        nombre: "Tu Nombre (ROOT)",
        rol: "ROOT",
        orgId: "MASTER"
    };

    // 3. Crear al administrador del colegio (Tu hermano)
    // Debes haber creado su cuenta previamente en la consola de Firebase Auth
    const hermanoUID = "UID_DE_TU_HERMANO"; 
    updates[`users/${hermanoUID}`] = {
        nombre: "Nombre Hermano",
        rol: "ADMIN_ORG",
        orgId: orgId
    };

    try {
        await db.ref().update(updates);
        console.log("✅ Sistema inicializado: ROOT y Organización creados con éxito.");
    } catch (error) {
        console.error("❌ Error en la inicialización:", error);
    }
}

inicializarSistema();