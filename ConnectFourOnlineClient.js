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

    socket.on("chat message", function (msg) {
        $("#chatWindowMessageHistory").append($("<li>").text(msg));
    });
});

function validateLoginDetails() {
    window.location.href = "/Main";
}

function startProfileCreation() {
    window.location.href = "/Main";
}

function exitToStartMenu() {
    window.location.href = "/Start";
}