var clicking = false;
var previousX;
var previousY;

$("#main-screen").mousedown(function(e) {
    e.preventDefault();
    previousX = e.clientX;
    previousY = e.clientY;
    clicking = true;
});
$(document).mouseup(function() {
    clicking = false;
});

$("#main-screen").mousemove(function(e) {
    if (clicking) {
        e.preventDefault();
        $("#main-screen").scrollLeft($("#main-screen").scrollLeft() + (previousX - e.clientX));
        $("#main-screen").scrollTop($("#main-screen").scrollTop() + (previousY - e.clientY));
        previousX = e.clientX;
        previousY = e.clientY;
    }
});
$("#main-screen").mouseleave(function(e) {
    clicking = false;
});