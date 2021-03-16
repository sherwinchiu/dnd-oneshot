// Scroll Variables
var clicking = false;
var move = true;
var zoomIn = false;
var zoomOut = false;
var previousX;
var previousY;
// Onclick listeners for the buttons
$("#move").click(function(){
    move = true;
    zoomIn = false;
    zommOut = false;
});
$("#zoom-in").click(function(){
    move = false;
    zoomIn = true;
    zommOut = false;
});
$("#zoom-out").click(function(){
    move = false;
    zoomIn = false;
    zommOut = true;
});
// Scroll Controls (will probably have to implement other controlls in here as well)
$("#main-screen").mousedown(function(e) {
    e.preventDefault(); // mouse event
    if(move){
        previousX = e.clientX; // Get the mouse x
        previousY = e.clientY; // Get mouse y
        clicking = true; // since in main screen and click, clicking
    }
});
$(document).mouseup(function() {
    clicking = false; // if mouse isn't clicked, not clicking
});

$("#main-screen").mousemove(function(e) {
    if (clicking) { // if clicked down
        e.preventDefault(); // get mouse event
        $("#main-screen").scrollLeft($("#main-screen").scrollLeft() + (previousX - e.clientX)); // scroll left for however much the difference between onclick and drag is 
        $("#main-screen").scrollTop($("#main-screen").scrollTop() + (previousY - e.clientY)); // scroll top for however much the difference between onclick and drag is 
        previousX = e.clientX; //update previous x for smoother transition
        previousY = e.clientY; //update previous y for smoother transition
    }
});
$("#main-screen").mouseleave(function(e) {
    clicking = false; // if mouse isn't in screen, not clicking
});