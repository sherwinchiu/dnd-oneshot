const port = 25565;
const express = require ("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

server.listen(port);

app.use(express.static(__dirname+"/client"));
app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(__dirname+"/client/index.html");
});
console.log("Server started on port "+port);

io.sockets.on('connection', function(socket){
    socket.log("user connected");
    
})