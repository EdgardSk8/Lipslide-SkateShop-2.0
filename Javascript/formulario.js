/* ───────────────────────────────────────────
  Envío del formulario con datos del producto
  ────────────────────────────────────────────*/

document.getElementById("form-producto").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/agregar", { method: "POST", body: formData });

    if (!response.ok) throw new Error("Error al guardar el producto");

    const data = await response.json();
    alert("✅ " + data.mensaje + " (ID: " + data.nuevoID + ")");

    location.reload(); //Recargar la página después del alert

  } catch (error) { console.error(error);
    alert("❌ Error al guardar el producto.");
  }
  
});

/* ───────────────────────────────────────────────
  Obtener automáticamente el próximo ID al cargar
  ──────────────────────────────────────────────── */

window.addEventListener("DOMContentLoaded", async () => {

  try {

    const res = await fetch("/proximo-id");
    const data = await res.json();
    document.getElementById("inputID").value = data.nuevoID;

  } catch (error) {

    console.error("Error al obtener el próximo ID:", error);
    document.getElementById("inputID").value = "Error";

  }

});

/* ──────────────────────────────────────
  Vista previa de imágenes seleccionadas
  ─────────────────────────────────────── */

const inputImagen = document.getElementById('imagen');
const preview = document.getElementById('imgproducto');

inputImagen.addEventListener('change', () => {

  preview.innerHTML = ''; // Limpiar contenido previo
  const files = inputImagen.files;

  if (files.length === 0) return;

  Array.from(files).forEach(file => {

    const reader = new FileReader();

    reader.onload = e => {

      const img = document.createElement('img');
      img.src = e.target.result;
      preview.appendChild(img);

    };

    reader.readAsDataURL(file);

  });

});
