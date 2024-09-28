// Api
const autorizacion = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZGFuaWVsLmFyZW5hczFAdXRwLmVkdS5jbyIsImlhdCI6MTcyNjQ1NjkwMiwiZXhwIjoxNzQzNzM2OTAyfQ.Ox67UtgDCJSP5HJxb8L5Hafs_9nS13exH6L2GJgE334';
const url_api = 'https://fake-api-vq1l.onrender.com';

// botones
const agregar = document.getElementById('crear');
const crearcategoria = document.getElementById('crearCategoria');

// Listar productos
fetch(url_api + '/posts', {
    headers: {
        "Authorization": autorizacion
    }
})
.then(response => response.json())
.then(data => {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    data.forEach(product => {
        console.log(`Product ID: ${product.id}, Category ID: ${product.category_id}`);

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
                    <button onclick='editar(${product.id}, "${product.title}", "${product.description}", ${JSON.stringify(product.images)}, ${product.value}, ${product.category_id})' id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
});

// Listar categorias
fetch(url_api + '/category', {
    headers: {
        "Authorization": autorizacion
    }
})
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
    let images = [document.getElementById('images').value];

    fetch(url_api + '/posts', {
        method: 'POST',
        headers: {
            "Authorization": autorizacion,
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

    fetch(url_api + '/category', {
        method: 'POST',
        headers: {
            "Authorization": autorizacion,
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

    fetch(url_api + '/posts/' + id, {
        method: 'PATCH',
        headers: {
            "Authorization": autorizacion,
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
    fetch(url_api + '/posts/' + id, {
        method: 'DELETE',
        headers: {
            "Authorization": autorizacion
        }
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

    fetch(url_api + '/category/' + id, {
        method: 'PATCH',
        headers: {
            "Authorization": autorizacion,
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
    fetch(url_api + '/category/' + id, {
        method: 'DELETE',
        headers: {
            "Authorization": autorizacion
        }
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
    fetch(url_api + '/category', {
        headers: {
            "Authorization": autorizacion
        }
    })
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

// Inicializar carga de categorías
document.addEventListener('DOMContentLoaded', function() {
    cargarCategorias();
});