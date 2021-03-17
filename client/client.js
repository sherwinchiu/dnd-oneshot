/**
 * @fileoverview client side JS
 */
// Scroll Variables
var clicking = false;
$("#move").css("background-color", "grey");
var zoom = 220;
const mapLimits = [70, 70, 55]; 
var move = true;
var ping = false;
var previousX;
var previousY;
var d = new Date();
var n = d.getTime();
var timerBar = 0;
var timerHeight = 90.6;
var gridToggle = true;
var playerX = 0;
var playerY = 0;
const grid = 70;
// Onclick listeners for the buttons
const socket = io.connect();
var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var playerXs = [0, 0, 0, 0, 0, 0];
var playerYs = [0, 0, 0, 0, 0, 0];
var player = prompt("Please enter your name, etc. (James, Nicolas, Glen, Lilah, Sasha)");

// Function functions
function drawGrid(x, y) {
    for (var rows = 0; rows < y; rows++) {
        for (var columns = 0; columns < x; columns++) {
            $("#main-screen").append("<div style='left:"+70*columns+"px; top:"+70*rows+"px;' class='grid'></div>");
        };
    };
    $(".grid").width("70px");
    $(".grid").height("70px");
};
drawGrid(30, 30);

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
function updateW(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]-=grid;
            $("#"+players[i]).css("top", playerYs[i]);
        }
    }
}
function updateA(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]-=grid;
            $("#"+players[i]).css("left", playerXs[i]);
        }
    }
}
function updateS(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]+=grid;
            $("#"+players[i]).css("top", playerYs[i]);
        }
    }
}
function updateD(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]+=grid;
            $("#"+players[i]).css("left", playerXs[i]);
        }
    }
}
function updatePlayers(){
    for(var i = 0; i < players.length; i++){
        $("#"+players[i]).css("left", playerXs[i]);
        $("#"+players[i]).css("top", playerYs[i]);
    }
}
 // Server Connection Stuff
socket.emit("player", player);
socket.on("hello", function(){
    socket.emit("hi", player);
});
socket.on("positionX", function(X){
    playerXs = X;
    updatePlayers();
});
socket.on("positionY", function(Y){
    playerYs = Y;
    updatePlayers();
});
socket.on('player-online', function(msg) {
    $(".player-tab")[parseInt(msg)].style.backgroundColor = "green";
});
socket.on('player-offline', function(msg){
    $(".player-tab")[parseInt(msg)].style.backgroundColor = "red";
});
// Player location listeners
socket.on("W", function(msg){
    updateW(msg);
});
socket.on("A", function(msg){
    updateA(msg);
});
socket.on("S", function(msg){
    updateS(msg);
});
socket.on("D", function(msg){
    updateD(msg);
});

// Keylisteners for players
document.addEventListener('keyup', function(e){
    if(e.code === 'KeyW'){
        playerY-=grid;
        socket.emit("W", player);
        //$("#"+player).css("top", playerY+"px");
    } else if(e.code ==='KeyA'){
        playerX-=grid;
        socket.emit("A", player);
       // $("#"+player).css("left", playerX+"px");
    } else if(e.code ==='KeyS'){
        playerY+=grid;
        socket.emit("S", player);
       // $("#"+player).css("top", playerY+"px");
    } else if(e.code ==='KeyD'){
        playerX+=grid;
        socket.emit("D", player);
       // $("#"+player).css("left", playerX+"px");
    }
});
$("#countdown-bar").click(function(){
    var timerInterval = window.setInterval(timer, 10);
});
$("#grid-toggle").click(function(){
    if(gridToggle){
        gridToggle = false;
        $(".grid").css("display", "none");
    } else{
        gridToggle = true;
        $(".grid").css("display", "block");
    }
})

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
    if(zoom>220){
        zoom= 220;
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
});
$("#zoom-out").click(function(){
    zoom-=15;
    if(zoom<55){
        zoom =55;
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
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