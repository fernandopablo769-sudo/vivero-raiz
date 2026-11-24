// ============================================================
// catalogo.js — Catálogo con datos de la API (Entregas 7, 8 y 9)
// ============================================================


// ---------- FUNCIONES QUE ARMAN EL HTML ----------

function crearTarjeta(planta) {
    const nombre = escaparHTML(planta.nombre);

    return `
        <article>
            <img src="${escaparHTML(planta.foto)}" alt="${nombre} en maceta">
            <p class="etiqueta-categoria">${escaparHTML(capitalizar(planta.categoria))}</p>
            <h2>${nombre}</h2>
            <p><em>${escaparHTML(planta.nombreCientifico)}</em></p>
            <p class="precio">${formatearPrecio(planta.precio)}</p>
            <a href="planta.html?id=${escaparHTML(planta.id)}" class="boton">Ver ficha</a>
        </article>
    `;
}

function mostrarPlantas(listaDePlantas, contenedor) {
    let html = '';
    listaDePlantas.forEach(function (planta) {
        html += crearTarjeta(planta);
    });
    contenedor.innerHTML = html;
}


// ---------- CATÁLOGO ----------

const formFiltros = document.getElementById('form-filtros');

if (formFiltros) {
    const buscador = document.getElementById('buscador');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const orden = document.getElementById('orden');
    const botonLimpiar = document.getElementById('limpiar-filtros');
    const contador = document.getElementById('contador-resultados');
    const sinResultados = document.getElementById('sin-resultados');
    const cargando = document.getElementById('cargando');
    const errorCarga = document.getElementById('error-carga');
    const lista = document.getElementById('lista-plantas');

    // Acá se guardan las plantas cuando llegan de la API
    let plantasCatalogo = [];

    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function compararPlantas(a, b) {
        if (orden.value === 'nombre-asc') {
            return a.nombre.localeCompare(b.nombre, 'es');
        }
        if (orden.value === 'nombre-desc') {
            return b.nombre.localeCompare(a.nombre, 'es');
        }
        if (orden.value === 'precio-asc') {
            return a.precio - b.precio;
        }
        return b.precio - a.precio;
    }

    function aplicarFiltros() {
        const textoBuscado = normalizar(buscador.value.trim());
        const categoria = filtroCategoria.value;

        const filtradas = plantasCatalogo.filter(function (planta) {
            const coincideNombre = normalizar(planta.nombre).includes(textoBuscado);
            const coincideCategoria = categoria === 'todas' || planta.categoria === categoria;
            return coincideNombre && coincideCategoria;
        });

        filtradas.sort(compararPlantas);
        mostrarPlantas(filtradas, lista);

        if (filtradas.length === 1) {
            contador.textContent = 'Mostrando 1 planta';
        } else {
            contador.textContent = 'Mostrando ' + filtradas.length + ' plantas';
        }
        sinResultados.hidden = filtradas.length > 0;
    }

    // Los filtros se activan recién cuando hay datos para filtrar
    function activarFiltros() {
        buscador.addEventListener('input', aplicarFiltros);
        filtroCategoria.addEventListener('change', aplicarFiltros);
        orden.addEventListener('change', aplicarFiltros);

        botonLimpiar.addEventListener('click', function () {
            formFiltros.reset();
            aplicarFiltros();
            buscador.focus();
        });
    }

    // Enter en el buscador no recarga la página
    formFiltros.addEventListener('submit', function (evento) {
        evento.preventDefault();
    });

    // Si se llega desde el inicio con "catalogo.html?categoria=interior",
    // el filtro de categoría arranca con esa opción elegida
    function aplicarCategoriaDeLaURL() {
        const categoria = new URLSearchParams(window.location.search).get('categoria');
        const existe = Array.from(filtroCategoria.options).some(function (opcion) {
            return opcion.value === categoria;
        });
        if (existe) {
            filtroCategoria.value = categoria;
        }
    }

    // Pide las plantas a la API y arma el catálogo
    async function iniciarCatalogo() {
        try {
            plantasCatalogo = await obtenerPlantas();
            cargando.hidden = true;
            aplicarCategoriaDeLaURL();
            aplicarFiltros();
            activarFiltros();
        } catch (error) {
            console.error('Error al cargar el catálogo:', error);
            cargando.hidden = true;
            errorCarga.hidden = false;
        }
    }

    iniciarCatalogo();
} 