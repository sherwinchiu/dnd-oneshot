const port = 25565;
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

var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var playerXs = [0, 0, 0, 0, 0, 0];
var playerYs = [0, 0, 0, 0, 0, 0];
var online = [false, false, false, false, false, false];
var points = [false, false];

// Standard functions
function moveW(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]-=70;
            io.emit("W", players[i]);
        }
    }
}
function moveA(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]-=70;
            io.emit("A", players[i]);
        }
    }
}
function moveS(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerYs[i]+=70;
            io.emit("S", players[i]);
        }
    }
}
function moveD(player){
    for(var i = 0; i < players.length; i++){
        if(player === players[i]){
            playerXs[i]+=70;
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

    // Check for disconnect
    socket.on('disconnect', function(msg) {
        online = [false, false, false, false, false, false];
        io.emit("hello");
        console.log("user disconnected ");
    });
    // Sending back if player is connected

});