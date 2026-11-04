// ============================================================
// planta.js — Ficha de una planta según el id de la URL (Entrega 8)
// ============================================================

// Arma el HTML de la ficha completa de una planta
function crearFicha(planta) {
    // Las etiquetas son un array: ['purificadora', 'floración']
    // Las pasamos a un texto: "Purificadora, Floración"
    let etiquetas = 'Sin etiquetas';
    if (planta.etiquetas.length > 0) {
        etiquetas = planta.etiquetas.map(capitalizar).join(', ');
    }

    return `
        <h1>${planta.nombre}</h1>
        <p><em>${planta.nombreCientifico}</em></p>

        <section class="galeria">
            <img src="${planta.foto}" alt="${planta.nombre} en maceta">
        </section>

        <section>
            <h2>Especificaciones</h2>
            <table class="tabla-ficha">
                <tr><th scope="row">Categoría</th><td>${capitalizar(planta.categoria)}</td></tr>
                <tr><th scope="row">Luz</th><td>${capitalizar(planta.luz)}</td></tr>
                <tr><th scope="row">Riego</th><td>${capitalizar(planta.riego)}</td></tr>
                <tr><th scope="row">Apta mascotas</th><td>${planta.aptaMascotas ? 'Sí' : 'No'}</td></tr>
                <tr><th scope="row">Etiquetas</th><td>${etiquetas}</td></tr>
                <tr><th scope="row">Precio</th><td>${formatearPrecio(planta.precio)}</td></tr>
                <tr><th scope="row">Stock</th><td>${planta.stock} unidades</td></tr>
            </table>
        </section>

        <section>
            <h2>Cuidados particulares</h2>
            <p>${planta.notas}</p>
        </section>
    `;
}

const contenedorFicha = document.getElementById('ficha-planta');

if (contenedorFicha) {
    // 1. Leer el id de la URL: "planta.html?id=3" → 3
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get('id'));

    // 2. Buscar en el array la planta que tiene ese id
    const planta = plantas.find(function (p) {
        return p.id === id;
    });

    // 3. Si existe, mostramos su ficha; si no, el mensaje de error
    if (planta) {
        contenedorFicha.innerHTML = crearFicha(planta);
        document.title = 'Vivero Raíz - ' + planta.nombre;
    } else {
        document.getElementById('ficha-no-encontrada').hidden = false;
    }
}