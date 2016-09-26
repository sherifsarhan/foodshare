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

var submitClicked = false;
var latLng;
var markers = [];
var infoWindows = [];
var map;
var count=0;
//--------------GOOGLE MAPS-----------------
function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });

    var prevMarker;
    var firstRun = true;
    map.addListener('click', function(e) {
        $('#infoDiv').show();

        if(!submitClicked && !firstRun){
            prevMarker.setMap(null);
            count--;
        }
        submitClicked = false;
        firstRun = false;

        latLng = e.latLng;
        var marker = addMarker(latLng, map, "");
        console.log(marker.id);
        console.log(marker.text);
        $('#lat').text(latLng.lat());
        $('#lng').text(latLng.lng());

        prevMarker = marker;

        // marker.addListener('click', function () {
        //     // open the infowindow for the corresponding marker
        //     infoWindow.open(marker.get('map'), marker);
        // });
    });

    // adds a new marker to the map
    function addMarker(latLng, map, text) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            id: count,
            text: text
        });

        count++;
        return marker;
    }

    foodshareRef.on("child_added", function(data){
        myLatLng = {lat: data.val().lat, lng: data.val().lng};
        var tempMarker = addMarker(myLatLng, map, data.val().food);

        // // creates the info window for the marker
        var infoWindow = new google.maps.InfoWindow({
            content: data.val().food
        });
        // open the infowindow to the corresponding marker
        infoWindow.open(tempMarker.get('map'), tempMarker);

        tempMarker.addListener('click', function () {
            // var marker = this;
            LatLng = tempMarker.position;
            $('#lat').text(LatLng.lat());
            $('#lng').text(LatLng.lng());
            $('.foodInfo').val(data.val().food);
            infoWindow.open(tempMarker.get('map'), tempMarker);
            console.log(tempMarker.id);
        });

    });



    google.maps.event.addDomListener(window, "load", initMap);
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
    $('#infoDiv').hide();

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

    $('.sbmtFood').on('click', function () {
        foodshareRef.push({'food' : $('.foodInfo').val(),'lat' : latLng.lat(), 'lng' : latLng.lng()});

        submitClicked = true;
    });

});

