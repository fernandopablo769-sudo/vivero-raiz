// ============================================================
// alertas.js — Avisos y confirmaciones con SweetAlert2 (Entrega 11)
// ============================================================

// Los botones de las ventanas usan las mismas clases que el resto del sitio
function botonesDelSitio(claseConfirmar) {
    return {
        buttonsStyling: false,
        customClass: {
            confirmButton: claseConfirmar,
            cancelButton: 'boton boton-secundario'
        }
    };
}

// Pregunta antes de hacer algo. Devuelve true si la persona confirma.
// "peligro" pinta el botón de confirmar en bordó, como Eliminar.
async function confirmarAccion(titulo, texto, textoConfirmar, peligro) {
    // Si la librería no cargó (por ejemplo, sin internet), usamos la confirmación del navegador
    if (typeof Swal === 'undefined') {
        return confirm(titulo + '\n' + texto);
    }

    const resultado = await Swal.fire({
        titleText: titulo,
        text: texto,
        icon: peligro ? 'warning' : 'question',
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        focusCancel: peligro,
        ...botonesDelSitio(peligro ? 'boton boton-eliminar' : 'boton')
    });

    return resultado.isConfirmed;
}

// Aviso de éxito chico, en una esquina, que se cierra solo
function avisarExito(texto) {
    if (typeof Swal === 'undefined') {
        return;
    }

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        titleText: texto,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// Aviso de error: queda en pantalla hasta que la persona lo cierra
function avisarError(titulo, texto) {
    if (typeof Swal === 'undefined') {
        alert(titulo + '\n' + texto);
        return;
    }

    Swal.fire({
        titleText: titulo,
        text: texto,
        icon: 'error',
        confirmButtonText: 'Entendido',
        ...botonesDelSitio('boton')
    });
}
