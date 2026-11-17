// ============================================================
// listado.js — Tabla de la intranet generada desde los datos (Entrega 8)
// ============================================================

// Arma el HTML de UNA fila de la tabla a partir de UNA planta
function crearFila(planta) {
    return `
        <tr>
            <td>${planta.id}</td>
            <td>${planta.nombre}</td>
            <td>${capitalizar(planta.categoria)}</td>
            <td>${formatearPrecio(planta.precio)}</td>
            <td>${planta.stock}</td>
            <td>
                <div class="acciones-tabla">
                    <a href="planta-form.html?id=${planta.id}" class="boton boton-chico boton-secundario">Editar</a>
                    <button type="button" class="boton boton-chico boton-eliminar" data-id="${planta.id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `;
}

// Arma la tabla completa: una fila por cada planta
function mostrarTabla(listaDePlantas, cuerpoTabla) {
    let html = '';
    listaDePlantas.forEach(function (planta) {
        html += crearFila(planta);
    });
    cuerpoTabla.innerHTML = html;
}

const cuerpoTabla = document.getElementById('tabla-plantas');

if (cuerpoTabla) {
    mostrarTabla(plantas, cuerpoTabla);
}