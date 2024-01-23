// Importaciones
import productos from '../datos/productoszona.json' assert { type: 'json' };
import dolar     from '../datos/dolar.json ' assert { type: 'json' };

// Elementos
const muestraProductosEl    = document.querySelector("#muestraProductos");
const muestraCategoriasEl   = document.querySelector("#muestraCategorias");
const menuCategoriasEl      = document.querySelector("#menuCategorias");
const tituloCategoriaEl     = document.querySelector("#tituloCategoria");
const muestraDetalleEl      = document.querySelector("#muestraDetalle");
const mostrarCarritoEl      = document.querySelector("#mostrarCarrito");
const btnCarritoEl          = document.querySelector("#btnCarrito");
const contadorCarritoEl     = document.querySelector("#contadorCarrito");
const totalCarritoEl        = document.querySelector("#totalCarrito");
const terVacCarritoEl       = document.querySelector("#terVacCarrito");
const txtBuscarEl           = document.querySelector("#txtBuscar");
// globales 
let carrito=[];

addEventListener("DOMContentLoaded",()=>{
    const categorias = [...new Set(productos.map((producto) => producto.categoria))];
    let catSeleccionada=categorias[0];
    const productosFiltrados = productos.filter((producto) => producto.categoria === catSeleccionada);

    renderCategorias(categorias);
    renderMenuCategorias(categorias);
    rederCard(productosFiltrados,catSeleccionada);
    buscarLocalStore();
  
})
/*    local store   */
/*    local store   */
function  buscarLocalStore(){
    let array=get();
    if(array){
      carrito=JSON.parse(array);
      actualizaCarrito()
    }
}
function save(array) {
    localStorage.setItem('products',array);
}
function get() {
    return localStorage.getItem('products');
}
// Funciones

function renderCategorias(categorias){
    let valor="";
    categorias.forEach(element=>{
        valor+=
        `
            <a href="#" class="btn btn-danger m-1" id="${element}">${element}</a>
        `
    })
    muestraCategoriasEl.innerHTML=valor
}
muestraCategoriasEl.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target && e.target.tagName==="A"){
        let catSeleccionada=e.target.id; 
        filtraProductos(catSeleccionada)
    }
})
function renderMenuCategorias(categorias){
    let valor="";
    categorias.map((cat)=>{
        valor+=
        ` <li><a class="dropdown-item" href="#" id="${cat}">${cat}</a></li>
        `
    })
    menuCategoriasEl.innerHTML=valor
}
menuCategoriasEl.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target && e.target.tagName==="A"){
        let catSeleccionada=e.target.id; 
        filtraProductos(catSeleccionada)
    }
})
function filtraProductos(catSeleccionada){

    const productosFiltrados = productos.filter((producto) => producto.categoria === catSeleccionada);
    rederCard(productosFiltrados,catSeleccionada); 
    
}
function rederCard(productosFiltrados,catSeleccionada){
    tituloCategoriaEl.innerHTML=`${catSeleccionada} (${productosFiltrados.length})`;
    let valor="";
    if (productosFiltrados && productosFiltrados.length > 0) {
        productosFiltrados.forEach(element => {
            valor +=
                `
                <div class="col-mg-4 col-lg-3 col-xl-2 mb-4">
                    <div class="card h-100 " data-bs-theme="dark">
                        <div class="card-header p-0">
                            <img src="img/productos/${element.imagen}" alt="" class="img-fluid">
                        </div>
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            ${element.nombre}
                            <h6 class="pt-3 text-danger"><b>Precio: </b>${element.precio}$</h6>
                        </div>
                        <div class="card-footer text-center">
                            <a href="#" class="btn btn-outline-success btn-sm" id="${element.id}" name="detalle" data-bs-toggle="modal" data-bs-target="#detalleModal">Detalle</a>
                            <a href="#" class="btn btn-outline-danger btn-sm" id="${element.id}" name="comprar">Comprar</a>
                        </div>
                    </div>
                </div>
                `;
        });
    } else {
        valor = `<h1 class="text-center">No hay datos para esta busqueda</h1>`;
    }
    muestraProductosEl.innerHTML=valor;

}
muestraProductosEl.addEventListener("click",(e)=>{
    e.preventDefault();

    if(e.target && e.target.tagName==="A"){
        if(e.target.name=='detalle') renderDetalle(e.target.id);
        if(e.target.name=='comprar') agregarAlCarrito(e.target.id)
    }
})
function renderDetalle(id){
    console.log(id);
    const formatter = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VEF' });
    const resultado = productos.find(producto => producto.id === id);
    const precioFormateado = formatter.format(resultado.precio * dolar[0].cambio);
    let valor=
    `
        <div class="col-md-4">
            <img src="img/productos/${resultado.imagen}" alt="" class="img-fluid">
        </div>
        <div class="col-md-8">
            <h4><b>Nombre: </b>${resultado.nombre}</h4>
            <h5><b>Categoria: </b>${resultado.categoria}</h5>
            <h5><b>Disponibilidad: </b>(${resultado.disponible})</h5>
            <h4 class="pt-3 text-danger"><b>Precio: </b>${resultado.precio} $</h4>
            <h5 class="text-danger"><b>Precio: </b>${precioFormateado} Bs.</h5>
        </div>
    `
    muestraDetalleEl.innerHTML=valor

}
function agregarAlCarrito(id){
    if (id !== "") {
        if (carrito.find(proSeleccionado => proSeleccionado.id === id)) {
          swal("¡Ups", "Este producto ya está en tu carrito de compras. Por favor, verifica antes de agregarlo nuevamente", "warning");
        } else {
          swal("Indique la Cantidad:", {
            content: "input",
          }).then(value => {
            if (value !== "" && !isNaN(value)) {
              const resultado = productos.find(producto => producto.id === id);
              if (resultado) {
                const cant = Number(value);
                carrito.push({ ...resultado, cantidad: cant });
                actualizaCarrito();
                 //localstore
                 let jsonArray=JSON.stringify(carrito);
                 save(jsonArray);
                 //swal(`Gracias por comprar: ${value} artículos`);
              } else {
                swal("Error", "El producto no se encontró", "error");
              }
            } else {
              swal("Error", "Por favor, ingrese solo números", "error");
            }
          });
        }
      }
}


