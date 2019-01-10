window.onload = function() {
    title = $(document).find("title").text();    
    console.log("Active page: " + title);
    checkOnline();
    updateOnlineUserList();
}

// Refresh the leaderboard statistics.
function updateLeaderboards() {
    console.log("Updating leaderboards.");

    $('#leaderboardsTable tbody').empty();

    var socket = io();

    socket.emit("fetch user wins");

    socket.on("user wins list", function(username, wins) {

        console.log("User: " + username + " wins are: " + wins);
    
        let tableUsername = username;
        let tableWins = wins;

        console.log("Table username: " + tableUsername);
        console.log("Table wins: " + tableWins);

        var row = $("<tr>");
        row.append($("<td>" + tableUsername + "</td><td>" + tableWins + "</td>"));
        $("#leaderboardsTable").append(row);

        sortTable();

    });
}

// Custom function for ordering the table by most wins first.
function sortTable() {
    console.log("Sorting table into order of wins.");

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("leaderboardsTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];

            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// Update online users and add to container.
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

// Logout user - calls set online with false perameter.
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

// Generic function for checking online status.
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

// Generic functino to set the user's online status.
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

// Initial the quiz on the button press.
$("startQuizButton").click(function() {
    console.log("Start quiz button clicked.");
    $("#startQuizModal").modal("show");
    runQuiz();
});

// Start running the quiz logic.
function runQuiz() {

    console.log("Quiz has been run.");

    const questionList = [
        {
            question: "What is the largest planet is our solar system?",
            answers: {
                a: "Mars",
                b: "Saturn",
                c: "Jupiter"
            },
            correctAnswer: "c"
        },
        {
        question: "What is the hottest planet in the solar system?",
            answers: {
                a: "Venus",
                b: "Mercury",
                c: "Neptune"
            },
            correctAnswer: "a"
        },
        {
        question: "Which of these is a moon of Saturn?",
            answers: {
                a: "Ganymede",
                b: "Europa",
                c: "Enceladus",
            },
        correctAnswer: "c"
        },
        {
        question: "Which moon has the most water on?",
            answers: {
                a: "Titan",
                b: "Ganymede",
                c: "Dione",
            },
        correctAnswer: "b"
        },
        {
        question: "Which planet has the most moons?",
            answers: {
                a: "Earth",
                b: "Jupiter",
                c: "Saturn",
            },
        correctAnswer: "b"
        },
        {
        question: "Which planet is the coldest?",
            answers: {
                a: "Pluto",
                b: "Uranus",
                c: "Neptune",
            },
        correctAnswer: "c"
        },
        {
        question: "How many planets are the in the solar system?",
            answers: {
                a: "8",
                b: "9",
                c: "10",
            },
        correctAnswer: "a"
        },
        {
        question: "How far is Earth from the Sun?",
            answers: {
                a: "About 120 million kilometers.",
                b: "About 150 million kilometers.",
                c: "About 200 million kilometers.",
            },
        correctAnswer: "b"
        },
        {
        question: "Why is Pluto not a planet?",
            answers: {
                a: "It smells too awful.",
                b: "It's too small.",
                c: "It's too far away.",
            },
        correctAnswer: "b"
        },
        {
        question: "What planet has life on it?",
            answers: {
                a: "The Moon",
                b: "Mars",
                c: "Earth",
            },
        correctAnswer: "c"
        }        
    ];
    
    // Display results once the submit button is pressed.
    function showResults() {

        var answerContainers = quizContainer.querySelectorAll(".answers");
        var correctAnswers = 0;

        var socket = io();
        var user = String(localStorage.getItem("Username"));
        console.log("Updating results for user: " + user);

        // Loop through each question and check for correct answer match.
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

        // If all 10 questions are correct, award a win.
        if (correctAnswers == 10) {
            console.log("The user got all 10 questions right, the has a win!");
            resultsContainer.innerHTML = "You got all the questions right! You have been awarded a win for you efforts.";
            $("#startQuizModal").modal("hide");
            $("#winModal").modal("show");

            socket.emit("set wins", user);

        } else {
            console.log("User got some questions wrong...");
            resultsContainer.innerHTML = "You got " + correctAnswers + " out of " + questionList.length + " answers correct.";
        }

        // Sockets to recieve updated from server regarding data input.
        socket.on("user wins success", function() {
            console.log("The user wins were upodated successfully.");
        });

        socket.on("user wins fail", function() {
            console.log("There was an error when updating the user wins.");
        });
    }

    // Change the question slide.
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
    
    // Go to next question.
    function nextQuestion() {
        changeQuestion(currentSlide + 1);
    }
    
    // Go back to previous question.
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

    //Build quiz function - build from previously defined question bank.
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

//Open and close chat window.
function openChatWindow() {
    $("#chatWindow").slideToggle("slow");
}

// Function for broadcasting chat message to server.
$(function() {
    var socket = io();
    user = localStorage.getItem("Username");
    $("form").submit(function () {
        socket.emit("chat message", $("#chatMessageToSend").val(), user);
        $("#chatMessageToSend").val("");
        return false;
    });

    socket.on("chat message", function(msg, user) {
        $("#chatWindowMessageHistory").append($("<li>").text(user + ": " + msg));
    });
});

// Login details validation.
function validateLoginDetails() {
    console.log("Entered validate login details.")
    var localUsername = document.getElementById("loginUsername").value;
    var localPassword = document.getElementById("loginPassword").value;

    checkDatabaseLoginDetails(localUsername, localPassword);
}

// Generic function for checking the login details with the database.
function checkDatabaseLoginDetails(username, password) {
    console.log("Entered check login details.")
    var socket = io();
    var User = factory.create("loginUser", username, password);

    console.log("Returned login user: " + JSON.stringify(User));

    socket.emit("login user", User);

    socket.on("correctUserLogin", function() {
        localStorage.setItem("Username", username);
        console.log("Username has been set to: " + localStorage.getItem("Username"));
        $("#loginModal").modal("hide");
        $("#successfulLoginModal").modal("show");
    });

    socket.on("incorrectUserLogin", function() {
   
        $("#loginInformationLabel").empty();
        $("#loginInformationLabel").css("color", "RED");
        $("#loginInformationLabel").append("\nUser does not exist.");
    });

    socket.on("incorrectPassword", function() {
        console.log("Incorrect password has been entered.");

        $("#loginInformationLabel").empty();
        $("#loginInformationLabel").css("color", "RED");
        $("#loginInformationLabel").append("\nIncorrect password.");
    });
}

// Registering the login details from the modal.
function registerLoginDetails() {
    var localUsername = document.getElementById("registrationUsername").value;
    var localEmail = document.getElementById("registrationEmail").value;
    var localPassword = document.getElementById("registrationPassword").value;

    insertDataIntoDatabase(localUsername, localEmail, localPassword);

}

// Generic function for inserting information into the database.
function insertDataIntoDatabase(username, email, password) {
    var socket = io();

    var User = factory.create("registerUser", username, password, email)

    console.log("User details: " + User);
    
    socket.emit("add user", User);

    socket.on("postSuccessful", function() {
        $("#registerModal").modal("hide");
        $("#successfulRegistrationModal").modal("show");
    });

    socket.on("userExists", function() {        
        $("#registerInformationLabel").empty();
        $("#registerInformationLabel").css("color", "RED");
        $("#registerInformationLabel").append("\nA user already exists with that name.");
    });
}

// Factory pattern for creating users.
factory = {
    create: function (product, username, password, email) {
        console.log("Factory method entered.")
        var user;

        if (product == "registerUser") {
            user = {
                _id: String(username),
                Username: username,
                Email: email,
                Password: password,
                Online: false,
                Wins: 0
            }
        } else if (product == "loginUser") {
            user = {
                _id: String(username),
                Username: username,
                Password: password,
            }
        } else {
            console.log("No object type specified for factory.");
        }

        return user;
    }
}

// Sending delete database instructions to the server.
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

//Page relocation.

function goToTestingPage() {
    window.location.href = "/TestingPage"
}

function goToLeaderboardPage() {
    window.location.href = "/Leaderboard";
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