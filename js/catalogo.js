// ============================================================
// catalogo.js — Catálogo generado desde los datos (Entregas 7 y 8)
// ============================================================


// ---------- FUNCIONES QUE ARMAN EL HTML ----------

// Arma el HTML de UNA tarjeta a partir de UNA planta
function crearTarjeta(planta) {
    return `
        <article>
            <img src="${planta.foto}" alt="${planta.nombre} en maceta">
            <p class="etiqueta-categoria">${capitalizar(planta.categoria)}</p>
            <h2>${planta.nombre}</h2>
            <p><em>${planta.nombreCientifico}</em></p>
            <p class="precio">${formatearPrecio(planta.precio)}</p>
            <a href="planta.html?id=${planta.id}" class="boton">Ver ficha</a>
        </article>
    `;
}

// Arma la lista completa: recorre las plantas y pone todas las tarjetas en el contenedor
function mostrarPlantas(listaDePlantas, contenedor) {
    let html = '';
    listaDePlantas.forEach(function (planta) {
        html += crearTarjeta(planta);
    });
    contenedor.innerHTML = html;
}


// ---------- BUSCADOR, FILTROS Y ORDEN ----------

const formFiltros = document.getElementById('form-filtros');

if (formFiltros) {
    const buscador = document.getElementById('buscador');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const orden = document.getElementById('orden');
    const botonLimpiar = document.getElementById('limpiar-filtros');
    const contador = document.getElementById('contador-resultados');
    const sinResultados = document.getElementById('sin-resultados');
    const lista = document.getElementById('lista-plantas');

    // Minúsculas y sin acentos: "Árbol" → "arbol"
    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Decide qué planta va primero según el orden elegido
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
        // precio-desc
        return b.precio - a.precio;
    }

    function aplicarFiltros() {
        const textoBuscado = normalizar(buscador.value.trim());
        const categoria = filtroCategoria.value;

        // 1. Filtrar: quedarse solo con las plantas que coinciden
        const filtradas = plantas.filter(function (planta) {
            const coincideNombre = normalizar(planta.nombre).includes(textoBuscado);
            const coincideCategoria = categoria === 'todas' || planta.categoria === categoria;
            return coincideNombre && coincideCategoria;
        });

        // 2. Ordenar las que quedaron
        filtradas.sort(compararPlantas);

        // 3. Dibujar las tarjetas
        mostrarPlantas(filtradas, lista);

        // 4. Contador y mensaje de "no encontramos"
        if (filtradas.length === 1) {
            contador.textContent = 'Mostrando 1 planta';
        } else {
            contador.textContent = 'Mostrando ' + filtradas.length + ' plantas';
        }
        sinResultados.hidden = filtradas.length > 0;
    }

    buscador.addEventListener('input', aplicarFiltros);
    filtroCategoria.addEventListener('change', aplicarFiltros);
    orden.addEventListener('change', aplicarFiltros);

    botonLimpiar.addEventListener('click', function () {
        formFiltros.reset();
        aplicarFiltros();
        buscador.focus();
    });

    formFiltros.addEventListener('submit', function (evento) {
        evento.preventDefault();
    });

    // Al cargar la página, dibujamos el catálogo por primera vez
    aplicarFiltros();
}