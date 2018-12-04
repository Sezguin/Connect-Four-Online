var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var port = 3000;

var mainPage = "/"

app.get("/ConnectFourOnlineClient.js", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.js");
});

app.get("/ConnectFourOnlineClient.css", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.css");
});

app.get("/LoginPage", function(req, res){
    res.sendFile(__dirname + "/ConnectFourOnlineLoginPage.html");
});

app.get("/HomePage", function(req, res){
    res.sendFile(__dirname + "/ConnectFourOnlineHomePage.html");
});

app.get("/HowToPlayPage", function(req, res){
    res.sendFile(__dirname + "/ConnectFourOnlineHowToPlayPage.html");
});

io.on("connection", function(socket){
    console.log("A user has connected.");

    socket.on("disconnect", function(){
        console.log("user disconnected");
    });

    socket.on("chat message", function(msg){
        io.emit("chat message", msg);
    });
});

server.listen(port, function(){
  console.log("Connect Four Online Server is listening on port: " + port);
});