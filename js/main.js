let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let cuadernoEditando = null;

// Cargo el inventario inicial desde cuadernos.json
function obtenerCuadernos() {
    return fetch('json/cuadernos.json')
        .then(response => response.json())
        .catch(error => {
            mostrarMensaje("Error al cargar los datos del inventario.", "error");
            console.error('Error al cargar los datos:', error);
        });
}

function inicializarInventario() {
    const datosLocales = JSON.parse(localStorage.getItem("inventario")) || [];
    
    if (datosLocales.length === 0) {
        obtenerCuadernos().then(data => {
            inventario = data || [];
            localStorage.setItem("inventario", JSON.stringify(inventario)); // Guardo los datos en localStorage
            mostrarInventario();
        });
    } else {
        inventario = datosLocales; // Cargo el inventario desde localStorage
        mostrarInventario();
    }
}

// Muestro el inventario en el DOM.
function mostrarInventario() {
    const inventarioDiv = document.getElementById("inventario");
    inventarioDiv.innerHTML = ""; // Limpio el inventario previo.

    if (inventario.length === 0) {
        inventarioDiv.innerHTML = mostrarMensaje("El inventario está vacío.", "error");
    } else {
        inventario.forEach((cuaderno, index) => {
            const cuadernoDiv = document.createElement("div");
            cuadernoDiv.innerHTML = `
                <strong>${index + 1}. Código:</strong> ${cuaderno.codigo}, 
                <strong>Nombre:</strong> ${cuaderno.nombre}, 
                <strong>Tipo:</strong> ${cuaderno.tipo}, 
                <strong>Categoría:</strong> ${cuaderno.categoria}, 
                <strong>Precio:</strong> $${cuaderno.precio}, 
                <strong>Cantidad:</strong> ${cuaderno.cantidad}
            `;
            inventarioDiv.appendChild(cuadernoDiv);
        });
    }
}

// Función para mostrar mensajes con SweetAlert
function mostrarMensaje(mensaje, tipo) {
    if (tipo === "success") {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: mensaje
        });
    } else if (tipo === "error") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje
        });
    }
}

// Agrego cuaderno al inventario
function agregarCuaderno() {
    const codigo = document.getElementById("codigo").value;
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!nombre || !tipo || !categoria || isNaN(precio) || isNaN(cantidad)) {
        mostrarMensaje("Por favor, completa todos los campos correctamente.", "error");
        return;
    }

    const cuaderno = { codigo, nombre, tipo, categoria, precio, cantidad };
    inventario.push(cuaderno);
    localStorage.setItem("inventario", JSON.stringify(inventario)); // Guardo los datos en localStorage
    mostrarInventario();
    limpiarFormulario();
    mostrarMensaje(`Cuaderno "${nombre}" agregado con éxito.`, "success");
}

// Limpio el formulario
function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
    cuadernoEditando = null;
}

// Filtro cuadernos por tipo
document.getElementById("filtrarTipoBtn").addEventListener("click", () => {
    const tipo = document.getElementById("filtrarTipo").value.trim();
    if (tipo) {
        const resultados = inventario.filter(cuaderno => cuaderno.tipo.toLowerCase() === tipo.toLowerCase());
        mostrarCuadernosFiltrados(resultados);
    } else {
        mostrarMensaje("Introduce un tipo para filtrar.", "error");
    }
});

// Filtro cuadernos por categoría
document.getElementById("filtrarCategoriaBtn").addEventListener("click", () => {
    const categoria = document.getElementById("filtrarCategoria").value.trim();
    if (categoria) {
        const resultados = inventario.filter(cuaderno => cuaderno.categoria.toLowerCase() === categoria.toLowerCase());
        mostrarCuadernosFiltrados(resultados);
    } else {
        mostrarMensaje("Introduce una categoría para filtrar.", "error");
    }
});

// Muestro los cuadernos filtrados
function mostrarCuadernosFiltrados(resultados) {
    const inventarioDiv = document.getElementById("inventario");
    inventarioDiv.innerHTML = ""; // Limpio el inventario previo

    if (resultados.length === 0) {
        inventarioDiv.innerHTML = mostrarMensaje("No se encontraron cuadernos con ese criterio.", "error");
    } else {
        resultados.forEach((cuaderno, index) => {
            const cuadernoDiv = document.createElement("div");
            cuadernoDiv.innerHTML = `
                <strong>${index + 1}. Código:</strong> ${cuaderno.codigo}, 
                <strong>Nombre:</strong> ${cuaderno.nombre}, 
                <strong>Tipo:</strong> ${cuaderno.tipo}, 
                <strong>Categoría:</strong> ${cuaderno.categoria}, 
                <strong>Precio:</strong> $${cuaderno.precio}, 
                <strong>Cantidad:</strong> ${cuaderno.cantidad}
            `;
            inventarioDiv.appendChild(cuadernoDiv);
        });
    }
}

// Inicializo el inventario al cargar la página
document.getElementById("agregarBtn").addEventListener("click", agregarCuaderno);
inicializarInventario();
