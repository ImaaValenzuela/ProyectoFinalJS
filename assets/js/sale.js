const API_URL = "https://jsonplaceholder.typicode.com";
const HTMLResponse = document.querySelector("#app")
const ul = document.createElement('ul');

fetch (`${API_URL}/users`)
    .then ((response) => response.json())
    .then ((users) => {
        users.forEach((user) =>{
            let elem = document.createElement("li");
            elem.appendChild(
                document.createTextNode(`${user.username}: ${user.email}`)
            );
            ul.appendChild(elem);
        });
        HTMLResponse.appendChild(ul)
    });

    const baseDeDatos = [
        {
            "id": 12,
            "tipo": "Zapas",
            "nombre": "Dakiti Yellow Reflex",
            "precio": 6150,
            "imagen": "../assets/img/zapas/dakitiyellow.jpg"
        },
        {
            "id": 25,
            "tipo": "Gorras",
            "nombre": "Gorra Los Angeles Negra/Roja",
            "precio": 1800,
            "imagen": "../assets/img/gorras/gorralaredblack.jpg"
        },
        {
            "id": 13,
            "tipo": "Zapas",
            "nombre": "Dakiti Dark Reflex",
            "precio": 6400,
            "imagen": "../assets/img/zapas/dakitidark.jpg"
        },
        {
            "id": 26,
            "tipo": "Gorras",
            "nombre": "Gorra Red Bull Racing",
            "precio": 2300,
            "imagen": "../assets/img/gorras/gorraredbullrac.jpg"
        },
        {
            "id": 14,
            "tipo": "Zapas",
            "nombre": "Dakiti Galaxy Black Reflex",
            "precio": 6700,
            "imagen": "../assets/img/zapas/dakitigalaxyblack.jpg"
        },
        {
            "id": 21,
            "tipo": "Gorras",
            "nombre": "Gorra New York Negra",
            "precio": 2000,
            "imagen": "../assets/img/gorras/gorranynegra.jpg"
        },
    ];
    
    
    let carrito = []; 
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonComprar = document.querySelector('#boton-compra');
    
    
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    
    function anyadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
            })
            Toast.fire({
            icon: 'success',
            title: `Has añadido un producto a tu carrito`
            });
        renderizarCarrito();
    
    }
    
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }
    
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 900,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
            })
            Toast.fire({
            icon: 'error',
            title: 'Se ha eliminado el producto de su carrito'
            });
        renderizarCarrito();
    }
    
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }
    
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
    }
    
    
    DOMbotonComprar.addEventListener('click', () => {
        if (carrito.length === 0 ){
            swal.fire({
                title: 'Error!',
                text: 'Tu carrito esta vacio!',
                icon: 'error',
                confirmButtonText: ' Aceptar '
            }) 
        } else {
            Swal.fire(
                'Su compra se ha realizado correctamente!',
                'Por favor, complete los siguientes datos',
                'success'
                ), 
                function(){
                window.location.href = "./pages/pago.html";
                }
            vaciarCarrito();
        }
    })
    
    DOMbotonVaciar.addEventListener('click', () => {
        if (carrito.length === 0 ){
            swal.fire({
                title: 'Error!',
                text: 'Tu carrito esta vacio!',
                icon: 'error',
                confirmButtonText: ' Aceptar '
            }) 
        } else {
            Swal.fire({
                title: 'Borrar carrito',
                text: "Estas seguro que quieres vaciar el carrito?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, quiero vaciarlo',
                cancelButtonText: 'Cancelar'
                }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                    'Borrado',
                    'Su carrito se vacio con exito, Esperamos verte pronto nuevamente',
                    'success'
                    )
                    vaciarCarrito()
                }
                })
        }
    })
    
    
    renderizarProductos();
    renderizarCarrito();