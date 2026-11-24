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


// ---------- PÁGINAS PROTEGIDAS ----------

// Si no hay sesión, manda al login y recuerda a qué página se quería entrar
function protegerPagina() {
    if (!obtenerSesion()) {
        const paginaActual = window.location.pathname.split('/').pop() + window.location.search;
        window.location.replace('login.html?volver=' + encodeURIComponent(paginaActual));
    }
}


// ---------- HEADER SEGÚN LA SESIÓN ----------

// Con sesión iniciada: "Ingresar" pasa a "Intranet", y se suman el saludo y "Cerrar sesión"
function actualizarHeader() {
    const usuario = obtenerSesion();
    const menu = document.querySelector('#menu-principal ul');

    if (!usuario || !menu) {
        return;
    }

    const linkIngresar = menu.querySelector('a[href="login.html"]');
    if (linkIngresar) {
        linkIngresar.textContent = 'Intranet';
        linkIngresar.href = 'listado.html';
    }

    const saludo = document.createElement('li');
    saludo.className = 'saludo-usuario';
    saludo.textContent = 'Hola, ' + usuario.nombre;

    const botonSalir = document.createElement('button');
    botonSalir.type = 'button';
    botonSalir.className = 'boton-salir';
    botonSalir.textContent = 'Cerrar sesión';
    botonSalir.addEventListener('click', async function () {
        const confirmado = await confirmarAccion('¿Cerrar sesión?', 'Vas a tener que volver a ingresar para usar la intranet.', 'Cerrar sesión', false);
        if (confirmado) {
            cerrarSesion();
            window.location.href = 'index.html';
        }
    });

    const itemSalir = document.createElement('li');
    itemSalir.appendChild(botonSalir);

    menu.appendChild(saludo);
    menu.appendChild(itemSalir);
}


// ---------- AL CARGAR CADA PÁGINA ----------

// Las páginas de la intranet tienen <body data-protegida>
if (document.body.hasAttribute('data-protegida')) {
    protegerPagina();
}

// Si ya hay sesión, no tiene sentido mostrar el formulario de login
if (document.getElementById('form-login') && obtenerSesion()) {
    window.location.replace('listado.html');
}

actualizarHeader();
