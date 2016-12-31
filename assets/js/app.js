// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-mO2GqnEuI9hCNUsIQclDk4-c6P0EX40",
    authDomain: "rock-paper-scissors-eaba0.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-eaba0.firebaseio.com",
    storageBucket: "rock-paper-scissors-eaba0.appspot.com",
    messagingSenderId: "418012308991"
};

firebase.initializeApp(config);

var database = firebase.database();
var name1 = false;
var name2 = false;
var userChoice1 = "";
var userChoice2 = "";
var wins = 0;
var turn = 0;
var playNum = false;
var choiceImg = "";
var otherPlayerImg = "";
var resetTurn = function() {
    database.ref().child("turn").set(1);
};

//sets userchoice image
var chooseImg1 = function() {
    if (userChoice1 === "Rock") {
        choiceImg = "<img src='assets/images/rock.png'>";
    } else if (userChoice1 === "Paper") {
        choiceImg = "<img src='assets/images/paper.png'>";
    } else if (userChoice1 === "Scissors") {
        choiceImg = "<img src='assets/images/scissors.png'>";
    }
};

var chooseImg2 = function() {
    if (userChoice2 === "Rock") {
        choiceImg = "<img src='assets/images/rock.png'>";
    } else if (userChoice2 === "Paper") {
        choiceImg = "<img src='assets/images/paper.png'>";
    } else if (userChoice2 === "Scissors") {
        choiceImg = "<img src='assets/images/scissors.png'>";
    }
};

var connectionsRef = database.ref("/Players");
var connectedRef = database.ref(".info/connected");


$("#rps1").hide();
$("#rps2").hide();
$("#score1").hide();
$("#score2").hide();
$("#leftBox").hide();
$("#middleBox").hide();
$("#rightBox").hide();
$("#chatBox").hide();
$("#chatEnter").hide();

//user registers name and the gamem initializes
$("#userName").on("click", function() {
    event.preventDefault();

    $("#score1").show();
    $("#score2").show();
    $("#leftBox").show();
    $("#middleBox").show();
    $("#rightBox").show();
    $("#chatBox").show();
    $("#chatEnter").show();

    //assigns player1 and player2
    connectionsRef.on("value", function(snap) {

        if (snap.numChildren() === 0) {
            name1 = $("#userName-input").val().trim();
            playNum = 1;
            $("#topRow").empty();
            $("#topRow").append("<h1>Hi " + name1 + "! You're Player " + playNum + "</h1>");
            connectionsRef.child("1").set({
                name: name1,
                wins: wins,
                userChoice: userChoice1
            });
            connectionsRef.child("1").onDisconnect().remove();
            database.ref().child("chat").set("Trash Talk-O-Matic 3000");
            database.ref().child("chat").onDisconnect().remove();
        } else if (snap.numChildren() === 1 && !playNum) {
            name2 = $("#userName-input").val().trim();
            playNum = 2;
            turn = 1;
            database.ref().child("turn").set(turn);
            $("#topRow").html("<h1>Hi " + name2 + "! You're Player " + playNum + "</h1>");
            connectionsRef.child("2").set({
                name: name2,
                wins: wins,
                userChoice: userChoice2
            });
            connectionsRef.child("2").onDisconnect().remove();
            database.ref().child("turn").onDisconnect().remove();
        }
    });
});

//submit chat input to chat child of database
$("#chatSubmit").on("click", function() {
    event.preventDefault();
    if (playNum === 1) {
        var text = name1 + ": " + $("#chat-input").val().trim();
        database.ref().child("chat").push(text);
    } else if (playNum === 2) {
        var text = name2 + ": " + $("#chat-input").val().trim();
        database.ref().child("chat").push(text);
    }
});

//add chat text to #chatBox
database.ref().child("chat").on("child_added", function(snap) {
    $("#chatBox").append("<br><p>" + snap.val() + "</p>");
    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    $("form").trigger("reset");
});