// funciones del carrito
btnCarritoEl.addEventListener("click",(e)=>{
    e.preventDefault();
    renderCarrito();
    
})
function renderCarrito(){
    let valor="";
    let cantidadTotal=0;
    let montoTotal=0;
     const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    if(carrito && carrito.length>0){
        carrito.forEach(element=>{
           
            const precioFormateado = formatter.format(element.precio * element.cantidad);
            cantidadTotal=cantidadTotal+element.cantidad;
            montoTotal=montoTotal+(element.precio * element.cantidad)

            valor+=
            `
            <div class="card mb-1">
                <div class="row g-0">
                    <div class="col-md-3 p-2 mt-1">
                        <img src="img/productos/${element.imagen}" alt="" class="img-fluid">
                    </div>
                    <div class="col-md-8">
                            <div class="card-body small p-0">
                                <p><b>${element.nombre}</b><br/>
                                    <b>Categoria: </b>${element.categoria}<br/>
                                    <b>Cantidad: </b>${element.cantidad} 
                                    <span class="text-danger"><b> Precio:</b>${element.precio}</span><br/>
                                    <b> Total: </b>${precioFormateado}<br>
                                </p>

                            </div>
                    </div>
                    <div class="col-md-1 pt-2">
                        <a href="#" class="btn btn-dark btn-sm bx bx-minus" name="resta" id="${element.id}"></a>
                        <a href="#" class="btn btn-success btn-sm bx bx-plus" name="suma" id="${element.id}"></a>   
                        <a href="#" class="btn btn-danger btn-sm bx bx-trash" name="elimina" id="${element.id}"></a>                 
                    </div>
                </div>
            </div>
            `
        });

        mostrarCarritoEl.innerHTML=valor
        const totalFormateado = formatter.format(montoTotal);
        totalCarritoEl.innerHTML=`
            <p class="img-thumbnail px-3 text-dark"><b>Cantidad: </b>${cantidadTotal}</p>
            <p class="img-thumbnail px-3 text-dark"><b>Importe: </b>${totalFormateado}</p>
        `
    }else{
        mostrarCarritoEl.innerHTML=""
    }
}
mostrarCarritoEl.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target && e.target.tagName==="A"){
        if(e.target.name=="elimina"){
           eliminarItem(e.target.id)
        }
        if(e.target.name=="resta"){
            restarItem(e.target.id)
        }
        if(e.target.name=="suma"){
            sumarItem(e.target.id)
        }
    }
})
function sumarItem(id){
    carrito.forEach(element => {
        if(id==element.id){
            element.cantidad++
        } 
    });
    actualizaCarrito();
}
function restarItem(id){
    carrito.forEach(element => {
        if(id==element.id){
            if(element.cantidad>1){
                element.cantidad--
            }  
        } 
    });
    actualizaCarrito();
}
function eliminarItem(id) {
    swal({
      title: "Eliminar?",
      text: "¿Está seguro de eliminar este producto?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        carrito = carrito.filter(prod => prod.id !== (id));
        contadorCarritoEl.innerHTML = carrito.length;
        actualizaCarrito();
        swal("El producto ha sido eliminado!", { icon: "success" });
      }
    });
}
function actualizaCarrito(){
    contadorCarritoEl.innerHTML=carrito.length
    localStorage.setItem('products', JSON.stringify(carrito)); // Actualizar el localStorage con el carrito actualizado
    renderCarrito();
}

