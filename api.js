//Api
const autorizacion = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZGFuaWVsLmFyZW5hczFAdXRwLmVkdS5jbyIsImlhdCI6MTcyNjQ1NjkwMiwiZXhwIjoxNzQzNzM2OTAyfQ.Ox67UtgDCJSP5HJxb8L5Hafs_9nS13exH6L2GJgE334'
const url_api = 'https://fake-api-vq1l.onrender.com/posts'

//botones
const agregar = document.getElementById('crear');

//listar
fetch(url_api,{
    headers: {
        "Authorization": autorizacion
    }
})
.then(response => response.json())
.then(data => {

    const lista = document.getElementById('lista');
    data.forEach( product => {

        lista.innerHTML += 
        `<li>
            <img src='${product.images.replace(/["\[\]]/g, '')}' class="card-img-top" width="160px>
            <div class="card">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.value}</p>
                <p>categoria: ${product.category_id}</p>
                <div>
                    <button onclick='borrar(${product.id})' id='eliminar'>Eliminar</button>
                    <button onclick='editar(${product.id})' id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
        
});
        
//agregar
agregar.addEventListener('submit', function(e) {
    e.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let value = parseInt(document.getElementById('value').value);
    let category = parseInt(document.getElementById('category_id').value);
    let images = [document.getElementById('images').value];
    let hola = ['hola', 'adios']
    console.log(typeof(title), typeof(description), typeof(value), typeof(category), typeof(images), typeof(hola));

    fetch(url_api, {
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
        if(response) {
            alert('Producto creado');
        }
        location.reload();
    })
})

//editar
function editar(id){

    let title = prompt("Digite el nuevo titulo")
    let description = prompt("Digite la nueva descripcion")
    let value = parseInt(prompt("Digite el nuevo valor"))
    let category = parseInt(prompt("Digite la nueva categoria"))
    let images = [prompt("Digite la nueva imagen")]

    fetch(url_api + '/' + id, {
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
        if(response){
            alert('Producto actualizado');
        }
        location.reload();
    })
}


//borrar
function borrar(id){
    fetch(url_api + '/' + id, {
        method: 'DELETE',
        headers: {
            "Authorization": autorizacion
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        if(response){
            alert('el producto: ' + id + ' fue eliminado');
        }
        location.reload();
    })
}

// crear categoría
function crearCategoria(name, image, description) {
    fetch(url_category_api, {
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
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al crear la categoría');
        }
    })
    .then(response => {
        alert('Categoría creada');
    })
    .catch(error => console.error('Error al crear categoría:', error));
}

// obtener categoría por ID
function obtenerCategoriaPorId(categoryId) {
    fetch(`${url_category_api}/${categoryId}`, {
        headers: {
            "Authorization": autorizacion
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error al obtener la categoría:', error));
}

// actualizar categoría por ID
function actualizarCategoria(categoryId, name, image, description) {
    fetch(`${url_category_api}/${categoryId}`, {
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
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al actualizar la categoría');
        }

    })
    .then(response => {
        alert('Categoría actualizada');
    })
    .catch(error => console.error('Error al actualizar la categoría:', error));
}

// eliminar categoría por ID
function eliminarCategoria(categoryId) {
    fetch(`${url_category_api}/${categoryId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": autorizacion
        }
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al eliminar la categoría');
        }
    })
    .then(response => {
        alert('Categoría eliminada');
    })
    .catch(error => console.error('Error al eliminar la categoría:', error));
}