// ============================================================
// catalogo.js — Buscador, filtros y orden del catálogo (Entrega 7)
// ============================================================

const formFiltros = document.getElementById('form-filtros');

// Solo se ejecuta si estamos en la página del catálogo
if (formFiltros) {

    // ---------- ELEMENTOS DE LA PÁGINA ----------
    const buscador = document.getElementById('buscador');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const orden = document.getElementById('orden');
    const botonLimpiar = document.getElementById('limpiar-filtros');
    const contador = document.getElementById('contador-resultados');
    const sinResultados = document.getElementById('sin-resultados');
    const lista = document.getElementById('lista-plantas');

    // Todas las tarjetas del catálogo, guardadas en un array
    const tarjetas = Array.from(lista.querySelectorAll('article'));


    // ---------- FUNCIONES ----------

    // Pasa un texto a minúsculas y le saca los acentos.
    // Así "Árbol" y "arbol" se consideran iguales al buscar.
    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Decide qué tarjeta va primero según el orden elegido.
    // Si devuelve un número negativo, "a" va antes que "b".
    function compararTarjetas(a, b) {
        if (orden.value === 'nombre-asc') {
            return a.dataset.nombre.localeCompare(b.dataset.nombre, 'es');
        }
        if (orden.value === 'nombre-desc') {
            return b.dataset.nombre.localeCompare(a.dataset.nombre, 'es');
        }
        if (orden.value === 'precio-asc') {
            return Number(a.dataset.precio) - Number(b.dataset.precio);
        }
        // precio-desc
        return Number(b.dataset.precio) - Number(a.dataset.precio);
    }

    // La función principal: filtra, ordena y actualiza el contador
    function aplicarFiltros() {
        const textoBuscado = normalizar(buscador.value.trim());
        const categoria = filtroCategoria.value;
        let visibles = 0;

        // 1. Recorrer cada tarjeta y decidir si se muestra o se oculta
        tarjetas.forEach(function (tarjeta) {
            const nombre = normalizar(tarjeta.dataset.nombre);
            const coincideNombre = nombre.includes(textoBuscado);
            const coincideCategoria = categoria === 'todas' || tarjeta.dataset.categoria === categoria;

            if (coincideNombre && coincideCategoria) {
                tarjeta.hidden = false;
                visibles++;
            } else {
                tarjeta.hidden = true;
            }
        });

        // 2. Ordenar las tarjetas y volver a ponerlas en la grilla en ese orden
        const ordenadas = tarjetas.slice().sort(compararTarjetas);
        ordenadas.forEach(function (tarjeta) {
            lista.appendChild(tarjeta);
        });

        // 3. Actualizar el contador y el mensaje de "no encontramos"
        if (visibles === 1) {
            contador.textContent = 'Mostrando 1 planta';
        } else {
            contador.textContent = 'Mostrando ' + visibles + ' plantas';
        }
        sinResultados.hidden = visibles > 0;
    }


    // ---------- EVENTOS ----------

    // Mientras se escribe en el buscador
    buscador.addEventListener('input', aplicarFiltros);

    // Cuando se cambia la categoría o el orden
    filtroCategoria.addEventListener('change', aplicarFiltros);
    orden.addEventListener('change', aplicarFiltros);

    // Botón "Limpiar filtros": vuelve todo al estado inicial
    botonLimpiar.addEventListener('click', function () {
        formFiltros.reset();
        aplicarFiltros();
        buscador.focus();
    });

    // Si alguien aprieta Enter en el buscador, que no se recargue la página
    formFiltros.addEventListener('submit', function (evento) {
        evento.preventDefault();
    });

    // Al cargar la página, aplicamos el orden inicial (Nombre A a Z)
    aplicarFiltros();
}