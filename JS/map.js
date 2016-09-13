//---------------ARCGIS API------------------
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

//--------------JS FUNCTIONS-----------------

//Accepts an ID, if it can locate the ID on the oage it will be hidden.
function hideIfOnPage(hideID) {
    if ($(hideID).length){
        ($(hideID)).hide();
        return true;
    }
    return false;
}

//-------------DOCUMENT READY----------------
$( document ).ready(function() {

    $("#mapselect").change(function() {
        var currentlySelected = $('#mapselect').find(":selected").text();
        if (currentlySelected == "Food Type"){
            hideIfOnPage("#location");
            hideIfOnPage("#quantity");
            $("<div id='foodtype'>Food Type was selected</div>").insertAfter("#mapselect");
        }
        else{
            if (currentlySelected == "Location"){
                hideIfOnPage("#foodtype");
                hideIfOnPage("#quantity");
                $("<div id='location'>Location was selected</div>").insertAfter("#mapselect");
            }
            else{
                hideIfOnPage("#foodtype");
                hideIfOnPage("#location");
                $("<div id='quantity'>Quantity was selected</div>").insertAfter("#mapselect");
            }
        }
    });

});