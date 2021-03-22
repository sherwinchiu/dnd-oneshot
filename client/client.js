/**
 * @fileoverview client side JS
 */
// Scroll Variables
var clicking = false;
$("#move").css("background-color", "grey");
var zoom = 220;
const mapLimits = [85, 85, 55]; 
// move, line, circle, square, cone, ping
var optionNames = ["#move", "#line", "#circle", "#square", "#ping"];
var options = [true, false, false, false, false];
            //move, line, circle, square, cone, ping
var drawnObjects = [false, false, false, false];
var d = new Date();
var n = d.getTime();
var timerBar = 0;
var timerHeight = 90.6;
var gridToggle = true;
const grid = 35;
// Onclick listeners for the buttons
const socket = io.connect();
var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var playerSent = [false, false, false, false, false];
// 2d array containing player names as the first element, then the elements of the object to draw
var savedObjects = [
    ["James", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 1 storage
    ["Glen", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 2 storage
    ["Nicolas", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 3 storage
    ["Lilah", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"],  //player 4 storage
    ["Sasha", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"]  //player 4 storage
];

var playerX = 0;
var playerY = 0;
var playerXs = [0, 0, 0, 0, 0, 0];
var playerYs = [0, 0, 0, 0, 0, 0];
var maxX = [2100, 2100, 3500];
var maxY = 2100;
var mapNum = 0;
var player = prompt("Please enter your name, etc. (James, Nicolas, Glen, Lilah, Sasha)\nCase Sensitive so PLEASE put in your NAME WITH UPPERCASE");
var pointValue = false;
var pointX = 0;
var pointY = 0;
var startPoint = [0, 0];
var distance = 0;
var adjustDistance = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var zoomOutMax = false;
var zoomInMax = false;
var leftScroll = 0;
var topScroll = 0;

var realPointX = 0;
var realPointY = 0;
var realLeftScroll = 0;
var realTopScroll = 0;
ctx.lineWidth = 5;
ctx.font="14px verdana";
ctx.fillStyle = "red";
// Main code to run instantly

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
function updater(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
function localUpdate(){
    for(var i = 0; i < players.length; i++){
        if (player == players[i]){
            playerX = playerXs[i];
            playerY = playerYs[i];
        }
    }
}
function resetOptions(){
    for(var i = 0; i < options.length; i++){
        options[i] = false;
        $(optionNames[i]).css("background-color", "white");
    }
}
function changeOption(n){
    if(n ===0){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resetObjects();
    }
    if(options[n]){
        $(optionNames[n]).css("background-color", "white");
        options[n] = false;
    } else{
        resetOptions();
        options[n] = true;
        $(optionNames[n]).css("background-color", "grey");
    }
}
function calcDistance(x1, x2, y1, y2){
    x1/=70.0;
    x2/=70.0;
    y1/=70.0;
    y2/=70.0;
    return Math.round(Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))*100/(zoom/100.0))/100.0;
}
function adjustObject(n, i){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startPoint[0] = startPoint[0]/(zoom+n)*zoom;
    startPoint[1] = startPoint[1]/(zoom+n)*zoom;
    realPointX =realPointX/(zoom+n)*zoom;
    realPointY = realPointY/(zoom+n)*zoom;
    realLeftScroll = realLeftScroll/(zoom+n)*zoom;
    realTopScroll = realTopScroll/(zoom+n)*zoom;
    ctx.beginPath();
    if(i===1){
        ctx.moveTo(startPoint[0], startPoint[1]);
        ctx.lineTo(realPointX+realLeftScroll, realPointY+realTopScroll);
    } else if(i===2){
        ctx.arc(startPoint[0], startPoint[1], (distance*70*zoom/100.0)/(zoom+n)*zoom,0, 2*Math.PI);
    } else if(i===3){
        ctx.rect(startPoint[0], startPoint[1], realPointX+realLeftScroll-startPoint[0], realPointY+realTopScroll-startPoint[1]);
    }
    ctx.stroke();
    ctx.fillText(player+" "+Math.round(distance*500)/100, (startPoint[0]+realPointX+realLeftScroll)/2, (startPoint[1]+realPointY+realTopScroll-20)/2);
}
function adjustOutterObjects(n){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < 4; i++){
        if(playerSent[i]){
            savedObjects[i][1]=savedObjects[i][1]/(zoom+n)*zoom;
            savedObjects[i][2]=savedObjects[i][2]/(zoom+n)*zoom;
            savedObjects[i][3]=savedObjects[i][3]/(zoom+n)*zoom;
            savedObjects[i][4]=savedObjects[i][4]/(zoom+n)*zoom;
        }
        if(playerSent[i] && savedObjects[i][7] === "line"){
            ctx.beginPath();
            ctx.moveTo(savedObjects[i][1], savedObjects[i][2]);
            ctx.lineTo(savedObjects[i][3], savedObjects[i][4]);
            ctx.stroke();
            ctx.fillText(savedObjects[i][0]+" "+Math.round(savedObjects[i][5]*500)/100, (savedObjects[i][1]+savedObjects[i][3])/2, (savedObjects[i][2]+savedObjects[i][4])/2);
        }
    }
}
function drawFinalObject(n){
    if(n===1){
        pointValue = false;
        ctx.lineTo(pointX+leftScroll, pointY+topScroll);
        ctx.stroke();
    } else if(n===2){
        pointValue = false;
        ctx.arc(startPoint[0], startPoint[1], distance*70*zoom/100.0,0, 2*Math.PI);
        ctx.stroke();
    } else if(n===3){
        pointValue = false;
        ctx.rect(startPoint[0], startPoint[1], pointX-startPoint[0]+leftScroll, pointY-startPoint[1]+topScroll);
        ctx.stroke();
    } else if(n===4){
        pointValue = false;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(pointX+$("#main-screen").scrollLeft(), pointY+$("#main-screen").scrollTop());
        ctx.lineTo(pointX-45+$("#main-screen").scrollLeft(), pointY-45+$("#main-screen").scrollTop());
        ctx.lineTo(pointX+45+$("#main-screen").scrollLeft(), pointY-45+$("#main-screen").scrollTop());
        ctx.closePath();
        ctx.fill();
        ctx.fillText(player, pointX-10+$("#main-screen").scrollLeft(), pointY-55+$("#main-screen").scrollTop());
    }
}
function resetObjects(){
    for(var i = 0; i < 4; i++){
        drawnObjects[i] = false;
    }
}
function resetPlayerSent(){
    for(var i = 0; i < playerSent.length; i++){
        playerSent[i] = false;
    }
}
function savePlayer(play, mouseX, mouseY, place1, place2, distance, z, type){
    for(var i = 0; i < savedObjects.length; i++){
        if(play === savedObjects[i][0]){
            playerSent[i] = true;
            savedObjects[i][1] = mouseX*(zoom/z);
            savedObjects[i][2] = mouseY*(zoom/z);
            savedObjects[i][3] = place1*(zoom/z);
            savedObjects[i][4] = place2*(zoom/z); 
            savedObjects[i][5] = distance; 
            savedObjects[i][6] = zoom; 
            savedObjects[i][7] = type;
        }
    }  
}
// Main function
if (player === players[0]){

}
drawGrid(30, 30);
 // Server Connection Stuff
socket.emit("player", player);
socket.on("hello", function(){
    socket.emit("hi", player);
});
socket.on("positionX", function(X){
    playerXs = X;
    localUpdate();
    updatePlayers();
});
socket.on("positionY", function(Y){
    playerYs = Y;
    localUpdate();
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
socket.on("line", function(msg){
    if(msg[0] === player){
    } else{
        resetPlayerSent();
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "line");
        resetObjects();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(msg[1]*(zoom/msg[6]), msg[2]*(zoom/msg[6]));
        ctx.lineTo(msg[3]*(zoom/msg[6]), msg[4]*(zoom/msg[6]));
        ctx.stroke();
        ctx.fillText(msg[0] +" "+Math.round(msg[5]*500)/100, (msg[1]*(zoom/msg[6])+msg[3]*(zoom/msg[6]))/2, (msg[2]*(zoom/msg[6])+msg[4]*(zoom/msg[6]))/2-20);
    }
});
socket.on("circle", function(msg){
    if(msg[0] === player){
    } else{
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "circle");
        resetObjects();
        resetPlayerSent();
    }
});
socket.on("square", function(msg){
    if(msg[0] === player){
    } else{
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "square");
        resetObjects();
        resetPlayerSent();
    }
});
socket.on("ping", function(msg){
    if(msg[0] === player){
    } else{
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "ping");
        resetObjects();
        resetPlayerSent();
    }
});
// Keylisteners for players
document.addEventListener('keyup', function(e){
    if(e.code === 'KeyW'){
        playerY-=grid;
        if(playerY < 0){
            playerY = 0;
        } else{
            socket.emit("W", player);
        }
    } else if(e.code ==='KeyA'){
        playerX-=grid;
        if(playerX < 0){
            playerX = 0;
        } else{
            socket.emit("A", player);
        }
    } else if(e.code ==='KeyS'){
        playerY+=grid;
        if(playerY >= maxY){
            playerY -=grid;
        } else{
            socket.emit("S", player);
        }
    } else if(e.code ==='KeyD'){
        playerX+=grid;
        if(playerX >= maxX[mapNum]){
            playerX -=grid;
        } else{
            socket.emit("D", player);
        }
    }
});
$("#countdown-bar").click(function(){
    var timerInterval = window.setInterval(timer, 10);
});
$("#zoom-in").click(function(){
    zoom+=15;
    zoomOutMax = false;
    if(zoom>220){
        zoom= 220;
        zoomInMax = true;
    } 
    for(var i = 1; i < options.length; i++){
        if(drawnObjects[i] && (!zoomInMax)){
            adjustObject(-15, i);
        } else if (playerSent[i] && (!zoomInMax)){
            adjustOutterObjects(-15);
        }
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
});
$("#zoom-out").click(function(){
    zoom-=15;
    zoomInMax = false;
    if(zoom<100){
        zoom =100;
        zoomOutMax = true;
    } 
    for(var i = 1; i < options.length; i++){
        if(drawnObjects[i] &&!zoomOutMax){
            adjustObject(15, i);
            
        }else if (playerSent[i] && (!zoomOutMax)){
            adjustOutterObjects(15);
        }
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
});
$("#move").click(function(){
    changeOption(0);  
});
$("#line").click(function(){
    changeOption(1);
});
$("#circle").click(function(){
    changeOption(2);
});
$("#square").click(function(){
    changeOption(3);
});
$("#ping").click(function(){
    changeOption(4);
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

// Scroll Controls (will probably have to implement other controlls in here as well)
$("#main-screen").mousedown(function(e) {
    e.preventDefault(); // mouse event
    pointX = e.clientX;
    pointY = e.clientY;
    clicking = true;
    for(var i = 1; i < options.length-1; i++){
        // Check if mouse clicked
        if(options[i] && !pointValue){
            pointValue = true;
            startPoint[0] = pointX+$("#main-screen").scrollLeft();
            startPoint[1] = pointY+$("#main-screen").scrollTop();
            resetObjects();
            resetPlayerSent();
        } else if(options[i] && pointValue){
            realPointX = pointX;
            realPointY = pointY;
            realLeftScroll = leftScroll;
            realTopScroll = topScroll;
            if(i===1){
                socket.emit("line", [player, startPoint[0], startPoint[1], pointX+leftScroll, pointY+topScroll, distance, zoom]);
            } else if(i===2){
                socket.emit("circle", [player, startPoint[0], startPoint[1], distance*70*zoom/100.0, zoom]);
            } else if(i===3){
                socket.emit("square", [player, startPoint[0], startPoint[1], pointX-startPoint[0]+leftScroll, pointY-startPoint[1]+topScroll, distance, zoom]);
            } 
            drawFinalObject(i);
            drawnObjects[i] = true;
        } 
    }
    if(options[4]){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFinalObject(4);
        socket.emit("ping", [player, startPoint[0], startPoint[1], pointX+$("#main-screen").scrollLeft(), pointY+$("#main-screen").scrollTop(), zoom]);
    }
});
$(document).mouseup(function() {
    clicking = false; // if mouse isn't clicked, not clicking
});

$("#main-screen").mousemove(function(e) {
    e.preventDefault(); // get mouse event
    leftScroll = $("#main-screen").scrollLeft();
    topScroll = $("#main-screen").scrollTop();
    if (clicking && options[0]) { // if clicked down
        e.preventDefault(); // get mouse event
        $("#main-screen").scrollLeft(leftScroll + (pointX - e.clientX)); // scroll left for however much the difference between onclick and drag is 
        $("#main-screen").scrollTop(topScroll + (pointY - e.clientY)); // scroll top for however much the difference between onclick and drag is 
    } else if(options[1] && pointValue){ 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(startPoint[0], startPoint[1]);
        ctx.lineTo(e.clientX+leftScroll, e.clientY+topScroll);
        ctx.stroke();
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
        ctx.fillText(player +" "+Math.round(distance*500)/100, (startPoint[0]+e.clientX+leftScroll)/2, (startPoint[1]+e.clientY-20+topScroll)/2);
    } else if(options[2] && pointValue){
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(startPoint[0], startPoint[1], distance*70*zoom/100.0,0, 2*Math.PI);
        ctx.stroke();
        ctx.fillText(player +" "+Math.round(distance*500)/100, (startPoint[0]+e.clientX+leftScroll)/2, (startPoint[1]+e.clientY-20+topScroll)/2);
    } else if(options[3] && pointValue){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(startPoint[0], startPoint[1], e.clientX-startPoint[0]+leftScroll, e.clientY-startPoint[1]+topScroll);
        ctx.stroke();
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
        ctx.fillText(player +" "+Math.round(distance*500)/100, (startPoint[0]+e.clientX+leftScroll)/2, (startPoint[1]+e.clientY-20+topScroll)/2);
    } 
    if (options[0] || pointValue || clicking){
        pointX = e.clientX; //update point x for smoother transition
        pointY = e.clientY; //update point y for smoother transition
    }
});
$("#main-screen").mouseleave(function(e) {
    clicking = false; // if mouse isn't in screen, not clicking
});