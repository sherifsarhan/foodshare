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
$( document ).ready(function() {

  $("#loginbtn").click(function() {
    firebase.auth().signInWithEmailAndPassword($("#uname").val(), $("#pword").val())
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        })
        .then(function(authData) {
            document.getElementById('id01').style.display='none';

        });
  });

  $("#regbtn").click(function() {
    firebase.auth().createUserWithEmailAndPassword($("#unamer").val(), $("#pwordr").val())
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        })
        .then(function(authData) {
            document.getElementById('id02').style.display='none';
        });
  });



  //For the LOGIN FORM AND FOR HISTORY MANIPULATION
// Get the modal
  var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
  document.onclick = function(event) {
    //have the state ready for when the user wants to click back
    history.pushState(null, null, "login.html");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  window.addEventListener('popstate', function(e) {
    document.getElementById('id01').style.display = "none";
  });

  // Get the modal
  var modal2 = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
  document.onclick = function(event) {
    //have the state ready for when the user wants to click back
    history.pushState(null, null, "login.html");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  window.addEventListener('popstate', function(e) {
    document.getElementById('id02').style.display = "none";
  });

});
