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

    //hardcoded login validation.
    $("#loginbtn").click(function() {
        hideIfOnPage("#logsuccess");
        hideIfOnPage("#logfail");
        var uname = $("#uname");
        console.log(uname.val());
        if (uname.val() == "mboudrig" || uname.val() == "ssarhan2"){
            $("<div id='logsuccess'>Welcome Back!</div>").insertAfter("#chkbox");
        }
        else{
            $("<div id='logfail'>Access Denied.</div>").insertAfter("#chkbox");
        }
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

});

