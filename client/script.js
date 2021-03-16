// Scroll Variables
var clicking = false;
$("#move").css("background-color", "grey");
var zoom = 200;
var move = true;
var ping = false;
var previousX;
var previousY;
var d = new Date();
var n = d.getTime();
var timerBar = 0;
var timerHeight = 90.6;

// Onclick listeners for the buttons
$("#countdown-bar").click(function(){
    var timerInterval = window.setInterval(timer, 10);
});
    
function timer(){
    var d = new Date();
    if(d.getTime()-n  > 65 && timerBar <90.5){
        timerBar+=0.1;
        n = d.getTime();
        $("#countdown-bar").css("border-top-width", timerBar+"vh");
        $("#countdown-bar").css("height", timerHeight-timerBar+"vh");
    }
    if( timerBar< 90.5){
        timerInterval = 0;
    }
    
}
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
    zoom+=15;
    if(zoom>300){
        zoom= 300;
    }
    $("#map").css("zoom", zoom+"%");
});
$("#zoom-out").click(function(){
    zoom-=15;
    if(zoom<100){
        zoom =100;
    }
    $("#map").css("zoom", zoom+"%");
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