// Api
const url_api = 'https://api-qxlr.onrender.com';

// botones
const agregar = document.getElementById('crear');
const crearcategoria = document.getElementById('crearCategoria');

// Función para listar productos
function listarProductos() {
    fetch(url_api + '/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        const lista = document.getElementById('lista');
        lista.innerHTML = ''; // Limpiar la lista antes de llenarla
        if (data.length === 0) {
            lista.innerHTML = '<p>No hay productos disponibles.</p>';
            return; // Salir si no hay productos
        }
        data.forEach(product => {
            // Verificar si el campo category_id es nulo o vacío
            const categoria = product.category_id ? product.category_id : "Sin categoría";

            // Asegurarse de que product.images sea un array y tomar el primer elemento
            const imageSrc = Array.isArray(product.images) ? product.images[0] : product.images;

            lista.innerHTML += `
                <li>
                    <img src='${imageSrc.replace(/["\[\]]/g, '')}' class="card-img-top" width="160px">
                    <div class="card">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <p>Precio: $${product.value}</p>
                        <p>Categoría: ${categoria}</p>
                        <div>
                            <button onclick='borrar(${product._id})' id='eliminar'>Eliminar</button>
                            <button onclick='editarProducto(${product._id}, "${product.title}", "${product.description}", "${imageSrc.replace(/["\[\]]/g, '')}", ${product.value}, ${categoria})' id='editar'>Editar</button>
                        </div>
                    </div>
                </li>`;
        });
    })
    .catch(error => console.error('Error al listar productos:', error));
}

// Llamar a listarProductos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    listarProductos();
    cargarCategorias(); // También carga categorías
});

