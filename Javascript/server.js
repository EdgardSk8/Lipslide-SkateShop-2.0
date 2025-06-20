//Iniciar servicio con el comando: node ./Javascript/server.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

const RUTA_BD = path.join(__dirname, "../Base de datos/BD.json");
const RUTA_RECURSOS = path.join(__dirname, "../Recursos/Seccion 2");

// Servir archivos estáticos (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, "../Pages")));
app.use(express.urlencoded({ extended: true }));

// Obtener carpeta destino según tipo
function obtenerRutaTipo(tipo) {
  if (tipo === "Pivot" || tipo === "Llave") return "Extras";
  if (tipo === "Cadena") return "Accesorios";
  return tipo;
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.body.Tipo;
    const carpeta = obtenerRutaTipo(tipo);
    const rutaDestino = path.join(RUTA_RECURSOS, carpeta);
    fs.mkdirSync(rutaDestino, { recursive: true });
    cb(null, rutaDestino);
  },
  filename: (req, file, cb) => {
    // Se asigna un nombre temporal, se renombra después manualmente
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para obtener el próximo ID automáticamente
app.get("/proximo-id", (req, res) => {
  let productos = [];
  if (fs.existsSync(RUTA_BD)) {
    const contenido = fs.readFileSync(RUTA_BD, "utf-8");
    productos = contenido ? JSON.parse(contenido) : [];
  }
  const nuevoID =
    productos.length > 0
      ? Math.max(...productos.map((p) => p.ID)) + 1
      : 1;

  res.json({ nuevoID });
});

// Ruta para agregar un nuevo producto con múltiples imágenes
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

  const nuevoID =
    productos.length > 0
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

  res.send(`
    <h2>Producto guardado con éxito</h2>
    <p><strong>ID asignado:</strong> ${nuevoID}</p>
    <p><a href="/formulario.html">Volver al formulario</a></p>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
