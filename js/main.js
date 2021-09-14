let endpoint = 'https://apipetshop.herokuapp.com/api/articulos'
const juguetesId = document.getElementById('juguetes')
const farmaciaId = document.getElementById('farmacia')
const form = document.getElementById('form')
let articulos;

fetch(endpoint)
    .then(res=>res.json())
    .then(json=>{
        articulos = localStorage.getItem("articulos") ? obtenerLocalStorage() : json.response;
        agregarElementos(articulos)
        seleccionar(articulos)    
    })
    .catch(err=> console.error(err.message));


//CREAR TARJETAS
function agregarElementos(array){
        const contenedorCartas = document.getElementById("container-card")
        
        if(juguetesId){
            let juguetes = array.filter(juguete => juguete.tipo === 'Juguete');
            juguetes.forEach(juguete => {
            let div = document.createElement('div');
            div.classList.add('card')
            div.classList.add('col-lg-3')
            div.classList.add('col-12')
            div.classList.add('col-md-8')
            div.innerHTML = `<h5 class="card-title">${juguete.nombre}</h5>
            <img src="${juguete.imagen}" class="card-img-top" alt="">
            <div class="card-body">
            <p class="card-text">${juguete.descripcion}</p>
            ${juguete.stock<5 ? `<h5 class="stock stock-rojo">Stock disponible ${juguete.stock}</h5>`: `<h5 class="stock">Stock disponible ${juguete.stock}</h5>`}
            <div class="precio-agregar">
            <p class="card-precio">Precio: $${juguete.precio}</p>
            <button class="btn agregar" id="${juguete._id}">Agregar</button>
            </div></div>`
            contenedorCartas.appendChild(div)
            });
        }else if(farmaciaId){
            let medicamentos = array.filter(medicamento => medicamento.tipo === 'Medicamento');
            medicamentos.forEach(medicamento => {
            let div = document.createElement('div');
            div.classList.add('card')
            div.classList.add('col-lg-3')
            div.classList.add('col-12')
            div.classList.add('col-md-6')
            div.innerHTML = `<h5 class="card-title">${medicamento.nombre}</h5>
            <img src="${medicamento.imagen}" class="card-img-top" alt="">
            <div class="card-body">
            <p class="card-text">${medicamento.descripcion}</p>
            ${medicamento.stock<5 ? `<h5 class="stock stock-rojo">Stock disponible ${medicamento.stock}</h5>`: `<h5 class="stock">Stock disponible ${medicamento.stock}</h5>`}
            <div class="precio-agregar">
            <p class="card-precio">Precio: $${medicamento.precio}</p>
            <button class="btn agregar" id="${medicamento._id}">Agregar</button>
            </div></div>`
            
            contenedorCartas.appendChild(div)
            });
        }
        else{
            return
        }       
};
//FORMULARIO
if(form){
    form.addEventListener('submit', e=>{
        e.preventDefault()
        const inputNombre = document.getElementById('inputNombre');
        const inputApellido = document.getElementById('inputApellido');
        const inputTel = document.getElementById('inputTel');
        const inputComentario = document.getElementById('comentarios');
        const checkPerro = document.getElementById('btncheck1')
        const checkGato = document.getElementById('btncheck2')
        console.log(checkPerro);
        console.log(checkGato);
        inputComentario.classList.add('comentario');
        
        if(checkPerro.checked && checkGato.checked){
            inputComentario.value = `Muchas gracias ${inputNombre.value} por escribirnos, nos vamos a estar comunicando a este numero ${inputTel.value} para que su ${checkPerro.value} y ${checkGato.value} tengan la mejor atencion.`
        }else if(checkGato.checked){
            inputComentario.value = `Muchas gracias ${inputNombre.value} por escribirnos, nos vamos a estar comunicando a este numero ${inputTel.value} para que su ${checkGato.value} tenga la mejor atencion.`
        }else if(checkPerro.checked){
            inputComentario.value = `Muchas gracias ${inputNombre.value} por escribirnos, nos vamos a estar comunicando a este numero ${inputTel.value} para que su ${checkPerro.value} tenga la mejor atencion.`
        }else{
            inputComentario.value = `Muchas gracias ${inputNombre.value} por escribirnos, nos vamos a estar comunicando a este numero ${inputTel.value} para que nos comentes que mascota necesita atencion.`
        }
        inputNombre.value = '';
        inputApellido.value = '';
        inputTel.value = '';   
       
    });
}


//TARJETA LOGO NAV
const tarjeta = document.getElementById('tarjeta')

tarjeta.addEventListener('click', e=>{
    tarjeta.classList.toggle('girar')
})

//CARRITO DE COMPRAS


const contenedorArticulos = document.getElementById('container-card')
const tablaCarrito = document.getElementById('tabla-carrito');

if (contenedorArticulos || tablaCarrito ){

    contenedorArticulos.addEventListener('click',e=>{
        if(e.target.classList.contains('agregar')){
         seleccionar(articulos,e.target.id)
        }
        e.stopPropagation()
     })
     
     tablaCarrito.addEventListener('click',e=>{
         if(e.target.classList.contains('quitar')){
             quitarArticulo(articulos,e.target.value)
         }
     })
     
}



function seleccionar(array,idArticulo){
     array.filter(articulo=>articulo.precio>0)
    .forEach(articulo=>{
       if(articulo._id == idArticulo){
           articulo.__v++;     
       }
   })
   actualizarSeleccionados()
   actualizarTotal()
   guardarLocalStorage()
}


function actualizarSeleccionados(){
    let bodyCarrito = document.getElementById('body-carrito');
    bodyCarrito.innerHTML='';
    articulos.forEach(articulo=>{
    let filas = document.createElement('tr');
        if(articulo.__v > 0){
            filas.innerHTML = `
            <td>${articulo.__v}</td>
            <td>${articulo.nombre}</td>
            <td>$${articulo.precio}</td>
            <td>$${articulo.precio * articulo.__v}</td>
            <td><button type="button" class="btn btn-danger quitar" value="${articulo._id}">Quitar</button></td>`
        }      
        bodyCarrito.appendChild(filas) ;  
    })
}

function actualizarTotal(){
    let productosTotales = document.getElementById('productosTotales')
    productosTotales.innerHTML = ''
    let articulosTotales = 0;
    let precioTotal = 0;
    articulos.forEach(articulo=>{
        if(articulo.precio){
            articulosTotales += articulo.__v;
            precioTotal += (articulo.__v * articulo.precio); 
            productosTotales.innerHTML = `
            <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-danger">Cantidad de productos: ${articulosTotales}</li>
            <li class="list-group-item list-group-item-danger">Total: $${precioTotal}</li>
            </ul>`
        }      
    })
    
    
}

function quitarArticulo(array,value){
    array.forEach(articulo=>{
        if(articulo._id == value){
            articulo.__v--
        }
    })
    actualizarSeleccionados()
    actualizarTotal()
    guardarLocalStorage()
}

function guardarLocalStorage(){
    localStorage.setItem("articulos", JSON.stringify(articulos))
}

function obtenerLocalStorage(){
    return JSON.parse(localStorage.getItem("articulos"))
}





