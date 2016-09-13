//--------------JS FUNCTIONS-----------------
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
        hideIfOnPage("#logsuccess");
        hideIfOnPage("#logfail");
        var uname = $("#uname");
        if (uname.text() == "mboudrig" || uname.text() == "ssarhan2"){
            $("<br /><br /><div id='logsuccess'>Welcome Back!</div>").insertAfter("#chkbox");
        }
        else{
            $("<br /><br /><div id='logfail'>Access Denied.</div>").insertAfter("#chkbox");
        }
    });

});