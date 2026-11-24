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

// Convierte los caracteres especiales de HTML en texto seguro.
// Así, si alguien escribe <script> en un campo, se muestra como texto y no se ejecuta.
function escaparHTML(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
