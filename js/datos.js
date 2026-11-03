// ============================================================
// datos.js — Datos de las plantas (Entrega 8)
// Cada objeto sigue el contrato de datos del proyecto.
// En la Entrega 9 estos datos van a venir de una API;
// este array va a quedar como respaldo.
// ============================================================

const plantas = [
    {
        id: 1,
        nombre: 'Cactus de la suerte',
        nombreCientifico: 'Euphorbia trigona',
        categoria: 'suculenta',
        luz: 'sol pleno',
        riego: 'bajo',
        precio: 1500,
        stock: 12,
        fechaIngreso: '2026-03-02',
        aptaMascotas: false,
        etiquetas: ['resistente'],
        foto: 'img/cactus-suerte.jpg',
        notas: 'Requiere muy poca agua. Regar solo cuando la tierra esté completamente seca. Prefiere estar cerca de una ventana con luz natural abundante.'
    },
    {
        id: 2,
        nombre: 'Sansevieria (Ballestera)',
        nombreCientifico: 'Sansevieria trifasciata',
        categoria: 'interior',
        luz: 'media sombra',
        riego: 'bajo',
        precio: 1200,
        stock: 8,
        fechaIngreso: '2026-02-18',
        aptaMascotas: false,
        etiquetas: ['purificadora', 'resistente'],
        foto: 'img/sansevieria.jpg',
        notas: 'Aguanta poca luz y olvidos de riego. Regar cada dos o tres semanas, y menos en invierno.'
    },
    {
        id: 3,
        nombre: 'Lirio de la paz',
        nombreCientifico: 'Spathiphyllum wallisii',
        categoria: 'interior',
        luz: 'sombra',
        riego: 'medio',
        precio: 1800,
        stock: 5,
        fechaIngreso: '2026-04-05',
        aptaMascotas: false,
        etiquetas: ['purificadora', 'floración'],
        foto: 'img/lirio-paz.jpg',
        notas: 'Avisa cuando le falta agua: las hojas se caen. Mantener la tierra apenas húmeda y lejos del sol directo.'
    },
    {
        id: 4,
        nombre: 'Ficus (Árbol de la vida)',
        nombreCientifico: 'Ficus benjamina',
        categoria: 'interior',
        luz: 'media sombra',
        riego: 'medio',
        precio: 1000,
        stock: 10,
        fechaIngreso: '2026-01-27',
        aptaMascotas: false,
        etiquetas: ['purificadora'],
        foto: 'img/ficus.jpg',
        notas: 'No le gustan los cambios de lugar: puede soltar hojas si se lo mueve. Luz abundante, sin sol directo.'
    },
    {
        id: 5,
        nombre: 'Hibisco tropical',
        nombreCientifico: 'Hibiscus rosa-sinensis',
        categoria: 'exterior',
        luz: 'sol pleno',
        riego: 'alto',
        precio: 2000,
        stock: 6,
        fechaIngreso: '2026-03-20',
        aptaMascotas: true,
        etiquetas: ['floración'],
        foto: 'img/hibisco.jpg',
        notas: 'Necesita sol directo para florecer. Regar seguido en verano y protegerlo de las heladas.'
    },
    {
        id: 6,
        nombre: 'Lavanda común',
        nombreCientifico: 'Lavandula angustifolia',
        categoria: 'aromática',
        luz: 'sol pleno',
        riego: 'bajo',
        precio: 1300,
        stock: 15,
        fechaIngreso: '2026-04-12',
        aptaMascotas: false,
        etiquetas: ['floración', 'resistente'],
        foto: 'img/lavanda.jpg',
        notas: 'Prefiere suelos secos y mucho sol. Podarla después de la floración para que mantenga la forma.'
    }
];