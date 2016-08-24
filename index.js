"use strict";

/* Preparación de Mapa */
const mapa = L.map("map").setView([43.45, -3.7944], 13);

/* Base */
let url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
//let url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
L.tileLayer(url, {
    attribution: 'OSM & Carto',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mapa);


/* Capas animadas */
d3.json("data/grid_BAHIA.json", function (d) {
    let cv = CampoVectorial.desdeJson(d);

    // 0. Grid base
    L.capaPuntos(cv.mallaLonLatUV()); //.addTo(mapa);

    // 1. Básica
    L.capaVectorAnimado(cv); //.addTo(mapa);

    // 2. Cambio de color
    L.capaVectorAnimado(cv, {
        color: "green"
    }); //.addTo(mapa);

    // 3. Más parámetros personalizados
    L.capaVectorAnimado(cv, {
        tr
        trayectorias: 150,
            duracion: 10,
            edadMaxima: 200,
            color: "#FF6699",
            grosor: 8
    }); // .addTo(mapa);

    // 4. Capa con color por velocidad y leyenda asociada
    var m = MapaColor.paraCorrientes([0, 1.1]);
    let capa4 = new L.CapaVectorAnimado(cv, {
        color: m.escala
    });
    //capa4.addTo(mapa);

    L.Control.leyendaEscalaColor(m).addTo(mapa);

    // 6. Identificación con click
    capa4.on('click_vector', function (e) {
        if (e.vector) {
            let v = e.vector.longitud().toFixed(3);
            //let html = (`Velocidad: ${v} m/s <br\> @${e.latlng}`);
            let html = (`${v} m/s`);
            let popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(html)
                .openOn(mapa);
        }
    });

    //mapa.fitBounds(capa4.getBounds());
});
