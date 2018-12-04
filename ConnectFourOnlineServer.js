var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = 3000;

var mainPage = "/"

app.get("/ConnectFourOnlineClient.js", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.js");
});

app.get("/ConnectFourOnlineClient.css", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.css");
});

app.get("/Main", function(req, res){
    res.sendFile(__dirname + "/ConnectFourOnlineClient.html");
});

app.get("/Start", function(req, res){
    res.sendFile(__dirname + "/ConnectFourOnlineStartPage.html");
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

http.listen(port, function(){
  console.log("Connect Four Online Server is listening on port: " + port);
});