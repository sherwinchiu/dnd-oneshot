// Scroll Variables
var clicking = false;
$("#move").css("background-color", "grey");
var scale = 1.5;
var move = true;
var ping = false;
var previousX;
var previousY;
// Onclick listeners for the buttons
$("#move").click(function(){
    if(!move){
        $("#move").css("background-color", "grey");
        move = true;
    } else{
        $("#move").css("background-color", "white");
        move = false;
    }
});
$("#zoom-in").click(function(){
    scale+=0.1;
    $("#map").css("transform", "scale("+scale+")");
});
$("#zoom-out").click(function(){
    scale-=0.1;
    if(scale<1){
        scale =1;
    }
    $("#map").css("transform", "scale("+scale+")");
});
function modifyOptions(){}
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