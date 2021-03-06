/**
 * @fileoverview client side JS
 */
// Scroll Variables
const socket = io.connect();
var clicking = false;
$("#move").css("background-color", "grey");
var zoom = 100;
// move, line, circle, rect, cone, ping
var optionNames = ["#move", "#line", "#circle", "#rect", "#ping"];
var options = [true, false, false, false, false];
            //move, line, circle, rect, cone, ping
var drawnObjects = [false, false, false, false, false, false];
var d = new Date();
var n = d.getTime();
var timerBar = 0;
const timerHeight = 90.6;
var gridToggle = false;
const grid = 35;
// Onclick listeners for the buttons
var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha", "echo", "rein"];
var playerSent = [false, false, false, false, false, false];
// 2d array containing player names as the first element, then the elements of the object to draw
var savedObjects = [
    ["Sherwin", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 1 storage
    ["James", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 1 storage
    ["Glen", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 2 storage
    ["Nicolas", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"], //player 3 storage
    ["Lilah", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"],  //player 4 storage
    ["Sasha", "mouse1", "mouse2", "placehold1", "placehold2", "distance", "zoom", "type"]  //player 4 storage
];
const playerStartX = [
    [0,1680, 1680, 1820, 1820, 1750, 1680, 1680], // map 0
    [0, 420, 280, 420, 245, 280, 280, 280], // map 1
    [0,0, 70, 140, 0, 70, 70, 70], // map 2
    [0,1960, 2030, 1960, 2030, 1890, 2030, 2030], // map 3
    [0,490, 560, 490, 560, 630, 560, 560], // map 4
    [0,3080, 3150, 3220, 3290, 3360, 3150, 3150]  // map 5
];
const playerStartY = [
    [0,1960, 2030, 1960, 2030, 1890, 1960, 1960], // map 0
    [0,210, 210, 350, 280, 350, 210, 210], // map 1
    [0,980, 980, 1050, 1120, 1120, 980, 980], // map 2
    [0,980, 980, 1050, 1120, 1120,980, 980], // map 3
    [0,840, 840, 930, 930, 930, 840, 840], // map 4
    [0,1120, 1120, 1120, 1120, 1120, 1120, 1120], // map 5 
];
var monsterSelect = [false, false, false, false, false, false];
var monsterDebuff = [false, false, false, false, false, false];
var monsterX = [[1260, 1330, 1400],
                [2030],
                [210, 2905, 1960, 2310],
                [2030, 2030, 2030],
                [490],
                [3150, 770]
];
var monsterY = [[910, 980, 1050],
                [945],
                [980, 1015, 280, 1470],
                [420, 420, 420],
                [1070],
                [1170, 1030]

];
const monsterStart = [3, 0, 3,0, 1, 2];
const monsterPics = [
    ["/monsters/chuul.png", "/monsters/chuul.png", "/monsters/chuul.png"],
    ["/monsters/kid.png"], // need kid token 
    ["/monsters/kid.png","/monsters/assassin.png", "monsters/fire-elemental.png", "monsters/fire-elementalf.png"], // might need 
    [],
    ["/monsters/fake-guy.png"], // need fake guy token
    ["/monsters/fake-guy.png", "/monsters/dragon.png"] // need fake-guy token, and monster token 

];
var toggle = [false, false];
var playerX = 0;
var playerY = 0;
var playerXs = [0,1680, 1680, 1820, 1820, 1750, 0, 0];
var playerYs = [0,1960, 2030, 1960, 2030, 1890, 0, 0];
var maxX = [2100, 2100, 4200, 4200, 2100, 3500];
var maxY = [2100, 2100, 2100, 2100, 2100, 2450];
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
var timerInterval = 0;

var zoomOutMax = false;
var zoomInMax = false;
var zoomValueMax = [100, 100, 50, 50, 100, 50];
var leftScroll = 0;
var topScroll = 0;

var realPointX = 0;
var realPointY = 0;
var realLeftScroll = 0;
var realTopScroll = 0;
ctx.lineWidth = 5;
ctx.font="bold 14px verdana";
ctx.fillStyle = "red";
// Main code to run instantly

 /*********************************************************************
  *                  Basics Functions 
  *********************************************************************/
function drawGrid(x, y) {
    for (var rows = 0; rows < y; rows++) {
        for (var columns = 0; columns < x; columns++) {
            $("#main-screen").append("<div style='left:"+70*columns+"px; top:"+70*rows+"px;' class='grid'></div>");
        };
    };
    $(".grid").width("70px");
    $(".grid").height("70px");
};

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
        if (player === players[i]){
            playerX = playerXs[i];
            playerY = playerYs[i];
        }
        $("#"+players[i]).css("left", playerXs[i]);
        $("#"+players[i]).css("top", playerYs[i]);
    }
}
function updateMonsters(){
    for(var i = 0; i < monsterSelect.length; i++){
        $("#monster"+i).css("left", monsterX[mapNum][i]);
        $("#monster"+i).css("top", monsterY[mapNum][i]);
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
    return Math.round(Math.sqrt(Math.pow((x2/70-x1/70), 2) + Math.pow((y2/70-y1/70), 2))*100/(zoom/100.0))/100.0;
}
function drawLine(p, x1, y1, x2, y2, d){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.fillText(p+" "+d, (x1+x2)/2,(y1+y2-40)/2);
    ctx.stroke();
}
function drawCircle(p, x, y, d){
    ctx.beginPath();
    ctx.arc(x, y, d, 0, 2*Math.PI);
    ctx.fillText(p+" "+Math.round(distance*500)/100, x,y);
    ctx.stroke();
}
function drawRect(p, x1, y1, x2, y2, d){
    ctx.beginPath();
    ctx.rect(x1, y1, x2, y2);
    ctx.fillText(p+" "+d, (x1+x2-200),(y1+y2-70));
    ctx.stroke();
}
function drawPing(p, x1, y1){
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1-45, y1-45);
    ctx.lineTo(x1+45,y1-45);
    ctx.closePath();
    ctx.fill();
    ctx.fillText(p, x1-10, y1-55);
    ctx.stroke();
}
function adjustObject(n, i){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startPoint[0] = startPoint[0]/(zoom+n)*zoom;
    startPoint[1] = startPoint[1]/(zoom+n)*zoom;
    realPointX =realPointX/(zoom+n)*zoom;
    realPointY = realPointY/(zoom+n)*zoom;
    realLeftScroll = realLeftScroll/(zoom+n)*zoom;
    realTopScroll = realTopScroll/(zoom+n)*zoom;
    if(i===1){
        drawLine(player, startPoint[0], startPoint[1], realPointX+realLeftScroll, realPointY+realTopScroll, Math.round(distance*500)/100);
    } else if(i===2){
        drawCircle(player, startPoint[0], startPoint[1], distance*70*zoom/100.0);
    } else if(i===3){
        drawRect(player, startPoint[0], startPoint[1], realPointX+realLeftScroll-startPoint[0], realPointY+realTopScroll-startPoint[1], Math.round(distance*500)/100);
    } else if(i===4){
        drawPing(player, startPoint[0], startPoint[1]);
    }
}
function adjustOutterObjects(n){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < savedObjects.length; i++){
        if(playerSent[i]){
            savedObjects[i][1]=savedObjects[i][1]/(zoom+n)*zoom;
            savedObjects[i][2]=savedObjects[i][2]/(zoom+n)*zoom;
            savedObjects[i][3]=savedObjects[i][3]/(zoom+n)*zoom;
            savedObjects[i][4]=savedObjects[i][4]/(zoom+n)*zoom;
        }
        if(playerSent[i] && savedObjects[i][7] === "line"){
            drawLine(savedObjects[i][0], savedObjects[i][1], savedObjects[i][2], savedObjects[i][3], savedObjects[i][4], Math.round(savedObjects[i][5]*500)/100);
        } else if(playerSent[i] && savedObjects[i][7] === "circle"){
            drawCircle(savedObjects[i][0], savedObjects[i][1], savedObjects[i][2], savedObjects[i][5]*(70*zoom/100.0)/(zoom+n)*zoom);
        } else if(playerSent[i] && savedObjects[i][7] === "rect"){
            drawRect(savedObjects[i][0], savedObjects[i][1], savedObjects[i][2], savedObjects[i][3], savedObjects[i][4], Math.round(savedObjects[i][5]*500)/100)
        } else if(playerSent[i] && savedObjects[i][7] === "ping"){
            drawPing(playerSent[i][0], savedObjects[i][3], savedObjects[i][4])
        }
    }
}
function resetObjects(){
    for(var i = 0; i < drawnObjects.length; i++){
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
 /*********************************************************************************************
  *                  Admin Onclick Listeners
  *********************************************************************************************/
if (player === players[0]){
    $("#pfp").append("<button id=map-back>back a map</button>");
    $("#pfp").append("<button id=map-forw>forward a map</button>");
    $("#pfp").append("<button id=force>forcecam</button>");
    $("#pfp").append("<button id=spawn-monsters>spawn monsters</button>");
    $("#pfp").append("<button id=debuff>toggle debuff</button>");
    $("#pfp").append("<button id=die>kill the monster</button>");
    $("#pfp").append("<button id=move1>move1</button>");
    $("#pfp").append("<button id=move2>move2</button>");
    $("#pfp").append("<button id=move3>move3</button>");
    $("#pfp").append("<button id=move4>move4</button>");
    $("#pfp").append("<button id=move5>move5</button>");
    $("#pfp").append("<button id=move6>move6</button>");
    $("#pfp").append("<button id=change1>james</button>");
    $("#pfp").append("<button id=change2>glen</button>");
    $("#pfp").append("<button id=change3>nicolas</button>");
    $("#pfp").append("<button id=change4>lilah</button>");
    $("#pfp").append("<button id=change5>sasha</button>");
    $("#pfp").append("<button id=change6>enemy</button>");
    $("#pfp").append("<button id=show-echo>echo</button>");
    $("#pfp").append("<button id=show-rein>rein</button>");
}
drawGrid(30, 30);
$("#map-back").click(function(){
    socket.emit("map", -1);
});
$("#map-forw").click(function(){
    socket.emit("map", 1);
});
$("#force").click(function(){
    socket.emit("forceCam", [leftScroll, topScroll, zoom]);
});
$("#spawn-monsters").click(function(){
    socket.emit("spawn-monster", monsterStart[mapNum]);
});
$("#debuff").click(function(){
    for(var i = 0 ; i < monsterSelect.length; i++){
        if(monsterSelect[i]){
            socket.emit("debuff", i);
        }
    }
});
$("#move1").click(function(){
    monsterSelect = [true, false, false, false, false, false];
});
$("#move2").click(function(){
    monsterSelect = [false, true, false, false, false, false];
});
$("#move3").click(function(){
    monsterSelect = [false, false, true, false, false, false];
});
$("#move4").click(function(){
    monsterSelect = [false, false, false, true, false, false];
});
$("#move5").click(function(){
    monsterSelect = [false, false, false, false, true, false];
});
$("#move6").click(function(){
    monsterSelect = [false, false, false, false, false, true];
});
$("#show-echo").click(function(){
    
    socket.emit("show", 0);
})
$("#show-rein").click(function(){
    socket.emit("show", 1);
});
$("#change1").click(function(){
    socket.emit("change", 0);
});
$("#change2").click(function(){
    socket.emit("change", 1);
});
$("#change3").click(function(){
    socket.emit("change", 2);
});
$("#change4").click(function(){
    socket.emit("change", 3);
});
$("#change4").click(function(){
    socket.emit("change", 4);
});
$("#change5").click(function(){
    socket.emit("change", 5);
});
$("#change6").click(function(){
    socket.emit("change", 6);
});
 /*******************************************************************
  *                  Client Side Listeners
  *******************************************************************/
socket.emit("player", player);
socket.emit("map", 0);
socket.on("hello", function(){
    socket.emit("hi", player);
});
socket.on("map", function(msg){
    mapNum = msg;
    if(mapNum < 0){
        map = 0;
    };
    // all map changes insert here
    resetObjects();
    resetPlayerSent();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Changing player pos
    socket.emit("updateX", playerStartX[mapNum]);
    socket.emit("updateY", playerStartY[mapNum]);
    // Changing grid out 
    $(".grid").remove();
    $(".monster").remove();
    drawGrid(maxX[mapNum]/70, maxY[mapNum]/70);
    $("#map").attr("src", "/maps/map"+mapNum+".png");
});
socket.on("positionX", function(X){
    playerXs = X;
    updatePlayers();
});
socket.on("positionY", function(Y){
    playerYs = Y;
    updatePlayers();
});
socket.on("updateX", function(msg){
    playerXs = msg;
    updatePlayers();
});
socket.on("updateY", function(msg){
    playerYs = msg;
    updatePlayers();
});
socket.on("show", function(msg){
    if(toggle[msg]){
        if(msg === 0){
            $("#echo").css("display", "none");
        } else{
            $("#rein").css("display", "none");
        }
        toggle[msg] = false;
    } else{
        if(msg === 0){
            $("#echo").css("display", "block");
        } else{
            $("#rein").css("display", "block");
        }
        toggle[msg] = true;
    }
});
socket.on("forceCam", function(msg){
    zoom = msg[2];
    $("#main-screen").scrollLeft(msg[0]); 
    $("#main-screen").scrollTop(msg[1]); 
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
    $(".monster").css("zoom", zoom+"%");
});
socket.on("spawn-monster", function(msg){
    $(".monster").remove();
    for(var i = 0; i < monsterPics[mapNum].length; i++){ // what monsters are we putting in there boy 
        $("#main-screen").append("<div class='monster' id='monster"+i+"' style='left:70px; top:70px;'><img src='"+monsterPics[mapNum][i]+"'></div>");
    }
    updateMonsters();
});
socket.on("monsterX", function(msg){
    monsterX[mapNum] = msg;
    updateMonsters();
});
socket.on("monsterY", function(msg){
    monsterY[mapNum] = msg;
    updateMonsters();
});
socket.on("debuff", function(msg){
    if(monsterDebuff[msg]){
        $("#monster"+[msg]).css("border-bottom", "none");
        monsterDebuff[msg] = false;
    } else{
        $("#monster"+[msg]).css("border-bottom", "red solid");
        monsterDebuff[msg] = true;
    }
});
socket.on("change", function(msg){
    $(".pfp-display").remove();
    for(var i = 0; i < players.length+1; i++){
        if (msg === players[i]){
            $("#pfp").append("<img class='pfp-display' src='/players/player"+(i+1)+".png'/>");
        }
    } 
    if (msg === "monster"){
        $("#pfp").append("<img class='pfp-display'src='/monsters/chuul.png'/>");
    }
});
socket.on('player-online', function(msg) {
    $(".player-tab")[parseInt(msg)].style.backgroundColor = "green";
});
socket.on('player-offline', function(msg){
    $(".player-tab")[parseInt(msg)].style.backgroundColor = "red";
});
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
        resetObjects();
        resetPlayerSent();
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "line");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLine(msg[0], msg[1]*(zoom/msg[6]), msg[2]*(zoom/msg[6]),msg[3]*(zoom/msg[6]), msg[4]*(zoom/msg[6]),Math.round(msg[5]*500)/100);
    }
});
socket.on("circle", function(msg){
    if(msg[0] === player){
    } else{
        resetObjects();
        resetPlayerSent();
        savePlayer(msg[0], msg[1], msg[2], 0, 0, msg[3], msg[4], "circle");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(msg[0], msg[1]*(zoom/msg[4]), msg[2]*(zoom/msg[4]), msg[3]*70*msg[4]/100.0*(zoom/msg[4]));
    }
});
socket.on("rect", function(msg){
    if(msg[0] === player){
    } else{
        resetObjects();
        resetPlayerSent();
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "rect");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(msg[0], msg[1]*(zoom/msg[6]), msg[2]*(zoom/msg[6]), msg[3]*(zoom/msg[6]), msg[4]*(zoom/msg[6]), Math.round(msg[5]*500)/100);
    }
});
socket.on("ping", function(msg){
    if(msg[0] === player){
    } else{
        resetObjects();
        resetPlayerSent();
        savePlayer(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], "ping");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPing(msg[0], msg[3]*(zoom/msg[5]), msg[4]*(zoom/msg[5]));
    }
});
/************************************************************************
 *                 Mouse Options Click Functions
 ************************************************************************/
