/* 
share.js:
    -Contiene la logica de la pagina "Compartir"
*/
var eventoID;
$( document ).ready(function() {
    // apenas renderiza la pagina, obtengo el id del evento seleccionado que le paso por parametro a la url
    const url_string = window.location.href
    const url = new URL(url_string);
    eventoID = url.searchParams.get("eventid");
    
});
