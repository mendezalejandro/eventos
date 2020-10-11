
function buildCard(titulo, imagen, ciudad, fecha, categoria)
{
    var template = '<article class="card">'+
    '<div class="card-title">'+titulo+'</div>'+
    '<div class="card-image"></div>'+
    '<div class="card-description-container">'+
        '<div class="card-description">'+
          '<div class="card-info1">Ciudad: '+ciudad+'</div>'+
          '<div class="card-info2">Fecha: '+fecha+'</div>'+
          '<div class="card-info3">Categoria: '+categoria+'</div>'+
        '</div>'+
        '<div class="card-share"></div>'+
    '</div>'+
  '</article>';

  return template;
}