/* 
main.js:
    -Contiene la logica de la pagina principal
*/

/**Espero a que renderice el HTML */
$( document ).ready(function() {
    // asocio las funciones en los botones
    bind();
});

function bind()
{
    $("#searchButton").bind("click", buscarEventos); 
}
function buscarEventos()
{
    // obtengo los parametros de busqueda
    const nombre = $('#inputNombre').val();
    const categoria = $('#inputCategoria').val();
    const fecha = $('#inputFecha').val();

    // busco los eventos
    getEventos(nombre,categoria,fecha,cargarEventos);
}

function cargarEventos(data)
{
    // limpio la información actual para insertar la nueva
    $("#cards").empty();

    // recorro la información obtenida y voy agregando las nuevas tarjetas
    data._embedded.events.forEach(evento => {
        // busco la imagen del tamaño minimo
        var imagen;
        evento.images.forEach(image => {
            if(image.width < 400)
                imagen= image.url;
            return false;
        });

        var cardHTML = buildCard(evento.id, evento.name, imagen, evento._embedded.venues[0].city.name, evento.dates.start.localDate, evento.classifications[0].segment.name);
        $(cardHTML).appendTo($("#cards"));
    });
}

function getNextPage(url)
{
    getByRef(url, getNextResults);
}
function getNextResults(data)
{
    console.log(data);
}


function buildCard(eventoID, titulo, imagen, ciudad, fecha, categoria)
{
    var template =       
        '<article class="card">'+
          '<div class="card-title">'+titulo+'</div>'+
          '<div class="card-image">'+
            '<img src="'+imagen+'">'+
          '</div>'+
          '<div class="card-description-container">'+
              '<div class="card-description">'+
                '<div class="card-info"><div class="card-info-title">Ciudad</div><div class="card-info-data">'+ciudad+'</div></div>'+
                '<div class="card-info"><div class="card-info-title">Fecha</div><div class="card-info-data">'+fecha+'</div></div>'+
                '<div class="card-info"><div class="card-info-title">Categoria</div><div class="card-info-data">'+categoria+'</div></div>'+
              '</div>'+  
              '<div class="card-share">'+
                '<button role="link" onclick="window.location=\'./pages/share.html?eventid='+eventoID+'\'">Compartir</button>'+
              '</div>'+
          '</div>'+
        '</article>'

  return template;
}