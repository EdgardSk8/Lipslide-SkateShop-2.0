function cargarProductos() {
  $.getJSON('/productos', function(productos) {
    const tbody = $('#tabla-productos tbody');
    tbody.empty();

    productos.forEach(p => {
  const disponibleTexto = p.Disponible ? 'Sí' : 'No';
  const disponibleColor = p.Disponible ? 'green' : 'red';

  const imagenHTML = p.Imagenes && p.Imagenes.length > 0
    ? `<img src="${p.Imagenes[0]}" alt="Imagen" class="thumbnail">`
    : 'Sin imagen';

  const botonAccion = p.Disponible
    ? `<button class="delete-btn">Eliminar</button>`
    : `<button class="add-btn">Agregar</button>`;

  tbody.append(`
    <tr data-id="${p.ID}">
      <td class="id">${p.ID}</td>
      <td class="imagen">${imagenHTML}</td>
      <td class="marca">${p.Marca}</td>
      <td class="descripcion">${p.Descripcion}</td>
      <td class="tipo">${p.Tipo}</td>
      <td class="medida">${p.Medida}</td>
      <td class="precio">$${p.Precio}</td>
      <td class="unidades">${p.Unidades}</td>
      <td class="disponible" style="color:${disponibleColor}">${disponibleTexto}</td>
      <td class="acciones">
        <button class="edit-btn">Editar</button>
        ${botonAccion}
      </td>
    </tr>
  `);
});

  });
}

$(document).ready(function() {
  cargarProductos();
});

$(document).on("click", ".delete-btn", function () {
  const fila = $(this).closest("tr");
  const id = fila.data("id");

  $.post(`/producto/${id}/disponible`, function (respuesta) {
    alert(respuesta.mensaje);
    cargarProductos(); // recarga la tabla
  }).fail(function () {
    alert("Error al marcar como no disponible.");
  });
});

$(document).on("click", ".add-btn", function () {
  const fila = $(this).closest("tr");
  const id = fila.data("id");

  $.post(`/producto/${id}/activar`, function (respuesta) {
    alert(respuesta.mensaje);
    cargarProductos();
  }).fail(function () {
    alert("Error al marcar como disponible.");
  });
});


