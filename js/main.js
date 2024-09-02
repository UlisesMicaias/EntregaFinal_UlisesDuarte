//CAFETERÍA DE BUENOS AIRES
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//PRODUCTOS 
let productosData;
//creador de cards para los productos
function cardsProductosHome(cafes) {
    const conteinerProductos = document.getElementById('conteiner-productos');
        
    const row = document.createElement('div');
    row.className = 'row';
        
    cafes.forEach(el => {
        const col = document.createElement('div');
        col.className = 'col-md-3 ml-4 mt-4'; 
            
        const card = document.createElement('div');
        card.className = 'card d-flex flex-column';
        card.style.width = '18rem'; 
        card.style.height = '100%';
            
        const img = document.createElement('img');
        img.src = `${el.image_url}`;
        img.className = 'card-img-top shadow';
        img.alt = `${el.name}`; 
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';
            
        const h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.innerText = `${el.name}`;
            
        const p = document.createElement('p');
        p.className = 'card-text';
        p.innerText = `${el.description}`;

        const price = document.createElement('h4');
        price.innerText = `$${el.price}`

        const btnAgregar = document.createElement('a');
        btnAgregar.className = 'btn btn-dark mt-auto';
        btnAgregar.innerText = 'AÑADIR A CARRITO';
        
        
        cardBody.append(h5, price, p, btnAgregar);
        card.append(img, cardBody);
        col.append(card);
        
        row.append(col);
        
        btnAgregar.addEventListener('click', e => {
            e.preventDefault(); 
            agregarACarrito(el); 
    });

    conteinerProductos.append(row);
    });
}

// recopila mediante fetch y async/await los datos de la API coffe y gracias a eso los usa y renderiza los cafes
const mostrarProductos = async () =>{
    const precioTotalElem = document.getElementById('precio-total');
    if (precioTotalElem) {
        precioTotalElem.remove();
    } 
    try {
        const response = await fetch('https://fake-coffee-api.vercel.app/api')
        const data = await response.json();
        cardsProductosHome(data);
    } catch (error) {
        console.log(error)
    }
};
mostrarProductos();
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//CARRITO
// variables de los contenedores de la sección de los carritos
let carrito = [];
const btnCarrito = document.getElementById('btn-carrito');
const containerCarrito = document.getElementById('conteiner-carrito');
const containerSearch =  document.getElementById('conteiner-search');
const containerProductos = document.getElementById('conteiner-productos');

// agregamos los productos al carrito en el storage
function agregarACarrito(producto) {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExiste = carrito.find(cafe => cafe.id === producto.id);
    
    if (productoExiste) {
        productoExiste.cantidad += 1;
        if (productoExiste.cantidad >= 10) {
            Swal.fire({
                title: "¡Cuidado!",
                text: "Has agregado el mismo producto 10 veces. ¿Estás seguro de seguir agregando?",
                icon: "warning",
                showConfirmButton: true,
                confirmButtonText: "Sí, continuar",
                cancelButtonText: "No, cancelar",
                showCancelButton: true,
                timer: 10000 
            }).then(result => {
                if (result.isConfirmed) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 500,
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Agregado exitosamente"
                    });
                }
            });
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 500,
            });
            Toast.fire({
                icon: "success",
                title: "Agregado exitosamente"
            });
        }
    } else {
        const productoConCantidad = { ...producto, cantidad: 1 };
        carrito.push(productoConCantidad);

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 500,
        });
        Toast.fire({
            icon: "success",
            title: "Agregado exitosamente"
        });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// mostramos y actualizamos los precios
function precioTotalCompra() {
    let precioTotal= carrito.reduce((acc, producto) => acc + Math.round((producto.price * producto.cantidad)), 0);
    
    const h1 = document.createElement('h1');
    h1.innerText = `PRECIO TOTAL: $${precioTotal}`;
    h1.id = 'precio-total';
    
    containerCarrito.append(h1);
}

//renderizamos los productos en el carrito
function cardsProductosCarrito() {
    containerCarrito.innerHTML = '';
    
    const row = document.createElement('div');
    row.className = 'row';
    
    carrito.forEach(el => {
        const col = document.createElement('div');
        col.className = 'col-md-3 ml-4 mt-4'; 
            
        const card = document.createElement('div');
        card.className = 'card d-flex flex-column';
        card.style.width = '18rem'; 
        card.style.height = '100%';
            
        const img = document.createElement('img');
        img.src = `${el.image_url}`;
        img.className = 'card-img-top shadow';
        img.alt = `${el.name}`; 
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';
            
        const h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.innerText = `${el.name}`;
            
        const h6 = document.createElement('h6');
        h6.className = 'card-text';
        h6.innerText = `cantidad(${el.cantidad})`;

        const price = document.createElement('h4');
        price.innerText = `$${el.price}`
        
        const btnEliminar = document.createElement('a');
        btnEliminar.className = 'btn btn-dark mt-auto';
        btnEliminar.innerText = 'ELIMINAR DE CARRITO';


        
        cardBody.append(h5, price, h6, btnEliminar);
        card.append(img, cardBody);
        col.append(card);
        
        row.append(col);
        
        btnEliminar.addEventListener('click', () => {
            eliminarProducto(el)
        })
    });

    containerCarrito.append(row);
}

function mostrarCarrito() {
    if (containerProductos) {
        containerProductos.style.display = 'none'
    }
    if (containerSearch) {
        containerSearch.style.display = 'none'
    }

    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if(carrito.length === 0){
        Swal.fire({
            title: "Carrito vacío",
            text: "No tienes productos agregados en el carrito",
            confirmButtonText: "agregar"
        }).then( result => {
            if(result.isConfirmed){
                containerProductos.style.display = 'block';
                containerSearch.style.display = 'flex';
            }
        });
    }
    
    containerCarrito.innerHTML = '';

    cardsProductosCarrito();
    precioTotalCompra();
}

btnCarrito.addEventListener('click', () => {
    mostrarCarrito();
});

//-------------------------------------------------------------------------------------------
//ELIMINAR PRODUCTOS

function eliminarProducto(el){
    const i = carrito.findIndex(producto => producto.id === el.id);

    if (el.cantidad > 1) {
        carrito[i].cantidad -=1;
    }else{
        carrito.splice(i,1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
        
    mostrarCarrito();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------

//BUSQUEDAS
const searchInput = document.getElementById('searchInput');
const resultadosList = document.getElementById('results');
const noResultados = document.getElementById('no-results');
let cafeData;

//filtramos el buscador de toda la api, recorriendola y mostrando las coincidencias 
function mostrarResultados(cafes) {
    const buscadorItems = searchInput.value.toLowerCase();
    const coincidenciasCafes = cafes.filter(cafes => cafes.name.toLowerCase().startsWith(buscadorItems));
    
    resultadosList.innerHTML = '';
    
    if (coincidenciasCafes.length > 0) {
        coincidenciasCafes.forEach(cafe => {
            const li = document.createElement('li');
            li.className = 'items-busqueda';
            li.innerText = `${cafe.name}`;
            resultadosList.appendChild(li);
        });
        noResultados.style.display = 'none';
    } else {
        noResultados.style.display = 'block';
    }
    
    if (buscadorItems.length == 0) {
        resultadosList.innerHTML = '';
    }
}

const dataCafeBusquedas = async () => {
    try {
        const response = await fetch('https://fake-coffee-api.vercel.app/api')
        const data = await response.json();
        cafeData = data;
    } catch (err) {
        console.log(err);
    }
};
searchInput.addEventListener('input', () => {
    mostrarResultados(cafeData)
});
dataCafeBusquedas();
