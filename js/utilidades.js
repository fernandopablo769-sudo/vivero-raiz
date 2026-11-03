// ============================================================
// utilidades.js — Funciones de formato que usan varias páginas
// ============================================================

// Convierte un número en precio con formato argentino: 1500 → "$ 1.500"
function formatearPrecio(numero) {
    return '$ ' + numero.toLocaleString('es-AR');
}

// Pone la primera letra en mayúscula: "suculenta" → "Suculenta"
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}