function Resta() {
    var Cantidad = parseInt($("#cantidad")[0].innerHTML);
    if (Cantidad > 1) $("#cantidad")[0].innerHTML = Cantidad - 1
    $("#total")[0].innerHTML = parseInt($("#cantidad")[0].innerHTML) * parseInt($("#precio")[0].innerHTML);
}
function Suma() {
    var Cantidad = parseInt($("#cantidad")[0].innerHTML);
    $("#cantidad")[0].innerHTML = Cantidad + 1;
    $("#total")[0].innerHTML = addCommas(parseInt($("#cantidad")[0].innerHTML) * parseInt($("#precio")[0].innerHTML));
}
function LimpiaProducto() {
    $("#categoria").html("");
    $("#titulo").html("");
    document.getElementById("imgs").src = "";
    $("#descripcion").html("");
    $("#contenido").html("");
    $("#actualizacion").html("");
    $("#precio").html("0");
    $("#unidad").html("");
    $("#AvisoCarroAdd")[0].innerHTML = "";
    $("#cantidad")[0].innerHTML = "1";
    Resta();
    Producto = null;
}
function Muestra() {
    //Se agrega la validación del sitio permitido para éste cliente movil
    var SitioValido = false;
    for (var i = 0; i < SitioSi.length; i++) {
        if ($("#qrSKU")[0].value.indexOf(SitioSi[i])>0 || SitioSi[i] =="*") {
            SitioValido = true;
            break;
        }
    }
    if (!SitioValido){
        alert("Su aplicacion movil, no es compatible con este codigo, favor de visitar: toruzcart.com para otras aplicaciones compatibles.");
        return;
    }

    $.mobile.changePage('#paymentsDetails');
    readSinglePost($("#qrSKU")[0].value);

    function readSinglePost(Ruta) {
        LimpiaProducto();
        escribeEstado("Consultando .... ");
        Resta();

        $.ajax({
            crossDomain: false,
            xhrFields: { withCredentials: false },
            type: 'POST',
            url: Ruta + "&jsoncallback=a12345",
            dataType: 'json',
            success: function (data) {
                if (data.status != "error") {
                    var Post;
                    if (data.post != undefined){
                        Post=data.post;
                    } else if (data.page != undefined){
                        Post=data.page;
                    } else {
                        LimpiaProducto();
                        $("#titulo").html("<a style='color:#FF0000'>No se pudo leer el artículo...</a>");
                        ExisteProducto = false;
                    }

                    if (Post != undefined) {
                        $("#categoria").html(Post.taxonomy_product_cat[0].title);
                        $("#titulo").html(Post.title);
                        document.getElementById("imgs").src=Post.thumbnail.replace(/"\"/g,"");
                        $("#descripcion").html("<h2>Descripcion del Producto</h2>" + Post.excerpt);
                        $("#contenido").append(Post.content);
                        $("#contenido").append("<small><br>");
                        $("#actualizacion").html("Ultima actualizacion: " + Post.modified);
                        $("#contenido").append("</small>");
                        //                        $("#precio").html(data.page.custom_fields.mp_sale_price);
                        $("#precio").html(addCommas(Post.id));
                        $("#unidad").html(Post.comment_status);
                        Resta();
                        escribeEstado("");
                        ExisteProducto = true;
                        Producto = Post;
                     }

                } else {
                    LimpiaProducto();
                    $("#titulo").html("<a style='color:#FF0000'>Esta informacion no fue encontrada, consulte a su asesor...</a>");
                    ExisteProducto = false;
                }
                escribeEstado("");
            } //fin sucess
        }).fail(function (data) {
console.log('falla.............'  + data);
            ExisteProducto = false;
            if (console && console.log) {
                escribeEstado("<a style='color:#FF0000'>Error al conectarse al servidor</a>");
            }
        });

}; // fin readSinglePost

};
function escribeEstado(Texto) {
    $("#estado").html(Texto);
}
function AgregaCarro() {
    if (!ExisteProducto) {
        escribeEstado("<a style='color:#FF0000'>No tiene un pruducto que agregar</a>");
        return;
    }

    //Se limpian campos que no se usan para simplificar el almacenamiento local
    Producto.author = "";
    Producto.taxonomy_product_type = "";
    Producto.MovilGuardado = new Date();
    Producto.MovilCantidad = $("#cantidad")[0].innerHTML;
        
    //Se busca a que tienda pertenece la mercancia para tener carritos por tienda, basado en el url del producto, el nombre del carro es el nombre del sitio y/o subdominio
    var Partesurl = Producto.url.split("/");
    var nombreCarrito = "";
    for (var i = 0; i < Partesurl.length; i++) {
        if (Partesurl[i].indexOf(".com") > 0) {
            nombreCarrito = ""+Partesurl[i];
            break;
        }
    }
    //se carga el carrito de la tienda, para poder agregarle
    var CarritoTienda = JSON.parse(localStorage.getItem(Partesurl[i]));
    var Cancelado = false;
    //se valida si tiene contenido
    if (CarritoTienda === null || CarritoTienda === undefined)
        CarritoTienda = [];
    else {
        var Actualizado = false;
        for (var i = 0; i < CarritoTienda.length; i++) {
            if (CarritoTienda[i].url == Producto.url) {
                if (confirm("Ya tiene un producto igual en su carrito con '" + CarritoTienda[i].MovilCantidad + "' ¿desea agregar '" + Producto.MovilCantidad + "'?")) {
                    CarritoTienda[i].MovilCantidad = parseInt(CarritoTienda[i].MovilCantidad) + parseInt(Producto.MovilCantidad);
                    Actualizado = true;
                } else Cancelado = true;
                break;
            }
        }
    }
    //Si no se actualizó la cantidad del producto a agregar al carrito, quiere decir que el producto no existía y se agrega por primera vez
    if (!Actualizado)
        CarritoTienda.push(Producto);

    //Se almacena el producto dentro de la Tienda (url) para distinguir de que tienda es el producto
    window.localStorage.setItem(nombreCarrito, JSON.stringify(CarritoTienda));
    if (!Cancelado) $("#AvisoCarroAdd")[0].innerHTML = "Su producto se agrego al carrito, gracias";

    //guarda el nombre del carrito en cache, para poderlo consultar después
    //se carga el carrito de la tienda, para poder agregarle, un nuevo carrito si se requiere
    var Carritos = JSON.parse(localStorage.getItem("ToruzCart"));
    //se valida si tiene contenido
    if (Carritos === null || Carritos === undefined) {
        Carritos = [];
        Carritos.push('{"Nombre":"' + nombreCarrito + '"}');
    } else {
        var Existe = false;
        for (var i = 0; i < Carritos.length; i++) {
            if (JSON.parse(Carritos[i]).Nombre == nombreCarrito) {
                Existe = true;
                break;
            }
        }
        //Si no exite el carrito se almacena su nombre, para furuta consulta
        if (!Existe)
            Carritos.push('{"Nombre":"' + nombreCarrito + '"}');

    }
    window.localStorage.setItem("ToruzCart", JSON.stringify(Carritos));
};
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var ExisteProducto = false;
var Producto;
/***********
http://objectmix.com/xml-soap/307425-access-denied-xmlhttp-request.html

http://forums.kayako.com/threads/permission-denied-to-call-method-xmlhttprequest-open.3367/page-1

http://www.webdeveloper.com/forum/showthread.php?t=147342

*******/