const port = 80;
const { Console } = require("console");

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
const express = require ("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const grid = 35;
var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var playerXs = [0, 0, 0, 0, 0, 0];
var playerYs = [0, 0, 0, 0, 0, 0];
var online = [false, false, false, false, false, false];
var monsterX = [0, 0, 0];
var monsterY = [0, 0, 0];
var mapNum = 0;
// Standard functions
function moveW(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]-=grid;
            io.emit("W", players[i]);
        }
    }
}
function moveA(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]-=grid;
            io.emit("A", players[i]);
        }
    }
}
function moveS(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]+=grid;
            io.emit("S", players[i]);
        }
    }
}
function moveD(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]+=grid;
            io.emit("D", players[i]);
        }
    }
}
server.listen(port);
app.use(express.static(__dirname+"/client"));
app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(__dirname+"/client/index.html");
});
console.log("Server started on port "+port);
io.sockets.on('connection', function(socket){
    console.log("user connected");
    //Check if users is connected or not
    io.emit("hello");
    io.emit("positionX", playerXs);
    io.emit("positionY", playerYs);
    io.emit("map", mapNum);
    socket.on("hi", function(msg){
        for(var i = 0; i < players.length; i++){
            if(msg === players[i] || online[i]){
                online[i] = true;
                io.emit("player-online", i);
            } else{
                online[i] = false;
                io.emit("player-offline", i);
            }
        }
    // User events for players 
    });
    socket.on("map", function(msg){
        mapNum+= msg;
        io.emit("map", mapNum);
    });
    socket.on("W", function(msg){
        moveW(msg);
    });
    socket.on("A", function(msg){
        moveA(msg);
    });
    socket.on("S", function(msg){
        moveS(msg);
    });
    socket.on("D", function(msg){
        moveD(msg);
    });
    socket.on("updateX", function(msg){
        playerXs = msg;
        io.emit('updateX', msg);
    });
    socket.on("updateY", function(msg){
        playerYs = msg;
        io.emit('updateY', msg);
    });
    socket.on("forceCam", function(msg){
        io.emit("forceCam", msg);
    });
    socket.on("spawn-monster", function(msg){
        io.emit("spawn-monster", msg);
    });
    socket.on("monsterX", function(msg){
        monsterX = msg;
        io.emit("monsterX", monsterX);
    });
    socket.on("monsterY", function(msg){
        monsterY = msg;
        io.emit("monsterY", monsterY);
    });
    socket.on("change", function(msg){
        for(var i = 0; i < players.length; i++){
            if (msg === i){
                io.emit("change", players[i])
            }
        }
        if (msg === 6){
            io.emit("change", "monster");
        }
    });
    // Events for player lines
    socket.on("line", function(msg){ // [name, point1, point2, point3, point4, zoom]
        io.emit("line", msg);
    });
    socket.on("circle", function(msg){ // [name, point1, point2, radius, zoom]
        io.emit("circle", msg);
    });
    socket.on("rect", function(msg){ // [name, point1, point2, width, radius, zoom]
        io.emit("rect", msg);
    });
    socket.on("ping", function(msg){ // [name, point1, point2, zoom]
        io.emit("ping", msg);
    });
    // Check for disconnect
    socket.on('disconnect', function(msg) {
        online = [false, false, false, false, false, false];
        io.emit("hello");
        console.log("user disconnected ");
    });
    // Sending back if player is connected

});