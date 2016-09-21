//--------------GOOGLE MAPS-----------------
function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });

    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

    function placeMarkerAndPanTo(latLng, map) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        map.panTo(latLng);
    };

    var marker = new google.maps.Marker({
        position: {
            lat: 38.8315,
            lng: -77.3090
        },
        map: map
    });
    attachMessage(marker, "leftover chipotle");
}

function attachMessage(marker, message) {
    var infowindow = new google.maps.InfoWindow({
        content: message
    });

    marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
    });
}
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
            foodtype = $("#foodtype");
            foodtype.show();
            console.log(foodtype.data("food-id"));
        }
        else{
            if (currentlySelected == "Location"){
                hideIfOnPage("#foodtype");
                hideIfOnPage("#quantity");
                location = $("#location");
                location.show();
                console.log(location.data("loc-id"));
            }
            else{
                hideIfOnPage("#foodtype");
                hideIfOnPage("#location");
                quantity = $("#quantity");
                quantity.show();
                console.log(quantity.data("quan-id"));
            }
        }
    });

});

