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

var selectedMarker;
var submitClicked = false;
var latLng;
var markers = {};
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
        selectedMarker = null;
        $('.foodInfo').val("");

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

        // selectedMarker = marker;
        prevMarker = marker;
    });
}

// adds a new marker to the map
function addMarker(latLng, map, text, key) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        id: count,
        text: text,
        key: key
    });

    // if(count) markers[count-1].key = key;

    count++;
    return marker;
}

foodshareRef.on('child_changed', function (data) {
    selectedMarker.infoWindowRef.setContent(data.val().food);
});

foodshareRef.on("child_added", function(data){
    myLatLng = {lat: data.val().lat, lng: data.val().lng};
    var tempMarker = addMarker(myLatLng, map, data.val().food, data.key);

    markers[count] = tempMarker;

    // // creates the info window for the marker
    var infoWindow = new google.maps.InfoWindow({
        content: data.val().food
    });

    //keep a reference of the marker's infowindow
    tempMarker.infoWindowRef = infoWindow;

    // open the infowindow to the corresponding marker
    infoWindow.open(tempMarker.get('map'), tempMarker);

    tempMarker.addListener('click', function () {
        // var marker = this;
        LatLng = tempMarker.position;
        $('#lat').text(LatLng.lat());
        $('#lng').text(LatLng.lng());
        $('.foodInfo').val(data.val().food);
        infoWindow.open(tempMarker.get('map'), tempMarker);
        selectedMarker = tempMarker;
        console.log(tempMarker.id);
    });

    $('.delFood').on('click', deleteMarker);
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
            var foodtype = $("#foodtype");
            foodtype.show();
            console.log(foodtype.data("food-id"));
        }
        else{
            if (currentlySelected == "Location"){
                hideIfOnPage("#foodtype");
                hideIfOnPage("#quantity");
                var location = $("#location");
                location.show();
                console.log(location.data("loc-id"));
            }
            else{
                hideIfOnPage("#foodtype");
                hideIfOnPage("#location");
                var quantity = $("#quantity");
                quantity.show();
                console.log(quantity.data("quan-id"));
            }
        }
    });

    $('.sbmtFood').on('click', function () {
        //if we are updating the text of a selected marker
        if (selectedMarker){
            for(key in markers) {
                if (key - 1 == selectedMarker.id) {
                    selectedMarker.text = $('.foodInfo').val();
                    //updates the foodshare's name in the database but doesn't update the infowindow yet until the page refreshes
                    foodshareRef.child(selectedMarker.key).set(
                        {'food' : selectedMarker.text,'lat' : selectedMarker.position.lat(), 'lng' : selectedMarker.position.lng()}
                    );
                }
            }
        }
        else{
            foodshareRef.push({'food' : $('.foodInfo').val(),'lat' : latLng.lat(), 'lng' : latLng.lng()});
        }

        submitClicked = true;
    });

    $('.delFood').on('click', deleteMarker);

    // // Sets the map on all markers in the array.
    // function setMapOnAll(map) {
    //     for (key in markers) {
    //         markers[key].setMap(map);
    //     }
    // }

});

function deleteMarker (){
    //delete the selectedMarker and redraw the map
    for(key in markers){
        if (key-1 == selectedMarker.id){
            // setMapOnAll(null);
            // setMapOnAll(map);
            foodshareRef.child(selectedMarker.key).remove();
            markers[key].setVisible(false);
            // markers[key]
            markers[key].setMap(null);
            markers[key] = null;
            delete markers[key];
            google.maps.event.trigger(map, 'resize');
            break;
        }
    }
}

