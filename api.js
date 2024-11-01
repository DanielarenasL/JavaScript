// Api
const url_api = 'https://api-qxlr.onrender.com';

// botones
const agregar = document.getElementById('crear');
const crearcategoria = document.getElementById('crearCategoria');

// Listar productos
fetch(url_api + '/products')
.then(response => response.json())
.then(data => {
    
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    data.forEach(product => {
        console.log(typeof(product.images));

        const nombreCategoria = categorias[product.category_id];
        
        if (!nombreCategoria) {
            console.log(`Categoría no encontrada para el ID: ${product.category_id}`);
        }

        lista.innerHTML += 
        `<li>
            <img src='${product.images.replace(/["\[\]]/g, '')}' class="card-img-top" width="160px">
            <div class="card">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.value}</p>
                <p>Categoría: ${nombreCategoria || 'Categoría no encontrada'}</p>
                <div>
                    <button onclick='borrar(${product.id})' id='eliminar'>Eliminar</button>
                    <button onclick='editarProducto(${product.id}, "${product.title}", "${product.description}", ${JSON.stringify(product.images)}, ${product.value}, ${product.category_id})' id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
});

// Listar categorias
fetch(url_api + '/categories')
.then(response => response.json())
.then(data => {
    const lista_categoria = document.getElementById('listaCategorias');
    lista_categoria.innerHTML = ''; // Limpiar la lista antes de llenarla
    data.forEach(category => {
        lista_categoria.innerHTML += 
        `<li>
            <div class="card">
                <img src='${category.image}' class="card-img-top" width="160px">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <div>
                    <button onclick='eliminarCategoria(${category.category_id})' id='eliminar'>Eliminar</button>
                    <button onclick='actualizarCategoria(${category.category_id}, "${category.name}", "${category.description}", "${category.image}")' id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
});

// Agregar
agregar.addEventListener('submit', function(e) {
    e.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let value = parseInt(document.getElementById('value').value);
    let category = parseInt(document.getElementById('category_id').value);
    let images = JSON.parse(document.getElementById('images').value);

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
            images: Array.isArray(images) ? images : [images]
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if (response) {
            alert('Producto creado');
        }
        location.reload();
    });
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
function editar(id, titulo, descripcion, image, valor, categoria) {
    
    let title = prompt("Digite el nuevo título", titulo);
    let description = prompt("Digite la nueva descripción", descripcion);
    let value = parseInt(prompt("Digite el nuevo valor", valor));
    let category = parseInt(prompt("Digite la nueva categoría", categoria));
    let images = JSON.parse(image); // Parsear la cadena JSON
    images = [prompt("Digite la nueva imagen", images[0])]; 

    fetch(url_api + '/products/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: description,
            value: value,
            category_id: category,
            images: images
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

// Cargar categorías
let categorias = {};
function cargarCategorias() {
    fetch(url_api + '/categories')
    .then(response => response.json())
    .then(data => {
        const categorySelect = document.getElementById('category_id');
        data.forEach(categoria => {
            categorias[categoria.category_id] = categoria.name;

            let option = document.createElement('option');
            option.value = categoria.category_id;
            option.text = categoria.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar las categorías:', error);
    });
}
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