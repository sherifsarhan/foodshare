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
var foodCountDB = 12;
foodshareRef.once("value")
    .then(function(snapshot) {
        foodCountDB = snapshot.numChildren(); // 1 ("name")
    });

var uid = "";
//get user info if they're signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        uid = user.uid;
        signedIn = true;
    } else {
        // No user is signed in.
    }
});

var foodList;
var selectedMarker;
var submitClicked = false;
var latLng;
var markers = {};
var map;
var count=0;
var pointerMarker;
//--------------GOOGLE MAPS-----------------
function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });

    // every time the map is clicked on,
    // a pin is dropped and the previous pin is removed
    var prevMarker;
    var firstRun = true;
    map.addListener('click', function(e) {
        // clear the food input box if the user clicked on the map
        // after clicking on a pre-existing pin that populated the food
        // input box with text
        if (selectedMarker){
            // $('.foodInfo').val("");
            foodList.updateInput("","");
        }

        // indicate that the last item to be selected
        // is not a pre-existing pin, rather, just a temporary
        // pin on the map while deciding where to place a foodshare
        selectedMarker = null;

        // hides the previously clicked marker as long as there
        // wasn't a recently submitted foodshare. There would need
        // to be a brand new pin added to the map.
        if(!submitClicked && !firstRun){
            prevMarker.setMap(null);
            prevMarker = null;
            count--;
        }
        submitClicked = false;
        firstRun = false;

        // get the position of the click
        // and add a new pin theres
        latLng = e.latLng;
        var marker = addMarker(latLng, map, "");
        pointerMarker = marker;

        // update the previous marker pointer
        prevMarker = marker;
    });
}

// adds a new marker to the map
function addMarker(latLng, map, text, key, uidDB) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        id: count,
        text: text,
        key: key,
        uid: uidDB
    });

    count++;
    return marker;
}

foodshareRef.on('child_changed', function(data) {
    selectedMarker.infoWindowRef.setContent(data.val().food);
});

//if a foodshare gets deleted from the firebase db
foodshareRef.on('child_removed', function(data) {
    for(marker in markers){
        if(markers[marker].key == data.key){
            markers[marker].setMap(null);
            markers[marker] = null;
            delete markers[marker];
            break;
        }
    }
});


var tags = {};
var foodCount = 0;
foodshareRef.on("child_added", function(data){

    foodCount++;
    if(foodCount == foodCountDB){
        visualizeData();
    }

    //get coordinates
    myLatLng = {lat: data.val().lat, lng: data.val().lng};

    var tempMarker = addMarker(myLatLng, map, data.val().food, data.key, data.val().uid);

    if ($.trim(data.val().tag).length === 0){
        // string is invalid
        data.val().tag = "Unknown";
    }
    if(tags.hasOwnProperty(data.val().tag)){
        tags[data.val().tag]++;
    }
    else{
        tags[data.val().tag] = 1;
    }

    markers[count] = tempMarker;

    // // creates the info window for the marker
    var infoWindow = new google.maps.InfoWindow({
        content: data.val().food
    });

    //keep a reference of the marker's infowindow
    tempMarker.infoWindowRef = infoWindow;

    // open the infowindow to the corresponding marker
    infoWindow.open(tempMarker.get('map'), tempMarker);

    selectedMarker = tempMarker;

    tempMarker.addListener('click', function () {
        // var marker = this;
        LatLng = tempMarker.position;
        foodList.updateInput(data.val().food, data.val().tag);

        infoWindow.open(tempMarker.get('map'), tempMarker);
        selectedMarker = tempMarker;
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
});

function deleteMarker (){
    // $('.foodInfo').val("");
    foodList.updateInput("", "");

    //delete the selectedMarker and redraw the map
    for(marker in markers){
        if (marker-1 == selectedMarker.id){
            foodshareRef.child(selectedMarker.key).remove();
            return selectedMarker.text;
        }
    }
}


//---------functions to be used by react visuals-----
function addUpdateMarker(text, tag) {
    var markerText = text;

    //if we are updating the text of a selected marker
    if (selectedMarker){
        for(key in markers) {
            if (key - 1 == selectedMarker.id) {
                selectedMarker.text = markerText;
                //updates the foodshare's name in the database but doesn't update the infowindow yet until the page refreshes
                foodshareRef.child(selectedMarker.key).set({
                    'food': selectedMarker.text,
                    'lat' : selectedMarker.position.lat(),
                    'lng' : selectedMarker.position.lng(),
                    'uid' : selectedMarker.uid,
                    'tag' : selectedMarker.tag
                });
                return;
            }
        }
    }
    else if(pointerMarker != null) {
        pointerMarker.setMap(null);
        pointerMarker = null;
        selectedMarker = null;
    }
    foodshareRef.push({
        'food': markerText,
        'lat' : latLng.lat(),
        'lng' : latLng.lng(),
        'uid' : uid,
        'tag' : tag
    });
    submitClicked = true;
}

function getFoodList(render){
    foodList = render;
}

function checkLoggedIn(){
    return uid;
}



//VISUALIZATION STUFF
//To do: Grab some data to represent from google maps and place in here (doesnt have to be "starts with A... and so on)
// var piedata = [
//   { val: 'Starts with A',  count: 100 },
//   { val: 'Starts with B',  count: 17 },
//   { val: 'Starts with C',  count: 10 },
// ];
//
// //initilizing pie chart through d3 built-ins and feed it some data
// var piechart = d3.layout.pie().value(function(dat) {return dat.count});
// var vals = piechart(piedata);
//
// //size of the pie chart
// var piesize = d3.svg.arc().innerRadius(50).outerRadius(100);
//
// //link to div
// var svg = d3.select('svg.pie');
//
// //d3 color generator
// var colorgen = d3.scale.category10();
//
// //position of pie chart
// var g = svg.append('g').attr('transform', 'translate(300, 100)');
//
// //set up pie chart & legend
// g.selectAll('path.slice').data(vals).enter().append('path').attr('class', 'slice').attr('d', piesize).attr('fill', function(dat) {
//     return colorgen(dat.data.val);
// });
// svg.append('g').attr('class', 'legend').selectAll('text').data(vals).enter().append('text').text(function(dat) {return dat.data.val + ' #:' + dat.data.count;})
//     .attr('fill', function(dat) {return colorgen(dat.data.val);}).attr('y', function(dat, n) {return 40 * (n + 1);});


function visualizeData(){
    var tagsD3 = [];
    for (tag in tags){
        if (tags.hasOwnProperty(tag)){
            tagsD3.push({val:tag, count:tags[tag]});
        }
    }
    //initilizing pie chart through d3 built-ins and feed it some data
    var piechart = d3.layout.pie().value(function(dat) {return dat.count});
    var vals = piechart(tagsD3);

//size of the pie chart
    var piesize = d3.svg.arc().innerRadius(50).outerRadius(100);

//link to div
    var svg = d3.select('svg.pie');

//d3 color generator
    var colorgen = d3.scale.category10();

//position of pie chart
    var g = svg.append('g').attr('transform', 'translate(300, 100)');

//set up pie chart & legend
    g.selectAll('path.slice').data(vals).enter().append('path').attr('class', 'slice').attr('d', piesize).attr('fill', function(dat) {
        return colorgen(dat.data.val);
    });
    svg.append('g').attr('class', 'legend').selectAll('text').data(vals).enter().append('text').text(function(dat) {return dat.data.val + ' #:' + dat.data.count;})
        .attr('fill', function(dat) {return colorgen(dat.data.val);}).attr('y', function(dat, n) {return 25 * (n + 1);});
}

