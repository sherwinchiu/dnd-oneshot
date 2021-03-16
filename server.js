const port = 25565;
const { Console } = require("console");
const express = require ("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var online = [false, false, false, false, false, false];
server.listen(port);

app.use(express.static(__dirname+"/client"));
app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(__dirname+"/client/index.html");
});
console.log("Server started on port "+port);
io.sockets.on('connection', function(socket){
    console.log("user connected");
    io.emit("hello");
    socket.on("hi", function(msg){
        for(var i = 0; i < players.length; i++){
            if(msg === players[i] || online[i]){
                online[i] = true;
                io.emit("player-online", i);
            } else{
                online[i] = false;
                console.log(i);
                io.emit("player-offline", i);
            }
        }
    });
    socket.on('disconnect', function(msg) {
        online = [false, false, false, false, false, false];
        io.emit("hello");
        console.log("user disconnected ");
    });
    // Sending back if player is connected

})