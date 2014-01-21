function Valida() {
}
function CargaInfo() {
    var personas = JSON.parse(localStorage.getItem('personas'));
    var cantPersonas = -1;
    if (personas != undefined)
        cantPersonas = (typeof personas === 'string') ? 0 : personas.length;

    if (personas != undefined) {
        $('.nombre').html(personas.nombre);
    } else
        $('.nombrepersona').value=cantPersonas;

    window.localStorage.setItem("personas", JSON.stringify('{"nombre":"si1", "telefono":"222"}'));
}