window.onload = function() {
    console.log("Window loaded.");
    document.getElementById("welcomeHeader").innerHTML = "Welcome, " + localStorage.getItem("Username");
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
