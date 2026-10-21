// ============================================================
// menu.js — Menú hamburguesa (Entrega 6)
// ============================================================

const botonMenu = document.querySelector('.boton-menu');
const menu = document.getElementById('menu-principal');

if (botonMenu && menu) {
    botonMenu.addEventListener('click', function () {
        // toggle agrega la clase si no está y la saca si está.
        // Además devuelve true si quedó agregada (menú abierto).
        const estaAbierto = menu.classList.toggle('abierto');

        // Actualizamos la información para lectores de pantalla
        botonMenu.setAttribute('aria-expanded', estaAbierto);
        botonMenu.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
    });
}