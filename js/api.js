// ============================================================
// api.js — Comunicación con la API de MockAPI (Entrega 9)
// ============================================================

const URL_API = 'https://6afbabd1892984c4494a062d.mockapi.io/plantas';

// Trae todas las plantas. Devuelve un array.
async function obtenerPlantas() {
    const respuesta = await fetch(URL_API);

    if (!respuesta.ok) {
        throw new Error('La API respondió con el estado ' + respuesta.status);
    }

    return await respuesta.json();
}

// Trae una sola planta por su id.
// Devuelve el objeto de la planta, o null si no existe.
async function obtenerPlanta(id) {
    const respuesta = await fetch(URL_API + '/' + id);

    if (respuesta.status === 404) {
        return null;
    }

    if (!respuesta.ok) {
        throw new Error('La API respondió con el estado ' + respuesta.status);
    }

    return await respuesta.json();
}
// Crea una planta nueva. Devuelve la planta creada, con su id.
async function crearPlanta(datos) {
    const respuesta = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('La API respondió con el estado ' + respuesta.status);
    }

    return await respuesta.json();
}

// Reemplaza los datos de una planta existente.
async function actualizarPlanta(id, datos) {
    const respuesta = await fetch(URL_API + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error('La API respondió con el estado ' + respuesta.status);
    }

    return await respuesta.json();
}

// Borra una planta.
async function eliminarPlanta(id) {
    const respuesta = await fetch(URL_API + '/' + id, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('La API respondió con el estado ' + respuesta.status);
    }
}