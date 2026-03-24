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

// ======================
// MENSAJE SUSCRIPCIÓN
// ======================

const form = document.getElementById("newsletterForm");
const mensaje = document.getElementById("mensajeExito");
const inputEmail = document.getElementById("emailInput");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita que recargue la página

    mensaje.textContent = "Thank you for subscribing!";
    mensaje.classList.add("mostrar-exito");
    mensaje.style.opacity = "1";

    inputEmail.value = "";

    // Ocultar mensaje después de 4 segundos
    setTimeout(() => {
        mensaje.style.opacity = "0";
        mensaje.classList.remove("mostrar-exito");
    }, 4000);
});

// Métodos de pago en el footer
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('footer').forEach(footer => {
        footer.insertAdjacentHTML('beforeend', `
            <div class="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-white/10 max-w-7xl mx-auto px-4">
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/visa.svg"        alt="Visa"             class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/mastercard.svg"   alt="Mastercard"       class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/amex.svg"         alt="American Express" class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/paypal.svg"       alt="PayPal"           class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/apple-pay.svg"    alt="Apple Pay"        class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/google-pay.svg"   alt="Google Pay"       class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/discover.svg"     alt="Discover"         class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/diners.svg"       alt="Diners Club"      class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/shopify.svg"      alt="Shop Pay"         class="h-8 rounded" />
                <img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/venmo.svg"        alt="Venmo"            class="h-8 rounded" />
            </div>
        `);
    });
});
