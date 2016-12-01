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
foodshareRef.on("value", function(snapshot) {
        map.setCenter(pos);
        visualizeData();
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
        uid = null;
        signedIn = false;
    }
});

var markers = {};
var markersTest = {};
var map;
var count=0;
var pos;
//--------------GOOGLE MAPS-----------------
/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates);
    } else {
        alert("4");
    }
}

function getCoordinates(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}

function HelperAdd(helperAddDiv){
    var helperAddText = document.createElement('div');
    helperAddText.innerHTML = '<b>Add a new foodshare</b>';
    helperAddText.style.fontFamily = 'Roboto,Arial,sans-serif';
    helperAddText.style.fontSize = '20px';
    helperAddText.style.lineHeight = '38px';
    helperAddDiv.appendChild(helperAddText);
}

function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to current coordinates.
    controlUI.addEventListener('click', function() {
        getLocation();
        map.setCenter(pos);
        var mev = {
            stop: null,
            latLng: new google.maps.LatLng(pos.lat, pos.lng)
        };
        google.maps.event.trigger(map, 'click', mev);
    });
}

function AddBtn(addBtnDiv){
    var addBtnUI = document.createElement('div');
    addBtnUI.innerHTML = "<button id='addFoodshareMapBtn' class='btn-floating btn-large waves-effect waves-light light-green accent-4'><i class='material-icons'>add</i></button>";
    addBtnDiv.appendChild(addBtnUI);

    addBtnUI.addEventListener('click', function (){
        $('#modalAddFood').openModal();
    });
}

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: 38.8320, lng: -77.3116},
        zoom: 16
    });
    directionsDisplay.setMap(map);

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var helperAddDiv = document.createElement('div');
    helperAddDiv.className = 'empty3';
    var helperAdd = new HelperAdd(helperAddDiv);
    helperAddDiv.index = 0;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(helperAddDiv);

    var centerControlDiv = document.createElement('div');
    centerControlDiv.className = 'empty2';
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 2;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

    var addBtnDiv = document.createElement('div');
    addBtnDiv.className = 'empty';
    var addBtn = new AddBtn(addBtnDiv);
    addBtnDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(addBtnDiv);
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

//if a foodshare gets deleted from the firebase db
foodshareRef.on('child_removed', function(data) {
//    TEST MARKER AREA
    markersTest[data.key].setMap(null);
    markersTest[data.key] = null;
    delete markersTest[data.key];
});


var tags = {};
foodshareRef.on("child_added", function(data){
    if(!data.val().lat || !data.val().lng) return;

    //counting tags for visualization
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

    //get coordinates
    myLatLng = {lat: data.val().lat, lng: data.val().lng};
    map.setCenter(new google.maps.LatLng(data.val().lat, data.val().lng));

    var tempMarker = addMarker(myLatLng, map, data.val().food, data.key, data.val().uid);

    markers[count] = tempMarker;
    markersTest[data.key] = tempMarker;
    markersTest[data.key].lat = myLatLng.lat;
    markersTest[data.key].lng = myLatLng.lng;

    // // creates the info window for the marker
    var infoWindow = new google.maps.InfoWindow({
        content: data.val().food,
        disableAutoPan: true
    });

    //keep a reference of the marker's infowindow
    tempMarker.infoWindowRef = infoWindow;

    // open the infowindow to the corresponding marker
    infoWindow.open(tempMarker.get('map'), tempMarker);

    tempMarker.addListener('click', function () {
        infoWindow.open(tempMarker.get('map'), tempMarker);
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

    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();

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

//---------functions to be used by react visuals-----
function addUpdateMarker(text, desc, tag, img) {
    if(desc == null) desc = "User has not posted a description";

    var markerText = text;
    var markerDesc = desc;
    var markerTag = tag;

    var formData = new FormData();
    if(img) formData.append('img', img, img.name);
    formData.append('food',markerText);
    formData.append('desc', markerDesc);
    formData.append('lat',pos.lat);
    formData.append('lng',pos.lng);
    formData.append('uid',uid);
    formData.append('tag',markerTag);

    // console.log(formData);
    $.ajax({
        url: "/foodAdd",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false
    });

    $('#modalAddFood').closeModal();
    Materialize.toast('Foodshare added!', 3000, 'rounded')
}

function checkLoggedIn(){
    return uid;
}



//VISUALIZATION STUFF
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
    svg.append('g').attr('class', 'legend').selectAll('text').data(vals).enter().append('text').text(function(dat) {return '# of ' + dat.data.val + ': ' + dat.data.count;})
        .attr('fill', function(dat) {return colorgen(dat.data.val);}).attr('y', function(dat, n) {return 25 * (n + 1);});
}

