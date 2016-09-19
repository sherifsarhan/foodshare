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
            $("<br /><br /><div id='logsuccess'>Welcome Back!</div>").insertAfter("#chkbox");
        }
        else{
            $("<br /><br /><div id='logfail'>Access Denied.</div>").insertAfter("#chkbox");
        }
    });

    //Forces the user to use a valid password before they are able to mvoe on.
    $("#pword").blur(function(){
        if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test($("#pword").val()))){
            alert("The password must be at least 6 characters long and contain a number.");
            $("#pword").focus();
        }
    });

});