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

//Takes an ID, hides it if its currently on the page, returns bool on what happened.
function hideIfOnPage(hideID) {
    if ($(hideID).length){
        ($(hideID)).hide();
        return true;
    }
    return false;
}



//-------------DOCUMENT READY----------------
$(document).ready(function() {

    //Initially hides the elements which will be toggled by the select
    hideIfOnPage("#location");
    hideIfOnPage("#quantity");
    hideIfOnPage("#foodtype");

    //when the select changes display the desired div and hide any that are currently showing.
    $("#mapselect").change(function() {
        var currentlySelected = $('#mapselect').find(":selected").text();
        if (currentlySelected == "Food Type"){
            hideIfOnPage("#location");
            hideIfOnPage("#quantity");
            $("#foodtype").show();
        }
        else{
            if (currentlySelected == "Location"){
                hideIfOnPage("#foodtype");
                hideIfOnPage("#quantity");
                $("#location").show();
            }
            else{
                hideIfOnPage("#foodtype");
                hideIfOnPage("#location");
                $("#quantity").show();
            }
        }
    });

});

