/* ────────────────────────────────────────────────── */
/* Iniciar servicio con: node ./Javascript/server.js
/* ────────────────────────────────────────────────── */

/* ──────────────────────────────
   SECCIÓN: CONFIGURACIÓN GENERAL
───────────────────────────────── */
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

const RUTA_BD = path.join(__dirname, "../Base de datos/BD.json");
const RUTA_RECURSOS = path.join(__dirname, "../Recursos/Seccion 2");

app.use(express.static(path.join(__dirname, "../Pages")));
app.use(express.static(path.join(__dirname, ".."))); //Express para toda la carpeta
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ────────────────────────────── */
/* SECCIÓN: FUNCIONES AUXILIARES
/* ────────────────────────────── */
function obtenerRutaTipo(tipo) {
  if (tipo === "Pivot" || tipo === "Llave") return "Extras";
  if (tipo === "Cadena") return "Accesorios";
  return tipo;
}

/* ───────────────────────────────── */
/* SECCIÓN: CONFIGURACIÓN DE MULTER
/* ───────────────────────────────── */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.body.Tipo;
    const carpeta = obtenerRutaTipo(tipo);
    const rutaDestino = path.join(RUTA_RECURSOS, carpeta);
    fs.mkdirSync(rutaDestino, { recursive: true });
    cb(null, rutaDestino);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre temporal, se renombrará despues
  },
});

const upload = multer({ storage });

/* ────────────────────────────────── */
/* SECCIÓN: API - OBTENER PRÓXIMO ID
/* ────────────────────────────────── */

app.get("/proximo-id", (req, res) => {
  let productos = [];
  if (fs.existsSync(RUTA_BD)) {
    const contenido = fs.readFileSync(RUTA_BD, "utf-8");
    productos = contenido ? JSON.parse(contenido) : [];
  }

  const nuevoID = productos.length > 0
    ? Math.max(...productos.map((p) => p.ID)) + 1
    : 1;

  res.json({ nuevoID });
});

/* ──────────────────────────────── */
/* SECCIÓN: API - AGREGAR PRODUCTO
/* ──────────────────────────────── */

app.post("/agregar", upload.array("imagen"), (req, res) => {
  const tipo = req.body.Tipo;
  const nombreBase = req.body.NombreImagen || "producto";

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("Error: No se subieron imágenes.");
  }

  let productos = [];
  if (fs.existsSync(RUTA_BD)) {
    const contenido = fs.readFileSync(RUTA_BD, "utf-8");
    productos = contenido ? JSON.parse(contenido) : [];
  }

  const nuevoID = productos.length > 0
    ? Math.max(...productos.map((p) => p.ID)) + 1
    : 1;

  const carpeta = obtenerRutaTipo(tipo);
  const rutaCarpeta = path.join(RUTA_RECURSOS, carpeta);

  const imagenes = req.files.map((file, index) => {
    const ext = path.extname(file.originalname);
    const nombreFinal = `${nombreBase}-${index + 1}${ext}`;
    const rutaFinal = path.join(rutaCarpeta, nombreFinal);
    fs.renameSync(file.path, rutaFinal);
    return `/Recursos/Seccion 2/${carpeta}/${nombreFinal}`.replace(/\\/g, "/");
  });

  const nuevoProducto = {
    ID: nuevoID,
    Marca: req.body.Marca,
    Descripcion: req.body.Descripcion,
    Tipo: tipo,
    Medida: req.body.Medida || "",
    Precio: parseFloat(req.body.Precio),
    Unidades: parseInt(req.body.Unidades),
    Disponible: req.body.Disponible === "on",
    Imagenes: imagenes,
  };

  productos.push(nuevoProducto);
  fs.writeFileSync(RUTA_BD, JSON.stringify(productos, null, 2));

  res.json({
    mensaje: "Producto guardado con éxito",
    nuevoID,
  });
});

/* ──────────────────────────────── */
/* SECCIÓN: API - MOSTRAR PRODUCTOS
/* ──────────────────────────────── */

app.get("/productos", (req, res) => {
  if (fs.existsSync(RUTA_BD)) {
    const contenido = fs.readFileSync(RUTA_BD, "utf-8");
    const productos = contenido ? JSON.parse(contenido) : [];
    res.json(productos);
  } else {
    res.json([]);
  }
});






/* ──────────────────────────────
   SECCIÓN: API - ACTUALIZAR PRODUCTO (falta en tu código)
───────────────────────────────── */
// Aquí deberías tener una ruta como:
// app.post("/actualizar/:id", (req, res) => { ... })

/* ──────────────────────────────
   SECCIÓN: API - ELIMINAR PRODUCTO 
───────────────────────────────── */

app.post("/producto/:id/disponible", (req, res) => {
  const id = parseInt(req.params.id);
  if (fs.existsSync(RUTA_BD)) {
    let productos = JSON.parse(fs.readFileSync(RUTA_BD, "utf-8"));
    const index = productos.findIndex(p => p.ID === id);

    if (index !== -1) {
      productos[index].Disponible = false;

      fs.writeFileSync(RUTA_BD, JSON.stringify(productos, null, 2));
      return res.json({ mensaje: "Este Producto marcado como no disponible." });
    }
  }
  res.status(404).json({ error: "Producto no encontrado." });
});

app.post("/producto/:id/activar", (req, res) => {
  const id = parseInt(req.params.id);
  if (fs.existsSync(RUTA_BD)) {
    let productos = JSON.parse(fs.readFileSync(RUTA_BD, "utf-8"));
    const index = productos.findIndex(p => p.ID === id);

    if (index !== -1) {
      productos[index].Disponible = true;

      fs.writeFileSync(RUTA_BD, JSON.stringify(productos, null, 2));
      return res.json({ mensaje: "Producto marcado como disponible nuevamente." });
    }
  }
  res.status(404).json({ error: "Producto no encontrado." });
});


/* ──────────────────────────────
   SECCIÓN: INICIAR SERVIDOR
───────────────────────────────── */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/formulario.html`);
});
