// JavaScript source code

// ======================
// SLIDER MANUAL + AUTO
// ======================

let slides = document.querySelectorAll(".slide");
let actual = 0;

function mostrarSlide(n) {
    slides.forEach(s => s.classList.remove("activo"));
    slides[n].classList.add("activo");
}

// Flechas
document.querySelector(".derecha").addEventListener("click", () => {
    actual++;
    if (actual >= slides.length) actual = 0;
    mostrarSlide(actual);
});

document.querySelector(".izquierda").addEventListener("click", () => {
    actual--;
    if (actual < 0) actual = slides.length - 1;
    mostrarSlide(actual);
});

// Automático
setInterval(() => {
    actual++;
    if (actual >= slides.length) actual = 0;
    mostrarSlide(actual);
}, 5000);


// Datos de ejemplo (simulando lo que verías en el HTML)
const productosList = [
    { nombre: "Producto 1", precio: "$19.99", imagen: "images/hoddie.jpg" },
    { nombre: "Producto 2", precio: "$14.99", imagen: "images/gorra.jpg" },
    { nombre: "Producto 3", precio: "$44.99", imagen: "images/homero.jpg" },
    { nombre: "Producto 4", precio: "$14.99", imagen: "images/sneakers.jpg" }
];

function verProductos() {
    const contenedor = document.getElementById("productosDestacados");
    contenedor.innerHTML = "";
    productosList.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
            <div class="producto-img">
                <img src="${prod.imagen}" alt="${prod.nombre}" width="150" height="150">
            </div>
            <h4>${prod.nombre}</h4>
            <p>${prod.precio}</p>
        `;
        contenedor.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", verProductos);

