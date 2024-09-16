//botones
const autorizacion = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZGFuaWVsLmFyZW5hczFAdXRwLmVkdS5jbyIsImlhdCI6MTcyNjQ1NjkwMiwiZXhwIjoxNzQzNzM2OTAyfQ.Ox67UtgDCJSP5HJxb8L5Hafs_9nS13exH6L2GJgE334'
const url_api = 'https://fake-api-vq1l.onrender.com/posts'
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
                    <button onclick='borrar(${product.id})'>Eliminar</button>
                    <button id='editar'>Editar</button>
                </div>
            </div>
        </li>`;
    });
        
});
        


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
