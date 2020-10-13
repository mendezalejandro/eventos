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

/* 
share.js:
    -Contiene la logica de la pagina "Compartir"
*/



// creamos la funcion
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
            // mostrara el mesaje que debe ingresar un nombre válido
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
            // mostrara el mesaje que debe ingresar un nombre válido
            cambiarColor("correo_D");
            mostraAlerta("Por favor ingrese un correo válido");
            return false;
        }
    }

    // validamos el asunto
    if(asunto=="" || asunto==null){

        cambiarColor("asunto");
        // mostramos le mensaje de alerta
        mostraAlerta("Campo obligatorio");
        return false;
    }else{
        var expresion= /^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]*$/;
        if(!expresion.test(asunto)){
            // mostrara el mesaje que debe ingresar un nombre válido
            cambiarColor("asunto");
            mostraAlerta("No se permiten caracteres especiales");
            return false;
        }
    }

     // validamos el mensaje
     if(mensaje=="" || mensaje==null){

        cambiarColor("mensaje");
        // mostramos le mensaje de alerta
        mostraAlerta("Campo obligatorio");
        return false;
    }else{
        var expresion= /^[,\\.\\a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]*$/;
        if(!expresion.test(mensaje)){
            // mostrara el mesaje que debe ingresar un nombre válido
            cambiarColor("mensaje");
            mostraAlerta("No se permiten caracteres especiales");
            return false;
        }
    }

    $('form').submit();
    return true;
    
} 

$('input').focus(function(){
    $('.alert').remove();
    
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
        border: "1px solid #dd5144"
    });
}

// funcion para mostrar la alerta

function mostraAlerta(texto){
    $('#correo_E').before('<div class="alert">Error: '+ texto +'</div>');
}
