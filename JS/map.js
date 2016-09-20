//--------------GOOGLE MAPS-----------------
function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });
}

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