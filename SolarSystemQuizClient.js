window.onload = function() {
    title = $(document).find("title").text();    
    console.log("Active page: " + title);
    checkOnline();
    updateOnlineUserList();
}

function updateLeaderboards() {
    console.log("Updating leaderboards.");

    var socket = io();

    socket.emit("fetch user wins");

    socket.on("user wins list", function(username, wins) {

        console.log("User: + " + username + " wins are: " + wins);
    
        let tableUsername = username;
        let tableWins = wins;

        console.log("Table username: " + tableUsername);
        console.log("Table wins: " + tableWins);

        var row = $("<tr>");
        row.append($("<td>" + tableUsername + "</td><td>" + tableWins + "</td>"));
        $("#leaderboardsTable").append(row);

    });
}

function addRow() {
    var moduleName = "346565343456";
    var moduleWeight = "345643565436";

    console.log("Console name: " + moduleName);
    console.log("Console weight: " + moduleWeight);

    var table = document.getElementById("gradeTable");
    var row = table.insertRow(table.rows.length);

    var cell1 = row.insertCell(0);
    var t1 = document.createElement("text");
    t1.value = moduleName;
    cell1.appendChild(t1);

    var cell2 = row.insertCell(1);
    var t2 = document.createElement("text");
    t2.value = moduleWeight;
    cell2.appendChild(t2);
}

function updateOnlineUserList() {
    console.log("Updating online user list...");

    var socket = io();

    socket.emit("fetch online users");

    socket.on("online user list", function(msg) {
        $("#onlineUsers").empty();
        for(var i = 0; i < msg.length; i++) {
            var element = msg[i].Username;
            console.log("Username to be added to online list: " + JSON.stringify(element));            
            $("#onlineUsers").append($(`<li class="list-group-item d-flex justify-content-between align-items-center">`).text(element));
        }       
    });
}

function logoutUser() {
    var username = localStorage.getItem("Username");
    setOnlineStatus(false, username);

    localStorage.removeItem("Username");

    console.log("Username reset and current user has been logged out.");
    $("#logoutModal").modal("show");
    $("#logoutModal").on("hidden.bs.modal", function() {
        goToLoginPage();
    });
}

function checkOnline() {
    var username = localStorage.getItem("Username");
    if (navigator.onLine === true) {
        console.log("A user is online.")
        if (localStorage.getItem("Username") == null) {
            console.log("User is not logged in yet.");
        } else {
            console.log("User is logged in as: " + username);
            if (document.getElementById("welcomeHeader") != null) {
                document.getElementById("welcomeHeader").innerHTML = "Welcome, " + username;
            }

            setOnlineStatus(true, username);
        }
    } else {
        console.log("No user is online.")
    }
}

function setOnlineStatus(isOnline, username) {

    var socket = io();
    var userOnline = {
        _id: String(username),
        Online: isOnline,
    };
    
    console.log("Is the user online: " + isOnline + " Username: " + username);

    socket.emit("set online", userOnline);

    socket.on("user online success", function() {
        console.log(username + " is now ONLINE.");
    });

    socket.on("user offline success", function() {
        console.log(username + " is now OFFLINE.");
    });
}

$("startQuizButton").click(function() {
    console.log("Start quiz button clicked.");
    $("#startQuizModal").modal("show");
    runQuiz();
});