document.addEventListener('keyup', function(e){
    if(e.code === 'KeyW'){
        playerY-=grid;
        if(player === players[0]){
            for(var i = 0; i < monsterSelect.length; i++){
                if(monsterSelect[i]){
                    monsterY[mapNum][i]-=grid;
                    socket.emit("monsterY", monsterY[mapNum]);
                }
            }
        } else if(playerY < 0){
            playerY = 0;
        } else{
            socket.emit("W", player);
        }
    } else if(e.code ==='KeyA'){
        playerX-=grid;
        if(player === players[0]){
            for(var i = 0; i < monsterSelect.length; i++){
                if(monsterSelect[i]){
                    monsterX[mapNum][i]-=grid;
                    socket.emit("monsterX", monsterX[mapNum]);
                }
            }
        } else if(playerX < 0){
            playerX = 0;
        } else{
            socket.emit("A", player);
        }
    } else if(e.code ==='KeyS'){
        playerY+=grid;
        if(player === players[0]){
            for(var i = 0; i < monsterSelect.length; i++){
                if(monsterSelect[i]){
                    monsterY[mapNum][i]+=grid;
                    socket.emit("monsterY", monsterY[mapNum]);
                }
            }
        }else if(playerY >= maxY[mapNum]){
            playerY -=grid;
        } else{
            socket.emit("S", player);
        }
    } else if(e.code ==='KeyD'){
        playerX+=grid;
        if(player === players[0]){
            for(var i = 0; i < monsterSelect.length; i++){
                if(monsterSelect[i]){
                    monsterX[mapNum][i]+=grid;
                    socket.emit("monsterX", monsterX[mapNum]);
                }
            }
        }else if(playerX >= maxX[mapNum]){
            playerX -=grid;
        } else{
            socket.emit("D", player);
        }
    }
    
});
/************************************************************************
 *                 Mouse Options Click Functions
 ************************************************************************/
