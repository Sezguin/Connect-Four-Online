var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;
var mainPage = "/"

// Adding all HTML files.
app.get("/LoginPage", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineLoginPage.html");
});
app.get("/HomePage", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineHomePage.html");
});
app.get("/HowToPlayPage", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineHowToPlayPage.html");
});
app.get("/TestsPage", function(req, res) {
  res.sendFile(__dirname + "/ConnectFourOnlineTestsPage.html")
})

// Adding all CSS files.
app.get("/ConnectFourOnlineClient.css", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.css");
});

// Adding all JavaScript files.
app.get("/ConnectFourOnlineClient.js", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineClient.js");
});
app.get("/ConnectFourOnlineTests.js", function(req, res) {
    res.sendFile(__dirname + "/ConnectFourOnlineTests.js");
});

// Adding all QUnit dependencies.
app.get("/qunit-2.4.0.js", function(req, res) {
  res.sendFile(__dirname + "/qunit-2.4.0.js")
});
app.get("/qunit-2.4.0.css", function(req, res) {
    res.sendFile(__dirname + "/qunit-2.4.0.css");
});

// Adding all external resources.
app.get("/Images/WhiteBackground.png", function(req, res) {
  res.sendFile(__dirname + "/Images/WhiteBackground.png")
});
app.get("/Images/GreyBackground.png", function(req, res) {
  res.sendFile(__dirname + "/Images/GreyBackground.png")
});



// SocketIO functions.
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
