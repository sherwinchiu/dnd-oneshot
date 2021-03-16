/**
 * @fileoverview client side JS
 */
const socket = io.connect();
var players = ["Sherwin", "James", "Glen", "Nicolas", "Lilah", "Sasha"];
var player = prompt("Please enter your name, etc. (James, Nicolas, Glen, Lilah, Sasha)");
socket.emit("player", player);
function start(){
    console.log(socket);
}
 // Server Connection Stuff
socket.on("hello", function(){
    socket.emit("hi", player);
});
socket.on('player-online', function(msg) {
    $(".player")[parseInt(msg)].style.backgroundColor = "green";
});
socket.on('player-offline', function(msg){
    $(".player")[parseInt(msg)].style.backgroundColor = "red";
})
socket.on('login', function(msg){
 
});
