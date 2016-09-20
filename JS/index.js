$(document).ready(function (e) {

    function showView(viewName) {
        $('.view').hide();
        $('#' + viewName).show();
    }

    $('[data-launch-view]').click(function (e) {
        e.preventDefault();
        var viewName = $(this).attr('data-launch-view');
        showView(viewName);
    });

});