/* 
main.js:
    -Contiene la logica de la pagina historial
*/

/**Variables */
var pageInfo;
var pagesController;
var modal;

/**Espero a que renderice el HTML */
$(document).ready(function() {
    modal = document.getElementById("myModal");
    loadEventos();
});

/** Cierra el modal al hacer clic en cualquier lugar */
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}


/**Carga los eventos encontrados en la pantalla */
function loadEventos(data)
{
  // preparo la lista de items a mostrar que tengo en el storage
  var items = [];
  Object.keys(sessionStorage).forEach(function(key){
    items.unshift(JSON.parse(sessionStorage.getItem(key)));
  });
  // limpio la información actual para insertar la nueva
    $("#cards").empty();

    // recorro la información obtenida y voy agregando las nuevas tarjetas
    items.forEach(evento => {
        // busco la imagen del tamaño minimo
        var imagen;
        evento.images.forEach(image => {
            if(image.width < 1024)
                imagen= image.url;
            return false;
        });

        var cardHTML = buildCard(evento.id, evento.name, imagen, evento._embedded.venues[0].city.name, evento.dates.start.localDate, evento.classifications[0].segment.name);
        $(cardHTML).appendTo($("#cards"));
    });
}

/** Abre el modal con el id de evento */
function openDetail(eventoid)
{
    getEventoDetalle(eventoid, loadDetail);
}

/** Busca y carga el detalle del evento */
function loadDetail(data)
{
    // busco la imagen del tamaño minimo
    var imagen;
    data.images.forEach(image => {
        if(image.width < 1024)
            imagen= image.url;
        return false;
    });

    // cargo el titulo del modal
    $(".modal-header").html("<h2>"+data.name+"</h2>");

    // cargo la info del evento
    var eventInfo =    
        '<div class="infoImg"><img src="'+imagen+'"></div>'+

      '<div class="infoTitle"><h3>Clasificación</h3></div>'+
      '<div class="infoData"><p>'+data.classifications[0].genre.name+', '+data.classifications[0].segment.name+', '+data.classifications[0].subGenre.name+', '+'</p></div>'+      

      (data.info!==undefined ? 
        '<div class="infoTitle"><h3>Info</h3></div>'+
        '<div class="infoData"><p>'+data.info+'</p></div>'
        :'') +

      (data.pleaseNote!==undefined ? 
        '<div class="infoTitle"><h3>Please note</h3></div>'+
        '<div class="infoData"><p>'+data.pleaseNote+'</p></div>'
        :'') +
      (data.ticketLimit!==undefined ? 
        '<div class="infoTitle"><h3>Ticket available</h3></div>'+
        '<div class="infoData"><p>'+data.ticketLimit.info+'</p></div>'
        :'')
      ;
    $(".modal-body").html(eventInfo);

    // muestro el modal
    modal.style.display = "block";
}

/**Construye un tarjeta html que contiene la info de un evento */
function buildCard(eventoID, titulo, imagen, ciudad, fecha, categoria)
{
    var template =       
        '<article class="animate__animated animate__fadeIn card">'+
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
              '<div class="card-share-detail">'+
                '<button class="card-share-button" role="link" onclick="openDetail(\''+eventoID+'\')">Detalle</button>'+
                '<button class="card-detail-button" role="link" onclick="window.location=\'./share.html?eventid='+eventoID+'\'">Compartir</button>'+
              '</div>'+
          '</div>'+
        '</article>'
  return template;
}


function openMenu() {
    document.getElementById("menu").style.width = "250px";
}
  
function closeMenu() {
    document.getElementById("menu").style.width = "0";
}