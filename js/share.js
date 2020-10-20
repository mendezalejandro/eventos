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

    /* Llamo a la funcion que trae la info del evento */
    openDetail(eventoID);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var infoEventCard;

/**Espero a que renderice el HTML */
$( document ).ready(function() {
    
    infoEventCard = document.getElementById("infoCard");
});


 // Muestro el evento seleccionado dentro de la pagina del formulario

function openDetail(eventoid)
{

    //voy a buscar detalles del evento
    getEventoDetalle(eventoid, loadDetail);
}


/** Busca y carga el detalle del evento */
function loadDetail(data)
{
    // busco la imagen del tamaño minimo
    var imagen;
    data.images.forEach(image => {
        if(image.width < 480)
            imagen= image.url;
        return false;
    });

    // cargo el titulo 
    $('.infoEventCard-header').html("<h2>"+data.name+"</h2>");

    // cargo la info del evento
    var eventInfo =    
      
      '<div class="infoImg"><img src="'+imagen+'"></div>'+

      '<div class="infoTitle"><h3>Clasificación</h3></div>'+
      '<div class="infoData"><p>'+data.classifications[0].genre.name+', '+data.classifications[0].segment.name+', '+data.classifications[0].subGenre.name+', '+'</p></div>'+      

      (data.info!==undefined ? 
        '<div class="infoTitle"><h3>Info</h3></div>'+
        '<div class="infoData"><p>'+data.info+'</p></div>'
        :'') 
      ;
    $('.infoEventCard-body').html(eventInfo);

    infoEventCard.style.display = "block";
}

// ------ VALIDACIONES -----------------------
//-------------------------------------------------------------------------------------------------------------


// creamos la funcion para validar el formulario
function validarFormulario(){
    // removemos el div con la clase alert
    $('.alert').remove();


    // declarion de variables
    var asunto=$('#asunto').val(),
        correo_D=$('#correo_D').val(),
        correo_E=$('#correo_E').val(),
        mensaje=$('#mensaje').val();

    // validamos el correo emisor
    if(correo_E=="" || correo_E==null){

        cambiarColor("correo_E");
        // mostramos le mensaje de alerta
        mostraAlerta("Campo obligatorio");
        return false;
    }else{
        var expresion= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if(!expresion.test(correo_E)){
            // muestra el mesaje que debe ingresar un nombre válido
            cambiarColor("correo_E");
            mostraAlerta("Por favor ingrese un correo válido");
            return false;
        }
    }
    

    // validamos el correo destino
    if(correo_D=="" || correo_D==null){

        cambiarColor("correo_D");
        // mostramos le mensaje de alerta
        mostraAlerta("Campo obligatorio");
        return false;
    }else{
        var expresion= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if(!expresion.test(correo_D)){
            // muestra el mesaje que debe ingresar un correo válido
            cambiarColor("correo_D");
            mostraAlerta("Por favor ingrese un correo válido");
            return false;
        }
    }

    // valido el asunto
    if(asunto=="" || asunto==null){
        cambiarColor("asunto");
        // mostramos le mensaje de alerta
        mostraAlerta("Campo obligatorio");
        return false;
    }else{
        var expresion= /^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]*$/;
        if(!expresion.test(asunto)){
            // mostrara el mesaje que debe ingresar un texto válido en el asunto
            cambiarColor("asunto");
            mostraAlerta("No se permiten caracteres especiales");
            return false;
        }
    }

    return true;
    
} 

$('input').focus(function(){
    $('.alert').remove();
    colorDefault('correo_E');
    colorDefault('correo_D');
    colorDefault('asunto');
});

$('textarea').focus(function(){
    $('.alert').remove();
    colorDefault('mensaje');
});

// creamos un funcion de color por defecto a los bordes de los inputs
function colorDefault(dato){
    $('#' + dato).css({
        border: "1px solid #999"
    });
}

// creamos una funcio para cambiar de color a su bordes de los input
function cambiarColor(dato){
    $('#' + dato).css({
        border: "3px solid #dd5144"
    });
}

function mostraAlerta(texto){
    $('#').before('<div class="alert">Error: '+ texto +'</div>');
    
}


// funcion para mostrar alerta boton Cancelar

function alertaCancelar() {

    var mensaje;
	var opcion = confirm("¿Desea volver a la pagina anterior?");
	
    if (opcion == true) {
		history.go(-1)
		
	} else {
		mensaje = "Has clickeado Cancelar";
	}
}

// Funcion enviar mail, obtiene el mail destino, asunto y mensaje ingresado en el formulario.


function sendMail() {
    var link = "mailto:" + encodeURIComponent(document.getElementById('correo_D').value)
             + "?cc=" 
             + "&subject=" + encodeURIComponent(document.getElementById('asunto').value)
             + "&body=" + encodeURIComponent(document.getElementById('mensaje').value)
    ;
    
    window.location.href = link;
}