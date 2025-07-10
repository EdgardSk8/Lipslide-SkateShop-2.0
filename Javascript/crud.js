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

//--------------------------------------------------------------------------------------------

$(document).on("click", ".edit-btn", function () {
  const fila = $(this).closest("tr");
  const id = fila.data("id");

  // Obtener los datos actuales
  const marca = fila.find(".marca").text();
  const descripcion = fila.find(".descripcion").text();
  const tipoActual = fila.find(".tipo").text();
  const medida = fila.find(".medida").text();
  const precio = parseFloat(fila.find(".precio").text().replace('$', ''));
  const unidades = parseInt(fila.find(".unidades").text());
  const disponible = fila.find(".disponible").text().trim() === "Sí";

  // Opciones para el campo "Tipo"
  const tipos = ["Tablas", "Lijas", "Trucks", "Ruedas", "Balineras", "Accesorios", "Extras"];

  // Reemplazar celdas con inputs
  fila.find(".marca").html(`<input type="text" class="input-tabla" value="${marca}">`);
  fila.find(".descripcion").html(`<input type="text" class="input-tabla" value="${descripcion}">`);
  
  // Selector con la opción actual seleccionada
  let selectorTipo = `<select class="select-tipo">`;
  tipos.forEach(t => {
    const selected = (t === tipoActual) ? "selected" : "";
    selectorTipo += `<option value="${t}" ${selected}>${t}</option>`;
  });

  selectorTipo += `</select>`;
  fila.find(".tipo").html(selectorTipo);

  fila.find(".medida").html(`<input type="text" class="input-tabla-medida" value="${medida}">`);

  fila.find(".precio").html(`
    <div class="input-num-wrapper">
      <button class="btn-num menos">−</button>
      <input type="number" value="${precio}" min="0">
      <button class="btn-num mas">+</button>
    </div>
  `);

  fila.find(".unidades").html(`
    <div class="input-num-wrapper">
      <button class="btn-num menos">−</button>
      <input type="number" value="${unidades}" min="0">
      <button class="btn-num mas">+</button>
    </div>
  `);

  fila.find(".disponible").html(`<input type="checkbox" ${disponible ? "checked" : ""}>`);

  // Cambiar botones
  fila.find(".acciones").html(`
    <button class="save-btn">Aceptar</button>
    <button class="cancel-btn">Cancelar</button>
  `);

  $(document).on("click", ".btn-num.mas", function () {
  const input = $(this).siblings("input[type='number']");
  let val = parseInt(input.val()) || 0;
  input.val(val + 1);

});

$(document).on("click", ".btn-num.menos", function () {
  const input = $(this).siblings("input[type='number']");
  let val = parseInt(input.val()) || 0;
  if (val > 0) {
    input.val(val - 1);
  }
});

  
});

$(document).on("click", ".save-btn", function () {
  const fila = $(this).closest("tr");
  const id = fila.data("id");

  // Leer los valores desde los inputs
  const datosActualizados = {
    Marca: fila.find(".marca input").val(),
    Descripcion: fila.find(".descripcion input").val(),
    Tipo: fila.find(".tipo select").val(),
    Medida: fila.find(".medida input").val(),
    Precio: parseFloat(fila.find(".precio input").val()),
    Unidades: parseInt(fila.find(".unidades input").val()),
    Disponible: fila.find(".disponible input").is(":checked").toString()
  };

  // Enviar al servidor
  $.post(`/actualizar/${id}`, datosActualizados, function (respuesta) {
    //alert(respuesta.mensaje);
    cargarProductos(); // Recargar la tabla con los datos actualizados
  }).fail(function () {
    alert("Error al actualizar el producto.");
  });
});



$(document).on("click", ".cancel-btn", function () {
  cargarProductos(); // Simplemente recarga la tabla original
});