terVacCarritoEl.addEventListener("click",(e)=>{
    if (e.target && e.target.tagName=="A"){
        if(e.target.name=="vaciar"){
            vaciarCarrito()
        }
        if(e.target.name=="realizar"){
            realizarCompra()
        }
    }
})
function vaciarCarrito() {
    if(carrito && carrito.length>0){
        swal({
        title: "Vaciar?",
        text: "¿Está seguro de que desea vaciar el carrito?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        }).then((willDelete) => {
        if (willDelete) {
            carrito=[];
            swal("¡El carrito ha sido vaciado con éxito!", { icon: "success" });
            actualizaCarrito();
        }
        });
    }
}
function realizarCompra() {
    const cart = carrito.map(element => ({
      id: element.id,
      cantidad: element.cantidad,
      precio: element.precio
    }));
  
    carrito.length = 0; // Vaciar el array carrito
    localStorage.clear();
    actualizaCarrito();
  
    swal("Gracias", "La compra fue enviada exitosamente", "success");
  
    const data = JSON.stringify(cart);
    // window.open().document.write(`<pre>${data}</pre>`);
    console.log(data);
  }
// funciones para buscar
txtBuscarEl.addEventListener("keyup", () => {
    const text = txtBuscarEl.value.toLowerCase();
    
    // Verificar si el campo de búsqueda tiene más de 3 caracteres
    if (text.trim().length < 3) {
      return; // No realizar la búsqueda si tiene menos de 3 caracteres
    }
    
    const palabrasBusqueda = text.split(" ");
    
    const productosFiltrados = productos.reduce((result, producto) => {
      const nombreProducto = producto.nombre.toLowerCase();
      
      // Normalizar el texto buscado y el nombre del producto para tener en cuenta los acentos
      const textoNormalizado = palabrasBusqueda.map(palabra => palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      const nombreNormalizado = nombreProducto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Verificar si todas las palabras de búsqueda están presentes en el nombre del producto
      const todasLasPalabrasPresentes = textoNormalizado.every(palabra => nombreNormalizado.includes(palabra));
      
      if (todasLasPalabrasPresentes) {
        result.push(producto);
      }
      return result;
    }, []);
    
    let titulo = `BUSCAR : ${text}`;
    rederCard(productosFiltrados, titulo);
});




/*
optimizada para buscar no importando el orden de la palabras a buscar
txtBuscarEl.addEventListener("keyup", () => {
    const text = txtBuscarEl.value.toLowerCase();
    
    // Verificar si el campo de búsqueda tiene más de 3 caracteres
    if (text.trim().length < 3) {
      return; // No realizar la búsqueda si tiene menos de 3 caracteres
    }
    
    const palabrasBusqueda = text.split(" ");
    
    const productosFiltrados = productos.reduce((result, producto) => {
      const nombreProducto = producto.nombre.toLowerCase();
      
      // Verificar si todas las palabras de búsqueda están presentes en el nombre del producto
      const todasLasPalabrasPresentes = palabrasBusqueda.every(palabra => nombreProducto.includes(palabra));
      
      if (todasLasPalabrasPresentes) {
        result.push(producto);
      }
      return result;
    }, []);
    
    let titulo = `BUSCAR : ${text}`;
    rederCard(productosFiltrados, titulo);
  });

*/











/*
optimizada no importando el uso de acentos
txtBuscarEl.addEventListener("keyup", () => {
    const text = txtBuscarEl.value.toLowerCase();
    
    // Verificar si el campo de búsqueda tiene más de 3 caracteres
    if (text.trim().length < 3) {
      return; // No realizar la búsqueda si tiene menos de 3 caracteres
    }
    
    const productosFiltrados = productos.reduce((result, producto) => {
      const nombreProducto = producto.nombre.toLowerCase();
      
      // Normalizar el texto buscado y el nombre del producto para tener en cuenta los acentos
      const textoNormalizado = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nombreNormalizado = nombreProducto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (nombreNormalizado.includes(textoNormalizado)) {
        result.push(producto);
      }
      return result;
    }, []);
    
    let titulo = `BUSCAR : ${text}`;
    rederCard(productosFiltrados, titulo);
  });



*/









/*
optimizada para que busque a partir de 3 caracteres y usando reduce por filter
txtBuscarEl.addEventListener("keyup", () => {
    const text = txtBuscarEl.value.toLowerCase();

   if (text.trim().length < 3) {
        return; // No realizar la búsqueda si tiene menos de 3 caracteres
   }

    const productosFiltrados = productos.reduce((result, producto) => {
      if (producto.nombre.toLowerCase().includes(text)) {
        result.push(producto);
      }
      return result;
    }, []);
    let titulo = `BUSCAR : ${text}`;
    rederCard(productosFiltrados, titulo);
  });
*/

/*
funcion original sin las optimizaciones
txtBuscarEl.addEventListener("keyup",()=>{
    const text = txtBuscarEl.value
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(text))
    let titulo=`BUSCAR : ${text}`
    rederCard(productosFiltrados,titulo);
})
*/
