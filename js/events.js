/* 
main.js:
    -Contiene la logica de la pagina principal
*/

/**Variables */
var pageInfo;
var pagesController;
var pageEvents={}; //diccionario de eventos
var modal;
/**Espero a que renderice el HTML */
$( document ).ready(function() {
    // asocio las funciones en los botones
    bind();
    load();
    modal = document.getElementById("myModal");
});

/** Cierra el modal al hacer clic en cualquier lugar */
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

/**Asocia las funciones a los botones */
function bind()
{
    $("#searchButton").bind("click", buscarEventos); 
    $("#prevPageButton").bind("click", getPrevPage); 
    $("#nextPageButton").bind("click", getNextPage); 
}
/**Carga la info en los inputs */
function load()
{
    loadCategorias();
    loadFechas();
    loadPagination();
}
/**Busca y carga las categorias en el select de jqueryui */
function loadCategorias()
{
    //$('#inputCategoria').selectmenu("option", "width", 100);
    
    // busco las categorias
    getCategorias(function(data){

        // cargo una lista de las categorias con el formato para el input
        data._embedded.classifications.forEach(categoria => {
            if(categoria.segment !== undefined)
            {
                $('#inputCategoria').append($('<option>').val(categoria.segment.id).text(categoria.segment.name))
            }
        });
    });
}
/**Carga las fechas disponibles en el select de jqueryui */
function loadFechas()
{
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    for(var mes=0; mes<12; mes++)
    {
        const fechaReferencia = moment().add(mes, 'month');

        const primerDia = fechaReferencia.startOf('month').format('yyyy-MM-DDTHH:mm:ss');
        const ultimoDia   = fechaReferencia.endOf('month').format('yyyy-MM-DDTHH:mm:ss');

        $('#inputFecha').append($('<option>').val(primerDia+','+ultimoDia).text(meses[fechaReferencia.month()] +' '+fechaReferencia.year()))
    }
}

/**Busca los eventos con los filtros elegidos */
function buscarEventos()
{
    // obtengo los parametros de busqueda
    const nombre = $('#inputNombre').val();
    const categoria = $('#inputCategoria').val();
    const fechas =  $('#inputFecha').val();

    // busco los eventos
    getEventos(nombre,categoria,fechas,loadEventos);
}
/**Carga los eventos encontrados en la pantalla */
function loadEventos(data)
{
    // guardo la pagina actual
    pageInfo = data.page;
    pagesController = data._links;
    pagesEvents = {};

    // limpio la información actual para insertar la nueva
    $("#cards").empty();

    // recorro la información obtenida y voy agregando las nuevas tarjetas
    data._embedded.events.forEach(evento => {
        // guardo el evento en un diccionario para utilizarlo luego en el historial
        pagesEvents[evento.id] = evento;

        // busco la imagen del tamaño minimo
        var imagen;
        evento.images.forEach(image => {
            if(image.width < 1024)
                imagen= image.url;
            return false;
        });

        // construyo el html de la tarjeta del evento
        var cardHTML = buildCard(evento.id, evento.name, imagen, evento._embedded.venues[0].city.name, evento.dates.start.localDate, evento.classifications[0].segment.name);
        $(cardHTML).appendTo($("#cards"));
    });

    //updateo la paginacion
    loadPagination();
}
/** Carga la info correspondiente en la barra de paginación */
function loadPagination(){
    // la primera vez que cargo la pantalla no tengo info
    if(pageInfo === undefined)
    {
        $('#prevPageButton').prop('disabled', true);
        $('#nextPageButton').prop('disabled', true);
        $('#infoPag').text("");
    }
    else
    {
        // si es la primera pagina, deshabilito el boton hacia atras, sino lo habilito
        $('#prevPageButton').prop('disabled', (pageInfo.number === 0));

        // si es la ultima pagina, deshabilito el boton hacia adelante, sino lo habilito
        $('#nextPageButton').prop('disabled', (pageInfo.number+1 === pageInfo.totalPages));

        // seteo los numero de pagina
        $('#infoPag').text("Pagina "+(pageInfo.number+1) +" de "+pageInfo.totalPages);
    }
}
/** Obtiene los resultados de la siguiente pagina */
function getNextPage()
{
    getByRef(pagesController.next.href, loadEventos);
}

/** Obtiene los resultados de la pagina anterior */
function getPrevPage()
{
    getByRef(pagesController.prev.href, loadEventos);
}

/** Abre el modal con el id de evento */
function openDetail(eventoid)
{
    //guardo el evento de grilla seleccionado para el historial
    sessionStorage.setItem(eventoid, JSON.stringify(pagesEvents[eventoid]));

    //voy a buscar detalles del evento
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