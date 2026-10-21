
// ---------- FUNCIONES REUTILIZABLES ----------
// Las usan todos los formularios del sitio: contacto, login y registro.

// Muestra un mensaje de error debajo de un campo y lo marca en rojo.
function mostrarError(campo, mensaje) {
    const parrafoError = document.getElementById('error-' + campo.id);
    parrafoError.textContent = mensaje;
    campo.classList.add('campo-invalido');
}

// Borra el error de un campo y le saca el rojo.
function limpiarError(campo) {
    const parrafoError = document.getElementById('error-' + campo.id);
    parrafoError.textContent = '';
    campo.classList.remove('campo-invalido');
}

// Devuelve true si el texto tiene forma de correo: algo@algo.algo
function esCorreoValido(texto) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(texto);
}

// Revisa que un campo no esté vacío.
// Devuelve true si está completo, false si está vacío (y muestra el error).
function validarObligatorio(campo, mensaje) {
    if (campo.value.trim() === '') {
        mostrarError(campo, mensaje);
        return false;
    }
    limpiarError(campo);
    return true;
}
// Revisa que un correo esté completo y bien escrito.
// Devuelve true si está bien, false si no (y muestra el error).
function validarCorreo(campo) {
    if (!validarObligatorio(campo, 'Escribí tu correo electrónico.')) {
        return false;
    }
    if (!esCorreoValido(campo.value.trim())) {
        mostrarError(campo, 'El correo no tiene un formato válido. Ejemplo: nombre@mail.com');
        return false;
    }
    return true;
}


// ---------- FORMULARIO DE CONTACTO ----------

const formContacto = document.getElementById('form-contacto');

// Solo se ejecuta si el formulario existe en esta página
if (formContacto) {
    formContacto.addEventListener('submit', function (evento) {
        // Frenamos el envío para revisar los datos primero
        evento.preventDefault();

        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('correo');
        const motivo = document.getElementById('motivo');
        const mensaje = document.getElementById('mensaje');
        const mensajeExito = document.getElementById('contacto-exito');

        // Arranca en true; si algún campo falla, pasa a false
        let todoBien = true;

        if (!validarObligatorio(nombre, 'Escribí tu nombre y apellido.')) {
            todoBien = false;
        }

        if (!validarCorreo(correo)) {
            todoBien = false;
        }

        if (!validarObligatorio(motivo, 'Elegí un motivo de consulta.')) {
            todoBien = false;
        }

        if (!validarObligatorio(mensaje, 'Escribí tu mensaje.')) {
            todoBien = false;
        }

        // Resultado final
        if (todoBien) {
            mensajeExito.hidden = false;
            formContacto.reset();
        } else {
            mensajeExito.hidden = true;
        }
    });
}
// ---------- FORMULARIO DE LOGIN ----------

const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const correo = document.getElementById('correo-login');
        const contrasena = document.getElementById('contrasena');

        let todoBien = true;

        if (!validarCorreo(correo)) {
            todoBien = false;
        }

        if (!validarObligatorio(contrasena, 'Escribí tu contraseña.')) {
            todoBien = false;
        }

        if (todoBien) {
            // Provisorio: hasta la Entrega 11 no hay usuarios reales,
            // así que con los campos completos pasamos directo a la intranet.
            window.location.href = 'listado.html';
        }
    });
}
// ---------- FORMULARIO DE REGISTRO ----------

const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    formRegistro.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const correo = document.getElementById('correo-reg');
        const contrasena = document.getElementById('pass-reg');
        const repetir = document.getElementById('pass-rep');
        const rol = document.getElementById('rol');
        const terminos = document.getElementById('terminos');
        const mensajeExito = document.getElementById('registro-exito');

        let todoBien = true;

        if (!validarObligatorio(nombre, 'Escribí tu nombre.')) {
            todoBien = false;
        }

        if (!validarObligatorio(apellido, 'Escribí tu apellido.')) {
            todoBien = false;
        }

        if (!validarCorreo(correo)) {
            todoBien = false;
        }

        // Contraseña: obligatoria y con al menos 8 caracteres
        if (!validarObligatorio(contrasena, 'Elegí una contraseña.')) {
            todoBien = false;
        } else if (contrasena.value.length < 8) {
            mostrarError(contrasena, 'La contraseña tiene que tener al menos 8 caracteres.');
            todoBien = false;
        }

        // Repetir contraseña: obligatoria e igual a la primera
        if (!validarObligatorio(repetir, 'Repetí la contraseña.')) {
            todoBien = false;
        } else if (repetir.value !== contrasena.value) {
            mostrarError(repetir, 'Las contraseñas no coinciden.');
            todoBien = false;
        }

        if (!validarObligatorio(rol, 'Elegí tu rol en el vivero.')) {
            todoBien = false;
        }

        // Términos: un checkbox no tiene texto, se revisa si está tildado
        if (!terminos.checked) {
            mostrarError(terminos, 'Tenés que aceptar los términos y condiciones para crear la cuenta.');
            todoBien = false;
        } else {
            limpiarError(terminos);
        }

        if (todoBien) {
            mensajeExito.hidden = false;
            formRegistro.reset();
        } else {
            mensajeExito.hidden = true;
        }
    });
}