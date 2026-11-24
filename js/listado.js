// ============================================================
// listado.js — Intranet: tabla, baja y mensajes (Entregas 8 a 11)
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



// ---------- GRÁFICO DE STOCK POR CATEGORÍA (Chart.js) ----------

const CATEGORIAS = ['interior', 'exterior', 'suculenta', 'aromática'];
let grafico = null;

// Suma el stock de las plantas de cada categoría: [23, 6, 12, 15]
function calcularStockPorCategoria(listaDePlantas) {
    return CATEGORIAS.map(function (categoria) {
        let total = 0;
        listaDePlantas.forEach(function (planta) {
            if (planta.categoria === categoria) {
                total += Number(planta.stock);
            }
        });
        return total;
    });
}

// Dibuja el gráfico la primera vez; las siguientes, solo actualiza los números
function dibujarGrafico(listaDePlantas) {
    const lienzo = document.getElementById('grafico-stock');

    // Si la librería no cargó, la página sigue funcionando sin el gráfico
    if (!lienzo || typeof Chart === 'undefined') {
        return;
    }

    const totales = calcularStockPorCategoria(listaDePlantas);
    const etiquetas = CATEGORIAS.map(capitalizar);

    // Un lector de pantalla no puede "ver" el gráfico: le describimos los números
    const descripcion = etiquetas.map(function (etiqueta, i) {
        return etiqueta + ': ' + totales[i];
    }).join(', ');
    lienzo.setAttribute('aria-label', 'Stock por categoría. ' + descripcion + '.');

    if (grafico) {
        grafico.data.datasets[0].data = totales;
        grafico.update();
        return;
    }

    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    Chart.defaults.color = '#3D4139';

    grafico = new Chart(lienzo, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Unidades en stock',
                data: totales,
                backgroundColor: '#2E7D55',
                hoverBackgroundColor: '#1F4A3A',
                maxBarThickness: 24,
                borderRadius: { topLeft: 4, topRight: 4 },
                borderSkipped: 'bottom'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: 'rgba(18, 24, 21, 0.08)' },
                    border: { display: false }
                }
            }
        }
    });
}


const cuerpoTabla = document.getElementById('tabla-plantas');

if (cuerpoTabla) {
    const cargando = document.getElementById('cargando');
    const errorCarga = document.getElementById('error-carga');

    // Las plantas que se están mostrando en la tabla
    let plantasListado = [];


    // ---------- MENSAJES (con SweetAlert2, desde alertas.js) ----------

    // Si venimos del formulario, la URL trae ?resultado=creada o ?resultado=editada
    function mostrarResultadoDelFormulario() {
        const resultado = new URLSearchParams(window.location.search).get('resultado');

        if (resultado === 'creada') {
            avisarExito('La planta se agregó al catálogo.');
        } else if (resultado === 'editada') {
            avisarExito('Los cambios se guardaron.');
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
        const confirmado = await confirmarAccion(
            '¿Eliminar "' + planta.nombre + '"?',
            'Se borra del catálogo y de la intranet. Esta acción no se puede deshacer.',
            'Sí, eliminar',
            true
        );
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
            dibujarGrafico(plantasListado);

            avisarExito('Se eliminó "' + planta.nombre + '".');
        } catch (error) {
            console.error('Error al eliminar la planta:', error);
            avisarError('No pudimos eliminar la planta', 'Revisá tu conexión e intentá de nuevo.');
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
            dibujarGrafico(plantasListado);
        } catch (error) {
            console.error('Error al cargar el listado:', error);
            cargando.hidden = true;
            errorCarga.hidden = false;
        }
    }

    mostrarResultadoDelFormulario();
    iniciarListado();
}
