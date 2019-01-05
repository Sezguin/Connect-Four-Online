var express = require('express')
var http = require('http');
var PouchDB = require('pouchdb');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

var mainPage = "/"
var userDatabase = new PouchDB("Users");
var remoteCouch = false;

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

// Adding all PouchDB dependencies.
app.get("/pouchdb-7.0.0.min.js", function(req, res) {
    res.sendFile(__dirname + "/pouchdb-7.0.0.min.js");
});

// Adding all external resources.
app.get("/Images/WhiteBackground.png", function(req, res) {
  res.sendFile(__dirname + "/Images/WhiteBackground.png")
});
app.get("/Images/GreyBackground.png", function(req, res) {
  res.sendFile(__dirname + "/Images/GreyBackground.png")
});
app.get("/QuizQuestions.json", function(req, res) {
    res.sendFile(__dirname + "/QuizQuestions.json");
})

// SocketIO functions.
io.on("connection", function(socket){
    console.log("A user has connected.");

    socket.on("disconnect", function(){
        console.log("user disconnected");
    });

    socket.on("chat message", function(msg){
        io.emit("chat message", msg);
    });

    socket.on("add user", function(msg) {
        console.log(msg);

        userDatabase.put(msg, function callback(err, result) {
            if (!err) {
                console.log("------------------- Successfully posted to database. -------------------");
                showUserDatabaseInformation();
                io.sockets.emit("postSuccessful");
            } else {
                console.log("------------------- The post to the database was unsuccessful, the user already exzists. -------------------");
                io.sockets.emit("userExists");
            }
        });
    });

    socket.on("login user", function(msg) {
        var id = String(msg._id);
        var username = msg.Username;
        var password = msg.Password;

        console.log("Sent message: " + msg);

        console.log("Sent ID = " + id);
        console.log("Sent username = " + username);
        console.log("Sent password = " + password);

        userDatabase.get(id, function(err, doc) {
            if(err) {
                console.log(err);
                console.log("------------------- User does not exists in the database. -------------------");
                io.sockets.emit("incorrectUserLogin");
            } else {
                console.log(doc);
                console.log("------------------- User exists in the database. -------------------");
                console.log("********" + doc.Username + "  " + doc.Password);
                if((doc.Username == username) && (doc.Password == password)) {
                    console.log("------------------- Correct login information supplied. -------------------");
                    io.sockets.emit("correctUserLogin");
                } else {
                    console.log("------------------- Incorrect login informaiton supplied -------------------");
                    io.sockets.emit("incorrectPassword");
                }                
            }
        });
    });
});

function showUserDatabaseInformation() {
    userDatabase.info().then(function (info) {
        console.log(info);
    });
}

server.listen(port, function(){
  console.log("Connect Four Online Server is listening on port: " + port);
});