$("#zoom-in").click(function(){
    zoom+=15;
    zoomOutMax = false;
    if(zoom>220){
        zoom= 220;
        zoomInMax = true;
    } 
    for(var i = 0; i < options.length; i++){
        if(drawnObjects[i] && (!zoomInMax)){
            adjustObject(-15, i);
        }
    } 
    for(var i = 0; i < playerSent.length; i++){
        if (playerSent[i] && (!zoomInMax)){
            adjustOutterObjects(-15);
        }
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
    $(".monster").css("zoom", zoom+"%");
});
$("#zoom-out").click(function(){
    zoom-=15;
    zoomInMax = false;
    if(zoom< zoomValueMax[mapNum]){
        zoom =zoomValueMax[mapNum];
        zoomOutMax = true;
    }
    for(var i = 0; i < options.length; i++){
        if(drawnObjects[i] &&!zoomOutMax){
            adjustObject(15, i);
        }
    }
    for(var i = 0; i < playerSent.length; i++){
        if (playerSent[i] && (!zoomOutMax)){
            adjustOutterObjects(15);
        }
    }
    $("#map").css("zoom", zoom+"%");
    $(".grid").css("zoom", zoom+"%");
    $(".player").css("zoom", zoom+"%");
    $(".monster").css("zoom", zoom+"%");
});
$("#move").click(function(){
    changeOption(0);  
    resetObjects();
    resetPlayerSent();
});
$("#line").click(function(){
    changeOption(1);
});
$("#circle").click(function(){
    changeOption(2);
});
$("#rect").click(function(){
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
});
/************************************************************************
 *            Mouse Movement and Press Functions
 ************************************************************************/
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
                socket.emit("circle", [player, startPoint[0], startPoint[1], distance, zoom, 1, 2]);
            } else if(i===3){
                socket.emit("rect", [player, startPoint[0], startPoint[1], pointX-startPoint[0]+leftScroll, pointY-startPoint[1]+topScroll, distance, zoom]);
            } 
            pointValue = false;
            drawnObjects[i] = true;
        } 
    }
    if(options[4]){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPing(player, pointX+$("#main-screen").scrollLeft(), pointY+$("#main-screen").scrollTop());
        drawnObjects[4] = true;
        socket.emit("ping", [player, startPoint[0], startPoint[1], pointX+$("#main-screen").scrollLeft(), pointY+$("#main-screen").scrollTop(), zoom, 0]);
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
        drawLine(player, startPoint[0], startPoint[1], e.clientX+leftScroll, e.clientY+topScroll, Math.round(distance*500)/100);
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
    } else if(options[2] && pointValue){
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(player, startPoint[0], startPoint[1], distance*70*zoom/100.0);
        // then after that you do Math.round((d/70*zoom/100.0)*500)/100
    } else if(options[3] && pointValue){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(player, startPoint[0], startPoint[1], e.clientX-startPoint[0]+leftScroll, e.clientY-startPoint[1]+topScroll, Math.round(distance*500)/100)
        distance = calcDistance(0, e.clientX-startPoint[0]+leftScroll, 0, e.clientY-startPoint[1]+topScroll);
    } 
    if (options[0] || pointValue || clicking){
        pointX = e.clientX; //update point x for smoother transition
        pointY = e.clientY; //update point y for smoother transition
    }
});
$("#main-screen").mouseleave(function(e) {
    clicking = false; // if mouse isn't in screen, not clicking
});