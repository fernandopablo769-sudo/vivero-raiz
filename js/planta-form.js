// ============================================================
// planta-form.js — Alta y edición de plantas contra la API (Entrega 10)
// ============================================================

const formPlanta = document.getElementById('form-planta');

if (formPlanta) {
    // Si la URL trae ?id=..., estamos editando; si no, es un alta
    const parametros = new URLSearchParams(window.location.search);
    const idEdicion = parametros.get('id');

    const titulo = document.getElementById('titulo-form');
    const bajada = document.getElementById('bajada-form');
    const cargando = document.getElementById('cargando-form');
    const errorForm = document.getElementById('form-error');
    const botonGuardar = document.getElementById('boton-guardar');


    // ---------- MENSAJE DE ERROR GENERAL ----------

    function mostrarErrorGeneral(texto) {
        errorForm.textContent = texto;
        errorForm.hidden = false;
    }


    // ---------- DEL FORMULARIO AL OBJETO, Y AL REVÉS ----------

    // Lee el formulario y arma un objeto con los campos del contrato
    function leerFormulario() {
        const etiquetas = [];
        formPlanta.querySelectorAll('input[name="etiquetas"]:checked').forEach(function (casilla) {
            etiquetas.push(casilla.value);
        });

        const foto = document.getElementById('foto-planta').value.trim();

        return {
            nombre: document.getElementById('nombre-planta').value.trim(),
            nombreCientifico: document.getElementById('nombre-cientifico').value.trim(),
            categoria: document.getElementById('categoria-planta').value,
            luz: formPlanta.querySelector('input[name="luz"]:checked').value,
            riego: document.getElementById('riego-planta').value,
            precio: Number(document.getElementById('precio-planta').value),
            stock: Number(document.getElementById('stock-planta').value),
            fechaIngreso: document.getElementById('fecha-ingreso').value,
            aptaMascotas: formPlanta.querySelector('input[name="aptaMascotas"]:checked').value === 'si',
            etiquetas: etiquetas,
            foto: foto || 'img/logo.svg',
            notas: document.getElementById('notas-planta').value.trim()
        };
    }

    // Tilda el radio o checkbox que tenga ese nombre y ese valor
    function marcarOpcion(nombre, valor) {
        const opcion = formPlanta.querySelector('input[name="' + nombre + '"][value="' + valor + '"]');
        if (opcion) {
            opcion.checked = true;
        }
    }

    // Hace lo contrario de leerFormulario: carga una planta en el formulario
    function llenarFormulario(planta) {
        document.getElementById('nombre-planta').value = planta.nombre;
        document.getElementById('nombre-cientifico').value = planta.nombreCientifico;
        document.getElementById('categoria-planta').value = planta.categoria;
        document.getElementById('riego-planta').value = planta.riego;
        document.getElementById('precio-planta').value = planta.precio;
        document.getElementById('stock-planta').value = planta.stock;
        document.getElementById('fecha-ingreso').value = planta.fechaIngreso;
        document.getElementById('foto-planta').value = planta.foto;
        document.getElementById('notas-planta').value = planta.notas;

        marcarOpcion('luz', planta.luz);
        marcarOpcion('aptaMascotas', planta.aptaMascotas ? 'si' : 'no');
        planta.etiquetas.forEach(function (etiqueta) {
            marcarOpcion('etiquetas', etiqueta);
        });
    }


    // ---------- VALIDACIÓN (reutiliza las funciones de validaciones.js) ----------

    function validarFormulario() {
        let todoBien = true;

        if (!validarObligatorio(document.getElementById('nombre-planta'), 'Escribí el nombre de la planta.')) {
            todoBien = false;
        }
        if (!validarObligatorio(document.getElementById('nombre-cientifico'), 'Escribí el nombre científico.')) {
            todoBien = false;
        }
        if (!validarObligatorio(document.getElementById('categoria-planta'), 'Elegí una categoría.')) {
            todoBien = false;
        }
        if (!validarObligatorio(document.getElementById('riego-planta'), 'Elegí cuánto riego necesita.')) {
            todoBien = false;
        }
        if (!validarObligatorio(document.getElementById('fecha-ingreso'), 'Elegí la fecha de ingreso.')) {
            todoBien = false;
        }

        // Radios: se revisa si hay alguna opción tildada en el grupo
        const grupoLuz = document.getElementById('grupo-luz');
        if (!formPlanta.querySelector('input[name="luz"]:checked')) {
            mostrarError(grupoLuz, 'Elegí cuánta luz necesita.');
            todoBien = false;
        } else {
            limpiarError(grupoLuz);
        }

        const grupoMascotas = document.getElementById('grupo-mascotas');
        if (!formPlanta.querySelector('input[name="aptaMascotas"]:checked')) {
            mostrarError(grupoMascotas, 'Indicá si es apta para mascotas.');
            todoBien = false;
        } else {
            limpiarError(grupoMascotas);
        }

        // Precio: obligatorio y mayor a 0
        const precio = document.getElementById('precio-planta');
        if (!validarObligatorio(precio, 'Escribí el precio.')) {
            todoBien = false;
        } else if (Number(precio.value) <= 0) {
            mostrarError(precio, 'El precio tiene que ser mayor a 0.');
            todoBien = false;
        }

        // Stock: obligatorio, entero y 0 o más
        const stock = document.getElementById('stock-planta');
        if (!validarObligatorio(stock, 'Escribí el stock.')) {
            todoBien = false;
        } else if (!Number.isInteger(Number(stock.value)) || Number(stock.value) < 0) {
            mostrarError(stock, 'El stock tiene que ser un número entero, 0 o mayor.');
            todoBien = false;
        }

        return todoBien;
    }


    // ---------- MODO EDICIÓN: traer la planta y precargar el formulario ----------

    async function cargarPlantaParaEditar() {
        titulo.textContent = 'Editar planta';
        bajada.textContent = 'Modificá los datos que necesites y guardá los cambios.';
        document.title = 'Vivero Raíz - Editar planta';

        formPlanta.hidden = true;
        cargando.hidden = false;

        try {
            const planta = await obtenerPlanta(idEdicion);
            cargando.hidden = true;

            if (planta) {
                llenarFormulario(planta);
                formPlanta.hidden = false;
            } else {
                mostrarErrorGeneral('No encontramos la planta que querés editar. Volvé al listado y elegila de nuevo.');
            }
        } catch (error) {
            console.error('Error al cargar la planta:', error);
            cargando.hidden = true;
            mostrarErrorGeneral('No pudimos cargar los datos de la planta. Revisá tu conexión y recargá la página.');
        }
    }


    // ---------- GUARDAR ----------

    formPlanta.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        errorForm.hidden = true;

        if (!validarFormulario()) {
            return;
        }

        const datos = leerFormulario();

        // Desactivamos el botón para que no se guarde dos veces
        botonGuardar.disabled = true;
        botonGuardar.textContent = 'Guardando…';

        try {
            if (idEdicion) {
                await actualizarPlanta(idEdicion, datos);
                window.location.href = 'listado.html?resultado=editada';
            } else {
                await crearPlanta(datos);
                window.location.href = 'listado.html?resultado=creada';
            }
        } catch (error) {
            console.error('Error al guardar la planta:', error);
            avisarError('No pudimos guardar la planta', 'Revisá tu conexión e intentá de nuevo.');
            botonGuardar.disabled = false;
            botonGuardar.textContent = 'Guardar planta';
        }
    });


    // Al abrir la página: si hay id, cargamos la planta para editarla
    if (idEdicion) {
        cargarPlantaParaEditar();
    }
}