function runQuiz() {

    console.log("Quiz has been run.");

    const questionList = [
        {
        question: "What is 2 x 4?",
        answers: {
            a: "3",
            b: "6",
            c: "8"
        },
        correctAnswer: "c"
        },
        {
        question: "What is 7 x 2?",
        answers: {
            a: "14",
            b: "4",
            c: "46"
        },
        correctAnswer: "a"
        },
        {
        question: "What is 3 x 5?",
        answers: {
            a: "20",
            b: "35",
            c: "15",
        },
        correctAnswer: "c"
        }
    ];
    
    function showResults() {

        var answerContainers = quizContainer.querySelectorAll(".answers");
        var correctAnswers = 0;

        questionList.forEach((currentQuestion, questionNumber) => {
            var answerContainer = answerContainers[questionNumber];
            var selector = `input[name=question${questionNumber}]:checked`;
            var userAnswer = (answerContainer.querySelector(selector) || {}).value;
    
            if (userAnswer === currentQuestion.correctAnswer) {
                correctAnswers++;      
            answerContainers[questionNumber].style.color = "lightgreen";
            } else {
                answerContainers[questionNumber].style.color = "red";
            }
        });

        resultsContainer.innerHTML = "You got " + correctAnswers + " out of " + questionList.length + " answers correct.";
    }
    
    function changeQuestion(n) {
        slides[currentSlide].classList.remove("currentSlide");
        slides[n].classList.add("currentSlide");
        currentSlide = n;
        
        if (currentSlide === 0) {
            previousButton.style.display = "none";
        } else {
            previousButton.style.display = "inline-block";
        }
        
        if (currentSlide === slides.length - 1) {
            nextButton.style.display = "none";
        } else {
            nextButton.style.display = "inline-block";
        }
    }
    
    function nextQuestion() {
        changeQuestion(currentSlide + 1);
    }
    
    function previousQuestion() {
        changeQuestion(currentSlide - 1);
    }
    
    var quizContainer = document.getElementById("mainQuizContent");
    var resultsContainer = document.getElementById("results");
    var submitButton = document.getElementById("submitQuizAnswers");

    // Create the quiz from the answers specified above.
    buildQuiz();
    
    var previousButton = document.getElementById("previousQuestion");
    var nextButton = document.getElementById("nextQuestion");
    var slides = document.querySelectorAll(".slide");
    var currentSlide = 0;
    
    // Start on the first question.
    changeQuestion(0);
    
    submitButton.addEventListener("click", showResults);
    previousButton.addEventListener("click", previousQuestion);
    nextButton.addEventListener("click", nextQuestion);

    function buildQuiz() {
        
        console.log("Quiz is being constructed...");

        var renderedHTML = [];

        questionList.forEach((currentQuestion, questionNumber) => {

            var answers = [];

            for (letter in currentQuestion.answers) {                
                // Each answer is added to the array using template literals so HTML formatting and JavaScript variable can be added easily.
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}"> ${currentQuestion.answers[letter]}
                    </label>`
                );
            }
    
            // Add current question and answers to the output modal, again using template literals.
            renderedHTML.push(
                `<div class="slide">
                    <div class="question"> ${currentQuestion.question} </div>
                    <div class="answers"> ${answers.join("")} </div>
                </div>`
            );
        });
        quizContainer.innerHTML = renderedHTML.join("");
    }
}

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
        $("#chatWindowMessageHistory").append($("<li>").text(localStorage.getItem("Username") + msg));
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

    socket.on("incorrectPassword", function() {
        console.log("Incorrect password has been entered.");
        $("#loginModal").find(".modal-body").append("\nIncorrect password entered for: " + "<h4>" + username + "</h4>" + "Please try again.");
    })
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
        Online: false,
        Wins: 0
    };
    
    socket.emit("add user", User);

    socket.on("postSuccessful", function() {
        $("#registerModal").modal("hide");
        $("#successfulRegistrationModal").modal("show");
    });

    socket.on("userExists", function() {
        $("#registerModal").modal("hide");
        $("#registerModal").find(".modal-body").append("\nA user with the name of: " + "<h4>" + username + "</h4> already exists. Please try again.");
    });
}

function deleteDatabase() {
    console.log("Cleint is attempting to delete the database...");
    var socket = io();
    socket.emit("delete database");

    socket.on("deleteSuccessful", function() {
        console.log("-------------------------------------------------");
        console.log("Database was deleted successfully. Please restart your server and browser to continue.");
        console.log("-------------------------------------------------");
    });

    socket.on("deleteUnsuccessful", function() {
        console.log("-------------------------------------------------");
        console.log("The database was not deleted due to an error. Please restart your server and browser and try again.");
        console.log("-------------------------------------------------");
    });
}

function goToLeaderboardPage() {
    console.log("BEFORE");
    window.location.href = "/Leaderboard";
    console.log("AFTER");
    updateLeaderboards();
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
