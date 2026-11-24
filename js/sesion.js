// ============================================================
// sesion.js — Sesión del usuario en el navegador (Entrega 11)
// ============================================================

const CLAVE_SESION = 'viveroRaizSesion';

// Devuelve el usuario logueado, o null si no hay sesión
function obtenerSesion() {
    const guardada = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);

    if (!guardada) {
        return null;
    }

    try {
        return JSON.parse(guardada);
    } catch (error) {
        // Si lo guardado está roto, lo tratamos como si no hubiera sesión
        return null;
    }
}

// Guarda al usuario en el navegador.
// Con "recordar", la sesión sobrevive aunque se cierre el navegador (localStorage).
// Sin "recordar", dura hasta cerrar la pestaña (sessionStorage).
function guardarSesion(usuario, recordar) {
    // Nunca guardamos la contraseña: solo los datos que la página necesita mostrar
    const datos = JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
    });

    if (recordar) {
        localStorage.setItem(CLAVE_SESION, datos);
    } else {
        sessionStorage.setItem(CLAVE_SESION, datos);
    }
}

// Borra la sesión de los dos lugares posibles
function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
}

// Después del login volvemos a la página que se quería ver,
// pero solo si es una página de este sitio (por ejemplo "planta-form.html?id=3").
// Si no, vamos al listado. Así nadie puede armar un link que mande a otro sitio.
function destinoSeguro(destino) {
    const esPaginaDelSitio = /^[a-z-]+\.html(\?id=[\w-]+)?$/.test(destino || '');
    return esPaginaDelSitio ? destino : 'listado.html';
}
