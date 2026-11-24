// ============================================================
// listado.js — Intranet: tabla, baja y mensajes (Entregas 8, 9 y 10)
// ============================================================

// Arma el HTML de UNA fila de la tabla
function crearFila(planta) {
    const id = escaparHTML(planta.id);

    return `
        <tr>
            <td>${id}</td>
            <td>${escaparHTML(planta.nombre)}</td>
            <td>${escaparHTML(capitalizar(planta.categoria))}</td>
            <td>${formatearPrecio(planta.precio)}</td>
            <td>${escaparHTML(planta.stock)}</td>
            <td>
                <div class="acciones-tabla">
                    <a href="planta-form.html?id=${id}" class="boton boton-chico boton-secundario">Editar</a>
                    <button type="button" class="boton boton-chico boton-eliminar" data-id="${id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `;
}

// Arma la tabla completa
function mostrarTabla(listaDePlantas, cuerpoTabla) {
    let html = '';
    listaDePlantas.forEach(function (planta) {
        html += crearFila(planta);
    });
    cuerpoTabla.innerHTML = html;
}


const cuerpoTabla = document.getElementById('tabla-plantas');

if (cuerpoTabla) {
    const cargando = document.getElementById('cargando');
    const errorCarga = document.getElementById('error-carga');
    const mensajeExito = document.getElementById('listado-exito');
    const mensajeError = document.getElementById('listado-error');

    // Las plantas que se están mostrando en la tabla
    let plantasListado = [];


    // ---------- MENSAJES ----------

    function mostrarExito(texto) {
        mensajeError.hidden = true;
        mensajeExito.textContent = texto;
        mensajeExito.hidden = false;
    }

    function mostrarErrorOperacion(texto) {
        mensajeExito.hidden = true;
        mensajeError.textContent = texto;
        mensajeError.hidden = false;
    }

    // Si venimos del formulario, la URL trae ?resultado=creada o ?resultado=editada
    function mostrarResultadoDelFormulario() {
        const resultado = new URLSearchParams(window.location.search).get('resultado');

        if (resultado === 'creada') {
            mostrarExito('La planta se agregó al catálogo.');
        } else if (resultado === 'editada') {
            mostrarExito('Los cambios se guardaron.');
        }

        // Limpiamos la URL, así el mensaje no vuelve a aparecer si se recarga la página
        if (resultado) {
            history.replaceState(null, '', 'listado.html');
        }
    }


    // ---------- BAJA ----------

    async function borrarPlanta(id) {
        const planta = plantasListado.find(function (p) {
            return p.id === id;
        });

        // Confirmación previa: si la persona cancela, no se borra nada
        const confirmado = confirm('¿Eliminar "' + planta.nombre + '"? Esta acción no se puede deshacer.');
        if (!confirmado) {
            return;
        }

        try {
            await eliminarPlanta(id);

            // Sacamos la planta de la lista y redibujamos la tabla, sin recargar la página
            plantasListado = plantasListado.filter(function (p) {
                return p.id !== id;
            });
            mostrarTabla(plantasListado, cuerpoTabla);

            mostrarExito('Se eliminó "' + planta.nombre + '".');
        } catch (error) {
            console.error('Error al eliminar la planta:', error);
            mostrarErrorOperacion('No pudimos eliminar la planta. Revisá tu conexión e intentá de nuevo.');
        }
    }

    // Un solo "escuchador" en la tabla para todos los botones Eliminar
    cuerpoTabla.addEventListener('click', function (evento) {
        const boton = evento.target.closest('.boton-eliminar');
        if (boton) {
            borrarPlanta(boton.dataset.id);
        }
    });


    // ---------- CARGA INICIAL ----------

    async function iniciarListado() {
        try {
            plantasListado = await obtenerPlantas();
            cargando.hidden = true;
            mostrarTabla(plantasListado, cuerpoTabla);
        } catch (error) {
            console.error('Error al cargar el listado:', error);
            cargando.hidden = true;
            errorCarga.hidden = false;
        }
    }

    mostrarResultadoDelFormulario();
    iniciarListado();
}
