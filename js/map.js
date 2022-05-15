const mapID = document.getElementById('map');
if (mapID) {
    var cities = L.layerGroup();

    L.marker([39.61, -105.02]).bindPopup('David Villa.').addTo(cities),
        L.marker([39.74, -104.99]).bindPopup('Lisa Urban House').addTo(cities),
        L.marker([39.73, -104.8]).bindPopup('75A Cera Resident').addTo(cities),
        L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);

    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
        streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

    var map = L.map('map', {
        center: [39.73, -104.99],
        zoom: 11,
        layers: [grayscale, cities]
    });

    var baseLayers = {
        "Grayscale": grayscale,
        "Streets": streets
    };

    var overlays = {
        "Cities": cities
    };

    L.control.layers(baseLayers, overlays).addTo(map);
}

// single property map
const singleMapID = document.getElementById('single-map');
if (singleMapID) {
    var mymap = L.map(singleMapID).setView([51.505, -0.09], 14);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
    L.marker([51.5, -0.09]).addTo(mymap)
        .bindPopup("Santorina Blue Homestay").openPopup();

}
