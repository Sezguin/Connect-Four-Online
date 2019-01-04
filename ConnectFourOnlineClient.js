function openChatWindow() {
    document.getElementById("chatWindow").style.display = "block";
}

function closeChatWindow() {
    document.getElementById("chatWindow").style.display = "none";
}

$(function () {
    var socket = io();
    $("form").submit(function () {
        socket.emit("chat message", $("#chatMessageToSend").val());
        $("#chatMessageToSend").val("");
        return false;
    });

    $("registrationModalRegisterButton").submit(function() {
        console.log("SUBMIT");
    });

    socket.on("chat message", function (msg) {
        $("#chatWindowMessageHistory").append($("<li>").text(msg));
    });
});

function validateLoginDetails() {
    console.log("Entered validate login details.")
    var localUsername = document.getElementById("loginUsername").value;
    var localPassword = document.getElementById("loginPassword").value;

    checkDatabaseLoginDetails(localUsername, localPassword);
}

function checkDatabaseLoginDetails(username, password) {
    console.log("Entered check login details.")
    var socket = io();
    var User = {
        _id: String(username),
        Username: username,
        Password: password,
    };

    socket.emit("login user", User);

    socket.on("correctUserLogin", function() {
        localStorage.setItem("Username", username);
        console.log("Username has been set to: " + localStorage.getItem("Username"));
        $("#loginModal").modal("hide");
        $("#successfulLoginModal").modal("show");
    });

    socket.on("incorrectUserLogin", function() {
        $("#loginModal").modal("hide");
        $("#unsuccessfulLoginModal").modal("show");
    });
}

function registerLoginDetails() {
    var localUsername = document.getElementById("registrationUsername").value;
    var localEmail = document.getElementById("registrationEmail").value;
    var localPassword = document.getElementById("registrationPassword").value;

    insertDataIntoDatabase(localUsername, localEmail, localPassword);
}

function insertDataIntoDatabase(username, email, password) {
    var socket = io();
    var User = {
        _id: String(username),
        Username: username,
        Email: email,
        Password: password,
        Wins: 0
    };
    
    socket.emit("add user", User);

    socket.on("postSuccessful", function() {
        $("#registerModal").modal("hide");
        $("#successfulRegistrationModal").modal("show");
    });

    socket.on("userExists", function() {
        $("#registerModal").modal("hide");
        $("#unsuccessfulRegistrationModal").modal("show");
    });
}

function goToHomePage() {
    window.location.href = "/HomePage";
}

function goToHowToPlayPage() {
    window.location.href = "/HowToPlayPage";
}

function goToLoginPage() {
    window.location.href = "/LoginPage";
}

function goToProfilePage() {
    window.location.href = "/ProfilePage";
}
