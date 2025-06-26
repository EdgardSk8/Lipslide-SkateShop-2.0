let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  agregarBotonCarrito();
  prepararBotonesAgregar();
});

function agregarBotonCarrito() {
  const boton = document.createElement("button");
  boton.id = "boton-ver-carrito";
  boton.textContent = "🛒 Ver Carrito";
  document.body.appendChild(boton);

  boton.addEventListener("click", mostrarCarritoModal);
}

function prepararBotonesAgregar() {
  document.body.addEventListener("click", e => {
    if (e.target.matches(".btn-agregar-carrito")) {
      const card = e.target.closest(".cards");
      const marca = card.querySelector("h2")?.textContent || "Sin marca";
      const precioTexto = card.querySelector("p strong")?.nextSibling?.nodeValue || "$0";
      const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ""));
      const imagen = card.querySelector("img")?.src || "";

      agregarAlCarrito(marca, precio, imagen);
    }
  });
}

function agregarAlCarrito(marca, precio, imagen) {
  const existente = carrito.find(p => p.marca === marca && p.precio === precio);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ marca, precio, imagen, cantidad: 1 });
  }
  mostrarToast(`Se agregó al carrito: ${marca}`);
}

function mostrarCarritoModal() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  // Si el modal ya existe, no crees otro, solo actualiza
  let modalExistente = document.querySelector(".modal-carrito");
  if (modalExistente) {
    actualizarContenidoModal(modalExistente);
    return;
  }

  const modal = document.createElement("div");
  modal.className = "modal-carrito";

  const contenido = document.createElement("div");
  contenido.className = "modal-contenido animar-entrada";

  // Función cerrar modal con animación
  function cerrarModal() {
    contenido.classList.add("cerrar");
    contenido.addEventListener("animationend", () => modal.remove(), { once: true });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  const cerrar = document.createElement("span");
  cerrar.className = "cerrar-modal";
  cerrar.innerHTML = "&times;";
  cerrar.addEventListener("click", cerrarModal);

  const contenidoScroll = document.createElement("div");
  contenidoScroll.className = "contenido-scroll";

  const titulo = document.createElement("h2");
  titulo.textContent = "Lista de productos";
  contenidoScroll.appendChild(titulo);

  const lista = document.createElement("ul");
  lista.className = "lista-carrito";

  const total = document.createElement("div");
  total.className = "total-carrito";

  const botonWhatsApp = document.createElement("a");
  botonWhatsApp.className = "btn-whatsapp";
  botonWhatsApp.target = "_blank";

  contenidoScroll.appendChild(lista);
  contenidoScroll.appendChild(total);
  contenidoScroll.appendChild(botonWhatsApp);

  contenido.appendChild(cerrar);
  contenido.appendChild(contenidoScroll);
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  // Función para actualizar lista y total en el modal
  function actualizarContenidoModal(modalRef) {
    const listaRef = modalRef.querySelector(".lista-carrito");
    const totalRef = modalRef.querySelector(".total-carrito");
    const btnWhatsAppRef = modalRef.querySelector(".btn-whatsapp");

    listaRef.innerHTML = "";
    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="item-carrito">
          <img src="${item.imagen}" alt="${item.marca}">
          <div class="info">
            <span><strong>${item.marca}</strong> - $${item.precio}</span>
            <div class="cantidad-controles">
              <button class="btn-menos" data-index="${index}">−</button>
              <span class="cantidad">${item.cantidad}</span>
              <button class="btn-mas" data-index="${index}">+</button>
            </div>
          </div>
        </div>
      `;
      listaRef.appendChild(li);
    });

    totalRef.textContent = `Total: $${calcularTotal()}`;
    btnWhatsAppRef.href = generarMensajeWhatsApp();
    botonWhatsApp.textContent = "Enviar por Whatsapp";
  }

  // Inicializa el contenido la primera vez
  actualizarContenidoModal(modal);

  // Manejar clicks + y - sin recrear modal
  lista.addEventListener("click", e => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("btn-mas")) {
      carrito[index].cantidad++;
      actualizarContenidoModal(modal);
    } else if (e.target.classList.contains("btn-menos")) {
      carrito[index].cantidad--;
      if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
      if (carrito.length === 0) {
        // Cerrar modal si carrito vacio
        cerrarModal();
      } else {
        actualizarContenidoModal(modal);
      }
    }
  });
}

function calcularTotal() {
  return carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0).toFixed(2);
}

function generarMensajeWhatsApp() {
  let mensaje = "Hola, me gustaria pedir lo siguiente:%0A";
  carrito.forEach(p => {
    mensaje += `• ${p.marca} - $${p.precio} x ${p.cantidad}%0A`;
  });
  mensaje += `%0ATotal: $${calcularTotal()}`;
  return `https://wa.me/50585310766?text=${mensaje}`;

}

function mostrarToast(mensaje) {
  let toast = document.querySelector(".toast-notificacion");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notificacion";
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  toast.classList.add("mostrar");

  // Quitar después de 2 segundos
  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2000);
}

