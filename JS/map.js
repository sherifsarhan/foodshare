require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Locate",
    "dojo/domReady!"
], function(Map, MapView, Locate) {

    var map = new Map({
        basemap: "topo"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 5,
        center: [-99, 36]
    });

    var locateBtn = new Locate({
        view: view
    });
    locateBtn.startup();

    // Add the locate widget to the top left corner of the view
    view.ui.add(locateBtn, {
        position: "top-left",
        index: 0
    });

});