// Listar categorías
fetch(url_api + '/categories')
.then(response => response.json())
.then(data => {
    const lista_categoria = document.getElementById('listaCategorias');
    lista_categoria.innerHTML = ''; // Limpiar la lista antes de llenarla
    data.forEach(category => {
        lista_categoria.innerHTML += 
        `<li>
            <div class="card">
                <img src='${category.image}' class="card-img-top">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <div>
                    <button onclick='eliminarCategoria(${category._id})' id='eliminar'>Eliminar</button>
                    <button onclick='actualizarCategoria(${category._id}, "${category.name}", "${category.description}", "${category.image}")' id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
});

// Agregar producto
agregar.addEventListener('submit', function(e) {
    e.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let value = parseInt(document.getElementById('value').value);
    let category = parseInt(document.getElementById('category_id').value);
    let images = document.getElementById('images').value;

    fetch(url_api + '/products', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: description,
            value: value,
            category_id: category,
            images: [images]
        })
    })
    .then(response => response.json())
    .then(response => {
        if (response) {
            alert('Producto creado exitosamente');
        }
        location.reload();
    })
    .catch(error => console.error('Error al crear el producto:', error));
});

// Crear categoría
crearcategoria.addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('categoria_nombre').value;
    let description = document.getElementById('categoria_descripcion').value;
    let image = document.getElementById('categoria_imagen').value;

    fetch(url_api + '/categories', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            image: image,
            description: description
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response) {
            alert('Categoría creada');
        }
        location.reload();
    });
});

// Editar
function editarProducto(id, titulo, descripcion, image, valor, categoria) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'lightgrey';
    modal.style.padding = '20px';
    modal.style.zIndex = '1000';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.style.borderRadius = '10px';

    // Crear los campos de entrada
    const titleInput = document.createElement('input');
    titleInput.placeholder = "Nuevo Título";
    titleInput.value = titulo;

    const descriptionInput = document.createElement('input');
    descriptionInput.placeholder = "Nueva Descripción";
    descriptionInput.value = descripcion;

    const valueInput = document.createElement('input');
    valueInput.type = "number";
    valueInput.placeholder = "Nuevo Valor";
    valueInput.value = valor;

    const categorySelect = document.createElement('select');

    const imgInput = document.createElement('input');
    imgInput.placeholder = "nueva imagen";
    imgInput.value = image; // Usar el valor de imagen como cadena
    
    // Obtener categorías
    fetch(url_api + '/categories')
    .then(response => response.json())
    .then(categories => {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.text = cat.name;
            if (cat.category_id === categoria) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
    });

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Actualizar Producto';
    submitButton.onclick = function() {
        const updatedTitle = titleInput.value;
        const updatedDescription = descriptionInput.value;
        const updatedValue = parseInt(valueInput.value);
        const updatedCategory = parseInt(categorySelect.value);
        const updatedImages = imgInput.value; // Usar como cadena directamente

        fetch(url_api + '/products/' + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: updatedTitle,
                description: updatedDescription,
                value: updatedValue,
                category_id: updatedCategory,
                images: updatedImages // Enviar como string
            })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response) {
                alert('Producto actualizado');
            }
            location.reload();
        })
        .catch(error => console.error('Error al actualizar el producto:', error));

        document.body.removeChild(modal); // Cerrar modal
    };

    // Agregar campos al modal
    modal.appendChild(titleInput);
    modal.appendChild(descriptionInput);
    modal.appendChild(valueInput);
    modal.appendChild(categorySelect);
    modal.appendChild(imgInput);
    modal.appendChild(submitButton);
    
    // Agregar el modal al body
    document.body.appendChild(modal);
}


// Borrar
function borrar(id) {
    fetch(url_api + '/products/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response) {
            alert('El producto: ' + id + ' fue eliminado');
        }
        location.reload();
    });
}

// Actualizar categoría por ID
function actualizarCategoria(id, nombrecategoria, descripcioncategoria, imagencategoria) {
    let name = prompt("Digite el nuevo nombre", nombrecategoria);
    let description = prompt("Digite la nueva descripción", descripcioncategoria);
    let image = prompt("Digite la nueva imagen", imagencategoria);

    fetch(url_api + '/categories/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            image: image,
            description: description
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response) {
            alert('Categoría actualizada');
        }
        location.reload();
    })
    .catch(error => console.error('Error al actualizar la categoría:', error));
}

// Eliminar categoría por ID
function eliminarCategoria(id) {
    fetch(url_api + '/categories/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response) {
            alert('Categoría eliminada');
        }
        location.reload();
    })
    .catch(error => console.error('Error al eliminar la categoría:', error));
}

// Cargar Categorias
function cargarCategorias() {
    fetch(url_api + '/categories')
        .then(response => response.json())
        .then(data => {
            console.log('Categorías recibidas:', data);
            
            const categorySelect = document.getElementById('category_id');
            categorySelect.innerHTML = ''; // Limpia las opciones existentes

            const uniqueCategories = new Set();

            data.forEach(categoria => {
                console.log('Agregando categoría:', categoria); 
                if (!uniqueCategories.has(categoria._id)) { // Asegúrate de usar el _id correcto
                    uniqueCategories.add(categoria._id);
                    let option = document.createElement('option');
                    option.value = categoria._id; // Usa el ID de categoría
                    option.text = categoria.name; // Usa el nombre de la categoría
                    categorySelect.appendChild(option); // Agregar la opción al select
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}

// Llama a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarCategorias);

function editarProducto(id, titulo, descripcion, image, valor, categoria) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'lightgrey'; // Color del modal
    modal.style.padding = '20px';
    modal.style.zIndex = '1000';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.style.borderRadius = '10px'; // Bordes redondeados

    // Crear los campos de entrada
    const titleInput = document.createElement('input');
    titleInput.placeholder = "Nuevo Título";
    titleInput.value = titulo;

    const descriptionInput = document.createElement('input');
    descriptionInput.placeholder = "Nueva Descripción";
    descriptionInput.value = descripcion;

    const valueInput = document.createElement('input');
    valueInput.type = "number";
    valueInput.placeholder = "Nuevo Valor";
    valueInput.value = valor;

    const categorySelect = document.createElement('select');

    const imgInput = document.createElement('input');
    imgInput.placeholder = "nueva imagen";
    imgInput.value = JSON.parse(image)[0];
    
    // Obtener categorías
    fetch(url_api + '/categories')
    .then(response => response.json())
    .then(categories => {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.text = cat.name;
            if (cat.category_id === categoria) {
                option.selected = true; // Seleccionar la categoría actual
            }
            categorySelect.appendChild(option);
        });
    });

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Actualizar Producto';
    submitButton.onclick = function() {
        const updatedTitle = titleInput.value;
        const updatedDescription = descriptionInput.value;
        const updatedValue = parseInt(valueInput.value);
        const updatedCategory = parseInt(categorySelect.value);
        const updatedImages = imgInput.value;

        fetch(url_api + '/products/' + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: updatedTitle,
                description: updatedDescription,
                value: updatedValue,
                category_id: updatedCategory,
                images: [updatedImages]
            })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response) {
                alert('Producto actualizado');
            }
            location.reload();
        });

        document.body.removeChild(modal); // Cerrar modal
    };

    // Agregar campos al modal
    modal.appendChild(titleInput);
    modal.appendChild(descriptionInput);
    modal.appendChild(valueInput);
    modal.appendChild(categorySelect);
    modal.appendChild(imgInput);
    modal.appendChild(submitButton);
    
    // Agregar el modal al body
    document.body.appendChild(modal);
}
// Inicializar carga de categorías
document.addEventListener('DOMContentLoaded', function() {
    cargarCategorias();
});