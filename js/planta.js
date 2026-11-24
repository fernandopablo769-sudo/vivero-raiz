// ============================================================
// planta.js — Ficha de una planta según el id de la URL (Entrega 8)
// ============================================================

// Arma el HTML de la ficha completa de una planta
function crearFicha(planta) {
    const nombre = escaparHTML(planta.nombre);

    // Las etiquetas son un array: ['purificadora', 'floración']
    // Las pasamos a un texto: "Purificadora, Floración"
    let etiquetas = 'Sin etiquetas';
    if (planta.etiquetas.length > 0) {
        etiquetas = planta.etiquetas.map(function (etiqueta) {
            return escaparHTML(capitalizar(etiqueta));
        }).join(', ');
    }

    return `
        <h1>${nombre}</h1>
        <p><em>${escaparHTML(planta.nombreCientifico)}</em></p>

        <section class="galeria">
            <img src="${escaparHTML(planta.foto)}" alt="${nombre} en maceta">
        </section>

        <section>
            <h2>Especificaciones</h2>
            <table class="tabla-ficha">
                <tr><th scope="row">Categoría</th><td>${escaparHTML(capitalizar(planta.categoria))}</td></tr>
                <tr><th scope="row">Luz</th><td>${escaparHTML(capitalizar(planta.luz))}</td></tr>
                <tr><th scope="row">Riego</th><td>${escaparHTML(capitalizar(planta.riego))}</td></tr>
                <tr><th scope="row">Apta mascotas</th><td>${planta.aptaMascotas ? 'Sí' : 'No'}</td></tr>
                <tr><th scope="row">Etiquetas</th><td>${etiquetas}</td></tr>
                <tr><th scope="row">Precio</th><td>${formatearPrecio(planta.precio)}</td></tr>
                <tr><th scope="row">Stock</th><td>${escaparHTML(planta.stock)} unidades</td></tr>
            </table>
        </section>

        <section>
            <h2>Cuidados particulares</h2>
            <p>${escaparHTML(planta.notas)}</p>
        </section>
    `;
}

const contenedorFicha = document.getElementById('ficha-planta');

if (contenedorFicha) {
    const cargando = document.getElementById('cargando');
    const noEncontrada = document.getElementById('ficha-no-encontrada');
    const errorCarga = document.getElementById('error-carga');

    async function iniciarFicha() {
        // Leer el id de la URL: "planta.html?id=3" → "3"
        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get('id');

        // Si la URL no trae id, no tiene sentido consultar la API
        if (!id) {
            cargando.hidden = true;
            noEncontrada.hidden = false;
            return;
        }

        try {
            const planta = await obtenerPlanta(id);
            cargando.hidden = true;

            if (planta) {
                contenedorFicha.innerHTML = crearFicha(planta);
                document.title = 'Vivero Raíz - ' + planta.nombre;
            } else {
                noEncontrada.hidden = false;
            }
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
            cargando.hidden = true;
            errorCarga.hidden = false;
        }
    }

    iniciarFicha();
}