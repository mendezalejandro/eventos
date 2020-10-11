/**Busca eventos por una serie de filtros opcionales, ademas recibe la funcion que recibe los datos y otra en caso de error */
function getEventos(nombre, categoria, fecha, onSuccess, onFail)
{
    //preparo los parametros de busqueda
    var params = 'events.json?';
    if(nombre!=='') params+='keyword='+nombre;
    if(categoria!=='') params+='&segmentName='+categoria;
    if(fecha!=='') params+='&startDateTime='+fecha; //2020-11-21T00:00:00Z

    // hago un filtro general por pais españa y max de 25 items, para acortar un poco la busqueda
    params+='&countryCode=ES&size=9&';

    //ejecuto el request
    get(params, onSuccess, onFail);
}

/**Busca el detalle de un evento especifico por su ID, ademas recibe la funcion que recibe los datos y otra en caso de error */
function getEventoDetalle(id, onSuccess, onFail)
{
    //preparo los parametros de busqueda
    var params = 'events/'+id+'.json?';

    //ejecuto el request
    get(params, onSuccess, onFail);
}

/**Funcion que se utiliza como helper para realizar las peticiones en base a una url construida*/
function get(params, onSuccess, onFail)
{
    const url = ENVIROMENT.API_URL+ ENVIROMENT.API_TAG+ params +'apikey='+ENVIROMENT.API_TOKEN
    requestHelper(url, onSuccess,onFail);
}

/**Funcion que se utiliza como helper para realizar las peticiones en base a una url especifica que es retornada en el json de la api (paginacion)*/
function getByRef(ref, onSuccess, onFail)
{
    const url = ENVIROMENT.API_URL+ ref +'&apikey='+ENVIROMENT.API_TOKEN
    requestHelper(url, onSuccess,onFail);
}

/**Funcion que se utiliza como helper para realizar las peticiones a partir de una url especifica*/
function requestHelper(url, onSuccess, onFail)
{
    $.ajax({
        type:"GET",
        url:url,
        async:true,
        dataType: "json",
        success:onSuccess,
        error: onFail
      });
}