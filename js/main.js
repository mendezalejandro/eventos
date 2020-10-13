/* 
main.js:
    -Contiene la logica de la pagina principal
*/

/**Espero a que renderice el HTML */
$( document ).ready(function() {
    // asocio las funciones en los botones
    bind();
    load()
});
/**Asocia las funciones a los botones */
function bind()
{
    $("#searchButton").bind("click", buscarEventos); 
}
/**Carga la info en los inputs */
function load()
{
    loadCategorias();
    loadFechas();
}
/**Busca y carga las categorias en el select de jqueryui */
function loadCategorias()
{
    var categorias = [];
    // busco las categorias
    getCategorias(function(data){

        // cargo una lista de las categorias con el formato para el input
        data._embedded.classifications.forEach(categoria => {
            if(categoria.segment !== undefined)
            {
                categorias.push(categoria.segment.name);
            }
        });

        // cargo las categorias al input
        $("#inputCategoria").autocomplete({
            source: categorias
        });
    });
}
/**Carga las fechas disponibles en el select de jqueryui */
function loadFechas()
{
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var fechas = [];

    for(var mes=0; mes<12; mes++)
    {
        const fechaReferencia = moment().add(mes, 'month');

        const primerDia = fechaReferencia.startOf('month').format('yyyy-MM-DDTHH:mm:ss');
        const ultimoDia   = fechaReferencia.endOf('month').format('yyyy-MM-DDTHH:mm:ss');
        fechas.push({
            label: meses[fechaReferencia.month()] +' '+fechaReferencia.year(),
            value:{
                fechaDesde: primerDia,
                fechaHasta: ultimoDia
            }
        });
    }

    //localStartEndDateTime=2020-11-01T00:00:00,2020-11-01T00:00:00
    // cargo las categorias al input
    $("#inputFecha").autocomplete({
        source: fechas,
        focus: function( event, ui ) {
            event.preventDefault();
            $('#inputFecha').val(ui.item.label);
          },
        select: function( event, ui ) {
           event.preventDefault();
           $('#inputFecha').val(ui.item.label);
           
          }
    });
}

/**Busca los eventos con los filtros elegidos */
function buscarEventos()
{
    // obtengo los parametros de busqueda
    const nombre = $('#inputNombre').val();
    const categoria = $('#inputCategoria').val();
    const fechas =  $('#inputFecha').autocomplete( "option", "source" ).find(value => value.label === $('#inputFecha').val());
    const fecha = (fechas!==undefined ? fechas.value.fechaDesde+','+fechas.value.fechaHasta : '');

    // busco los eventos
    getEventos(nombre,categoria,fecha,loadEventos);
}
/**Carga los eventos encontrados en la pantalla */
function loadEventos(data)
{
    // limpio la información actual para insertar la nueva
    $("#cards").empty();

    // recorro la información obtenida y voy agregando las nuevas tarjetas
    data._embedded.events.forEach(evento => {
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

function getNextPage(url)
{
    getByRef(url, getNextResults);
}
function getNextResults(data)
{
    console.log(data);
}

/**Construye un tarjeta html que contiene la info de un evento */
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