connectionsRef.on("value", function(snap) {

    if (snap.numChildren() === 1) {
        $("#name1").html("<h1>" + snap.child("1").val().name + "</h1>");
        $("#name2").html("<h1>Waiting for Player 2</h1>");
    } else if (snap.numChildren() === 2) {
        $("#name1").html("<h1>" + snap.child("1").val().name + "</h1>");
        $("#name2").html("<h1>" + snap.child("2").val().name + "</h1>");
    }
});

database.ref().on("value", function(snap) {
    count1 = snap.child("Players/1").val().wins;
    count2 = snap.child("Players/2").val().wins;

    //set wins
    $("#score1").html("<h3>Wins: </h3>" + "<ol id='count1'></ol>");
    $("#score2").html("<h3>Wins: </h3>" + "<ol id='count2'></ol>");

    //animates tally marks
    for (var i = 0; i < count1; i++){
      $("#count1").append("<li class='tally'></li>");
    }
    //every fifth tally mark
    for (var j = 0; j < count2; j++){
      $("#count2").append("<li class='tally'></li>");
    }

    //set turns
    if (playNum === 1 && snap.val().turn === 1) {
        database.ref().child("Players/1/wins").set(wins);
        $("#rps1").show();
        $("#rps2").hide();
        $("#middleMessage").html("<h1>It's your turn " + name1 + ".</h1>");
        $("#leftBox").css("border", "5px solid green");
        $("#leftBox").css("box-shadow", "5px 10px 5px #888888");
        $("#rightBox").css("border", "5px solid black");
        $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
        $("#rps1").css("padding-top", "0px");
        $("#rps1").html("<ul><li><img src='assets/images/rock.png' data='Rock'></li><li><img src='assets/images/paper.png' data='Paper'></li><li><img src='assets/images/scissors.png' data='Scissors'></li></ul>");
    } else if (playNum === 1 && snap.val().turn === 2) {
        $("#middleMessage").html("<h1>Waiting for " + snap.child("Players/2").val().name + " to choose.</h1>");
        $("#rightBox").css("border", "5px solid green");
        $("#rightBox").css("box-shadow", "5px 10px 5px #888888");
        $("#leftBox").css("border", "5px solid black");
        $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
    } else if (playNum === 1 && !snap.val().turn) {
        $("#rps1").hide();
        $("#leftBox").css("border", "5px solid black");
        $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
        $("#topBox").html("<h1>Hi " + name1 + "! You're Player " + playNum + ".</h1>");
    } else if (playNum === 2 && snap.val().turn === 2) {
        $("#rps2").show();
        $("#middleMessage").html("<h1>It's your turn " + name2 + ".</h1>");
        $("#rightBox").css("border", "5px solid green");
        $("#rightBox").css("box-shadow", "5px 10px 5px #888888");
        $("#leftBox").css("border", "5px solid black");
        $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
        $("#rps2").css("padding-top", "0px");
        $("#rps2").html("<ul><li><img src='assets/images/rock.png' data='Rock'></li><li><img src='assets/images/paper.png' data='Paper'></li><li><img src='assets/images/scissors.png' data='Scissors'></li></ul>");
    } else if (playNum === 2 && snap.val().turn === 1) {
        database.ref().child("Players/2/wins").set(wins);
        $("#rps1").hide();
        $("#middleMessage").html("<h1>Waiting for " + snap.child("Players/1").val().name + " to choose.</h1>");
        $("#leftBox").css("border", "5px solid green");
        $("#leftBox").css("box-shadow", "5px 10px 5px #888888");
        $("#rightBox").css("border", "5px solid black");
        $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
        $("#rps2").empty();
    }

    //player selection
    $(document).on("click", "img", function() {
        if (playNum === 1) {
            userChoice1 = $(this).attr("data");
            chooseImg1();
            database.ref().child("Players/1/userChoice").set(userChoice1);
            database.ref().child("turn").set(2);
            $("#rps1").html(choiceImg);
            $("#rps1").css("padding-top", "10px");
            $("img").css("max-height", "125px");
        } else if (playNum === 2) {
            userChoice2 = $(this).attr("data");
            chooseImg2();
            $("rps1").html("<h1>" + userChoice2 + "<h1>");
            database.ref().child("Players/2/userChoice").set(userChoice2);
            database.ref().child("turn").set(3);
            $("#rps2").html(choiceImg);
            $("#rps2").css("padding-top", "10px");
            $("img").css("max-height", "125px");
        }
    });

    //user choices compared
    if (snap.val().turn === 3) {
        //delay reset of game
        setTimeout(resetTurn, 4000);

        if (playNum === 1) {

            if (snap.child("Players/2").val().userChoice === "Rock") {
                otherPlayerImg = "<img src='assets/images/rock.png' style='max-height: 125px'>";
            } else if (snap.child("Players/2").val().userChoice === "Scissors") {
                otherPlayerImg = "<img src='assets/images/scissors.png' style='max-height: 125px'>";
            } else if (snap.child("Players/2").val().userChoice === "Paper") {
                otherPlayerImg = "<img src='assets/images/paper.png' style='max-height: 125px'>";
            }
            $("#rps2").html(otherPlayerImg);
        } else if (playNum === 2) {
            if (snap.child("Players/1").val().userChoice === "Rock") {
                otherPlayerImg = "<img src='assets/images/rock.png'>";
            } else if (snap.child("Players/1").val().userChoice === "Scissors") {
                otherPlayerImg = "<img src='assets/images/scissors.png'>";
            } else if (snap.child("Players/1").val().userChoice === "Paper") {
                otherPlayerImg = "<img src='assets/images/paper.png'>";
            }
            $("#rps1").html(otherPlayerImg);
        }

        //results of tie
        if (snap.child("Players/1").val().userChoice === snap.child("Players/2").val().userChoice) {
            $("#middleMessage").html("<h1>It's a Tie!</h1>");
            $("#rps1").show();
            $("#rps1").css("padding-top", "10px");
            $("#rps2").show();
            $("#rps2").css("padding-top", "10px");
            $("#rightBox").css("border", "5px solid black");
            $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
        }
        setTimeout(resetTurn, 4000);

        var play1Wins = function(){
          wins++;
          $("#rps2").css("padding-top", "10px");
          $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
          $("#leftBox").css("border", "5px solid yellow");
          $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
          $("#rightBox").css("border", "5px solid black");
          $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
        };

        var play1Loses = function(){
          $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
          $("#rps2").css("padding-top", "10px");
          $("#rightBox").css("border", "5px solid yellow");
          $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
          $("#leftBox").css("border", "5px solid black");
          $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
        };

        var play2Wins = function(){
          wins++;
          $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
          $("#rps1").css("padding-top", "10px");
          $("#rightBox").css("border", "5px solid yellow");
          $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
          $("#leftBox").css("border", "5px solid black");
          $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
        };

        var play2Loses = function(){
          $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
          $("#rps1").css("padding-top", "10px");
          $("#leftBox").css("border", "5px solid yellow");
          $("#leftBox").css("box-shadow", "0px 0px 0px #888888");
          $("#rightBox").css("border", "5px solid black");
          $("#rightBox").css("box-shadow", "0px 0px 0px #888888");
        };

        //player 1 game logic
        if (playNum === 1) {

            $("#rps2").show();

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                play1Wins();
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                play1Loses();
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                play1Loses();
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                play1Wins();
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                play1Wins();
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                play1Loses();
            }
        //player 2 game logic
        } else if (playNum === 2) {

          $("#rps1").show();

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                play2Loses();
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                play2Wins();
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                play2Wins();
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                play2Loses();
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                play2Loses();
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                play2Wins();
            }
        }
    }
});
