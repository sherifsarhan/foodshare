//--------------FIREBASE-----------------
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCtdy0Gf8tNWQC4bS6QcnH3X-vknhfY3R8",
    authDomain: "foodshare-1474316972332.firebaseapp.com",
    databaseURL: "https://foodshare-1474316972332.firebaseio.com",
    storageBucket: "foodshare-1474316972332.appspot.com",
    messagingSenderId: "151948214475"
};
firebase.initializeApp(config);

var foodshareRef = firebase.database().ref("foodshare");

//--------------GOOGLE MAPS-----------------
var submitClicked = false;
function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });

    var markers = [];
    var prevMarker;
    var firstRun = true;
    map.addListener('click', function(e) {
        if(!submitClicked && !firstRun){
            prevMarker.setMap(null);
        }
        submitClicked = false;
        firstRun = false;

        var latLng = e.latLng;
        var marker = addMarker(latLng, map);
        // foodshareRef.push({'lat' : latLng.lat(), 'lng' : latLng.lng()});

        prevMarker = marker;
    });

    // adds a new marker to the map
    function addMarker(latLng, map) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });

        // creates the info window for the marker
        var infowindow = new google.maps.InfoWindow({
            // content: '<div contentEditable="true">Add food info</div>'
            content:
            '<div class="infoClass">' +
            '<input type="text" placeholder="Enter food info" required>' +
            '<button onclick="submitAction()" class="sbmtFood" type="submit">Submit</button>' +
            '</div>'
        });

        // open the infowindow when a marker is added to the map
        infowindow.open(marker.get('map'), marker);

        // shows the info window if a marker gets clicked
        marker.addListener('click', function() {
            infowindow.open(marker.get('map'), marker);
        });
        return marker;
    }
    google.maps.event.addDomListener(window, "load", initMap);
}

function submitAction() {
    submitClicked = true;
}

function attachMessage(marker, message) {
    var infowindow = new google.maps.InfoWindow({
        content: message
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

