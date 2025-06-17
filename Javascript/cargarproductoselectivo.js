// ------------------------------
// CONFIGURACIÓN INICIAL
// ------------------------------
const JSON_URL = "/Base de datos/BD.json";

const categorias = {
  "Decks": ["Tabla", "Rodamientos", "Lija", "Llave", "Pivot"],
  "Accesorios": ["Cadena"],
  "Stickers": ["Sticker"],
  "Ropa": ["Ropa"]
};

// ------------------------------
// INICIO
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosPorCategorias();
  inicializarFiltros();
});

// ------------------------------
// CARGA INICIAL POR CATEGORÍAS
// ------------------------------
function cargarProductosPorCategorias() {
  cargarProductos({
    contenedorId: "contenedor-productos-skate",
    tiposPermitidos: categorias["Decks"]
  });

  cargarProductos({
    contenedorId: "contenedor-productos-accesorios",
    tiposPermitidos: categorias["Accesorios"]
  });

  cargarProductos({
    contenedorId: "contenedor-productos-stickers",
    tiposPermitidos: categorias["Stickers"]
  });

  cargarProductos({
    contenedorId: "contenedor-productos-ropa",
    tiposPermitidos: categorias["Ropa"]
  });
}

// ------------------------------
// FUNCIÓN DE CARGA GENERAL
// ------------------------------
function cargarProductos({ contenedorId, tiposPermitidos }) {
  obtenerProductos()
    .then(BD => {
      const contenedor = document.getElementById(contenedorId);
      if (!contenedor) return;

      contenedor.innerHTML = "";

      const productosFiltrados = filtrarProductos(BD, tiposPermitidos);

      productosFiltrados.forEach((producto, index) => {
        const identificador = `${contenedorId}-${index}`;
        const { card, idSplide, mostrarFlechas } = crearCardProducto(producto, identificador);

        contenedor.appendChild(card);
        montarCarrusel(idSplide, mostrarFlechas);
      });
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
}

// ------------------------------
// OBTENER PRODUCTOS DEL JSON
// ------------------------------
function obtenerProductos() {
  return fetch(JSON_URL).then(res => res.json());
}

// ------------------------------
// FILTRAR PRODUCTOS POR TIPO Y DISPONIBILIDAD
// ------------------------------
function filtrarProductos(productos, tiposPermitidos) {
  return productos.filter(p =>
    p.Disponible === true &&
    tiposPermitidos.includes(p.Tipo)
  );
}

// ------------------------------
// CREAR CARD DE PRODUCTO
// ------------------------------
function crearCardProducto(producto, identificador) {
  const card = document.createElement("div");
  card.classList.add("cards");

  const imagenes = producto.Imagenes || [];
  const carruselHtml = crearCarrusel(imagenes, identificador);

  card.innerHTML = `
    ${carruselHtml}
    <div class="info">
      <h2>${producto.Marca}</h2><br>
      <p>${producto.Descripcion}</p><br>
      <p>
        <strong>Precio:</strong> $${producto.Precio}<br>
        ${producto.Medida ? `<br><strong>Medida:</strong> ${producto.Medida}` : ""}
      </p>
      <br>
      <div class="botones">
        <button>Agregar al carrito</button>
      </div>
    </div>
  `;

  return {
    card,
    idSplide: `splide-${identificador}`,
    mostrarFlechas: imagenes.length > 1
  };
}

// ------------------------------
// CREAR HTML DEL CARRUSEL SPLIDE
// ------------------------------
function crearCarrusel(imagenes, identificador) {
  const slides = imagenes.map(imagen => `
    <li class="splide__slide">
      <img src="${imagen}" alt="Imagen de producto">
    </li>
  `).join("");

  return `
    <div id="splide-${identificador}" class="splide">
      <div class="splide__track">
        <ul class="splide__list">
          ${slides}
        </ul>
      </div>
    </div>
  `;
}

// ------------------------------
// MONTAR CARRUSEL SPLIDE
// ------------------------------
function montarCarrusel(id, mostrarFlechas) {
  new Splide(`#${id}`, {
    type: 'loop',
    pagination: true,
    arrows: mostrarFlechas
  }).mount();
}

// ------------------------------
// FILTRO CATEGORÍA / TIPO
// ------------------------------
function inicializarFiltros() {
  const selectCategoria = document.getElementById("select-categoria");
  const selectTipo = document.getElementById("select-tipo");
  const contenedorFiltrado = document.getElementById("contenedor-productos-filtrados");

  // Llenar select de categorías
  selectCategoria.innerHTML = `<option value="">Todos los productos</option>`;
  Object.keys(categorias).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    selectCategoria.appendChild(option);
  });

  // Al cambiar categoría
  selectCategoria.addEventListener("change", () => {
    const categoriaSeleccionada = selectCategoria.value;

    selectTipo.innerHTML = `<option value="">Todos</option>`;
    selectTipo.disabled = !categoriaSeleccionada;

    contenedorFiltrado.innerHTML = "";

    if (categoriaSeleccionada) {
      categorias[categoriaSeleccionada].forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        selectTipo.appendChild(option);
      });

      cargarProductos({
        contenedorId: "contenedor-productos-filtrados",
        tiposPermitidos: categorias[categoriaSeleccionada]
      });

      ocultarSecciones(); // opcional
    } else {
      contenedorFiltrado.innerHTML = "";
      mostrarSecciones(); // opcional
    }
  });

  // Al cambiar tipo
  selectTipo.addEventListener("change", () => {
    const categoriaSeleccionada = selectCategoria.value;
    const tipoSeleccionado = selectTipo.value;

    contenedorFiltrado.innerHTML = "";

    if (tipoSeleccionado) {
      cargarProductos({
        contenedorId: "contenedor-productos-filtrados",
        tiposPermitidos: [tipoSeleccionado]
      });
    } else {
      cargarProductos({
        contenedorId: "contenedor-productos-filtrados",
        tiposPermitidos: categorias[categoriaSeleccionada]
      });
    }
  });
}

// ------------------------------
// OPCIONAL: Ocultar/Mostrar secciones cuando se filtra
// ------------------------------
function ocultarSecciones() {
  document.getElementById("seccion-2").style.display = "none";
  document.getElementById("seccion-3").style.display = "none";
  document.getElementById("seccion-4").style.display = "none";
  document.getElementById("seccion-5").style.display = "none";
}

function mostrarSecciones() {
  document.getElementById("seccion-2").style.display = "block";
  document.getElementById("seccion-3").style.display = "block";
  document.getElementById("seccion-4").style.display = "block";
  document.getElementById("seccion-5").style.display = "block";
}
