/* 
contact.js:
    -Contiene la logica de la pagina "Contacto"
*/


let myMap = L.map('myMap').setView([-34.922574, -57.956245], 13)   /* Especifico las coordenadas de la catedral */

const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'   /* Utilizo Openstreet maps como generador de tiles opensource */
L.tileLayer(tilesProvider, {
	maxZoom: 18,
}).addTo(myMap);

let marker = L.marker([-34.922574, -57.956245]).addTo(myMap)  /* Marcador por defecto de Leaflet */
marker.bindPopup("<b>AR-AM design!</b><br>Nuestra oficina se situa aquí.").openPopup();