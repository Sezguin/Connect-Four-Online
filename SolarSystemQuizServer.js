var express = require('express')
var http = require('http');
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

var mainPage = "/"
var userDatabase = new PouchDB("Users");
var remoteCouch = false;

// Adding all HTML files.
app.get("/LoginPage", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizLoginPage.html");
});
app.get("/HomePage", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizHomePage.html");
});
app.get("/HowToPlayPage", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizHowToPlayPage.html");
});
app.get("/Leaderboard", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizLeaderboardPage.html");
});
app.get("/TestingPage", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizTestingPage.html");
});

// Adding all CSS files.
app.get("/SolarSystemQuizClient.css", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizClient.css");
});

// Adding all JavaScript files.
app.get("/SolarSystemQuizClient.js", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizClient.js");
});
app.get("/SolarSystemQuizLoginPageTests.js", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizLoginPageTests.js");
});
app.get("/SolarSystemQuizTests.js", function(req, res) {
    res.sendFile(__dirname + "/SolarSystemQuizTests.js");
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
io.on("connection", function(socket) {
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
                socket.emit("postSuccessful");
            } else {
                console.log("------------------- The post to the database was unsuccessful, the user already exzists. -------------------");
                socket.emit("userExists");
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
                socket.emit("incorrectUserLogin");
            } else {
                console.log(doc);
                console.log("------------------- User exists in the database. -------------------");
                console.log("********" + doc.Username + "  " + doc.Password);
                if((doc.Username == username) && (doc.Password == password)) {
                    console.log("------------------- Correct login information supplied. -------------------");
                    socket.emit("correctUserLogin");
                } else {
                    console.log("------------------- Incorrect login informaiton supplied -------------------");
                    socket.emit("incorrectPassword");
                }                
            }
        });
    });

    socket.on("set online", function(msg) {
        console.log("Setting the online status of the user.");

        var id = String(msg._id);
        var online = msg.Online;

        console.log("ID to update: " + id + " Online status is: " + online);

        if (online) {
            console.log("Setting " + id + " to be ONLINE.");

            userDatabase.get(id, function(err, doc) {
                if(err) {
                    console.log("There was an error retrieving the document. See the output below:");
                    console.log(err);
                 } else {
                    console.log("--- Retrieved Document ---");
                    console.log("Revision: " + doc._rev + "ID: " + doc._id + "Online: " + doc.Online);

                    console.log("--- Preparing New Document ---");
                    doc = {
                        _rev: doc._rev,
                        _id: doc._id,
                        Username: doc.Username,
                        Email: doc.Email,
                        Password: doc.Password,
                        Wins: doc.Wins,
                        Online: online, 
                    };

                    console.log("--- New Document ---");
                    console.log("Revision: " + doc._rev + "ID: " + doc._id + "Online: " + doc.Online);

                    userDatabase.put(doc, function(err, doc) {
                        if(err) {
                            console.log("There was an error inserting the document. See the output below:");
                            console.log(err);
                        } else {
                            console.log("Online user document update was successful.");
                            socket.emit("user online success");
                        }
                    });
                 }
            });

        } else if (!online) {
            console.log("Setting " + id + " to be OFFINE.");

            userDatabase.get(id, function(err, doc) {
                if(err) {
                    console.log("There was an error retrieving the document. See the output below:");
                    console.log(err);
                 } else {
                    console.log("--- Retrieved Document ---");
                    console.log("Revision: " + doc._rev + "ID: " + doc._id + "Online: " + doc.Online);

                    console.log("--- Preparing New Document ---");

                    doc = {
                        _rev: doc._rev,
                        _id: doc._id,
                        Username: doc.Username,
                        Email: doc.Email,
                        Password: doc.Password,
                        Wins: doc.Wins,
                        Online: online, 
                    };

                    console.log("--- New Document ---");
                    console.log("Revision: " + doc._rev + "ID: " + doc._id + "Online: " + doc.Online);

                    userDatabase.put(doc, function(err, doc) {
                        if(err) {
                            console.log("There was an error inserting the document. See the output below:");
                            console.log(err);
                        } else {
                            console.log("Offline user document update was successful.");
                            socket.emit("user offline success");
                        }
                    });
                 }
            });
        }

    });

    socket.on("delete database", function() {
        console.log("Attempting to delete database...");
        userDatabase.destroy(function(err) {
            if(err) {
                console.log("There was an error when trying to delete the database. See below: ");
                console.log(err);
                socket.emit("deleteUnsuccessful");
            } else {
                console.log("Database has been deleted successfully. Please restart the server.");
                socket.emit("deleteSuccessful");
            }
        });
    });

    socket.on("fetch user wins", function() {
        console.log("Fetching list of user wins.");
        
        userDatabase.allDocs({
            include_docs: true
        }).then(function(result) {
            var databaseOfUsers = result.rows;
            console.log("Specifics: " + result.rows.doc);
            console.log("The user wins list is: " + JSON.stringify(databaseOfUsers));

            for(var i = 0; i < databaseOfUsers.length; i++) {
                let username = databaseOfUsers[i].doc.Username;
                let wins = databaseOfUsers[i].doc.Wins;

                if(username != null) {
                    console.log("Username from win search: " + JSON.stringify(username));
                    console.log("Wins from win search: " + JSON.stringify(wins));
                    socket.emit("user wins list", username, wins);
                }
            } 
        }).catch(function(err) {
            console.log("There was an error retrieving all documents from the database. See ouput below:");
            console.log(err);
        })
    });

    socket.on("fetch online users", function() {

        console.log("Fetching list of online users.");
        
        userDatabase.createIndex({
            index: {
                fields: ["Online"],
                ddoc: "userOnlineIndex"
            }
        }).then(function() {
            return userDatabase.find({
            selector: {
                Online: true,
            },
            user_index: "userOnlineIndex"
        }).then(function(result) {
                var onlineUsers = result.docs;
                console.log("The online users are: " + JSON.stringify(onlineUsers));
                socket.emit("online user list", onlineUsers);
            });
        });   
    });

    socket.on("set wins", function(msg) {
        
        console.log("Updating the wins of the user.")

        var id = String(msg);

        console.log("User ID to be updated: " + id);

        userDatabase.get(id, function(err, doc) {
            if(err) {
                console.log("There was an error retrieving the document. See the output below:");
                console.log(err);
                } else {

                var wins = doc.Wins;
                console.log("Previous wins: " + wins);

                wins++;
                console.log("Updated wins: " + wins);

                console.log("--- Retrieved Document ---");
                console.log("Revision: " + doc._rev + "ID: " + doc._id + "Wins: " + doc.Wins);

                console.log("--- Preparing New Document ---");
                doc = {
                    _rev: doc._rev,
                    _id: doc._id,
                    Username: doc.Username,
                    Email: doc.Email,
                    Password: doc.Password,
                    Wins: wins,
                    Online: doc.Online, 
                };

                console.log("--- New Document ---");
                console.log("Revision: " + doc._rev + "ID: " + doc._id + "Online: " + doc.Wins);

                userDatabase.put(doc, function(err, doc) {
                    if(err) {
                        console.log("There was an error inserting the document. See the output below:");
                        console.log(err);
                        socket.emit("user wins fail");
                    } else {
                        console.log("Updated user wins document update was successful.");
                        socket.emit("user wins success");
                    }
                });
            }
        });
    });
});

function showUserDatabaseInformation() {
    userDatabase.info().then(function(info) {
        console.log(info);
    });
}

server.listen(port, function(){
  console.log("Solar System Quiz server is listening on port: " + port);
});
