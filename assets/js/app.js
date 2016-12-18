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
var name = false;
var userChoice1 = "";
var userChoice2 = "";
var losses = 0;
var wins = 0;
var turn = 0;
var playNum = false;
var resetTurn = function() {
    database.ref().child("turn").set(1);
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

$("#userName").on("click", function() {
    event.preventDefault();

    $("#score1").show();
    $("#score2").show();
    $("#leftBox").show();
    $("#middleBox").show();
    $("#rightBox").show();
    $("#chatBox").show();
    $("#chatEnter").show();

    name = $("#userName-input").val().trim();

    //assigns player1 and player2
    connectionsRef.on("value", function(snap) {
        if (snap.numChildren() === 0) {
            playNum = 1;
            $("#topRow").empty();
            $("#topRow").append("<h2>Hi " + name + "! You're Player " + playNum + "</h2>");
            connectionsRef.child("1").set({
                name: name,
                losses: losses,
                wins: wins,
                userChoice: userChoice1
            });
            connectionsRef.child("1").onDisconnect().remove();
        } else if (snap.numChildren() === 1 && !playNum) {
            playNum = 2;
            turn = 1;
            database.ref().child("turn").set(turn);
            $("#topRow").html("<h2>Hi " + name + "! You're Player " + playNum + "</h2>");
            connectionsRef.child("2").set({
                name: name,
                losses: losses,
                wins: wins,
                userChoice: userChoice2
            });
            connectionsRef.child("2").onDisconnect().remove();
            database.ref().child("turn").onDisconnect().remove();
        }
    });

});


connectionsRef.on("value", function(snap) {

    if (snap.numChildren() === 1) {
        $("#name1").html("<h2>" + snap.child("1").val().name + "</h2>");
        $("#name2").html("<h2>Waiting for Player 2</h2>");
    } else if (snap.numChildren() === 2) {
        $("#name1").html("<h2>" + snap.child("1").val().name + "</h2>");
        $("#name2").html("<h2>" + snap.child("2").val().name + "</h2>");
    }
});

database.ref().on("value", function(snap) {

    $("#score1").html("<p>Wins: " + snap.child("Players/1").val().wins + " Losses: " + snap.child("Players/1").val().losses + "</p>");
    $("#score2").html("<p>Wins: " + snap.child("Players/2").val().wins + " Losses: " + snap.child("Players/2").val().losses + "</p>");
    if (playNum === 1 && snap.val().turn === 1) {
        database.ref().child("Players/1/wins").set(wins);
        database.ref().child("Players/1/losses").set(losses);
        $("#rps1").show();
        $("#rps2").hide();
        $("#middleMessage").html("<h2>It's your turn " + name + ".</h2>");
        $("#leftBox").css("border", "3px solid yellow");
        $("#rightBox").css("border", "3px solid black");
        $("#rps1").css("padding-top", "0px");
        $("#rps1").html("<ul><li data='Rock'><h3>Rock</h3></li><li data='Paper'><h3>Paper</h3></li><li data='Scissors'><h3>Scissors</h3></li></ul>");
    } else if (playNum === 1 && snap.val().turn === 2) {
        $("#middleMessage").html("<h2>Waiting for " + snap.child("Players/2").val().name + " to choose.</h2>");
        $("#rightBox").css("border", "3px solid yellow");
        $("#leftBox").css("border", "3px solid black");
    } else if (playNum === 1 && !snap.val().turn) {
        $("#rps1").hide();
        $("#leftBox").css("border", "3px solid black");
        $("#topBox").html("<h2>Hi " + name + "! You're Player " + playNum + ".</h2>");
    } else if (playNum === 2 && snap.val().turn === 2) {
        $("#rps2").show();
        $("#middleMessage").html("<h2>It's your turn " + name + ".</h2>");
        $("#rightBox").css("border", "3px solid yellow");
        $("#leftBox").css("border", "3px solid black");
        $("#rps2").css("padding-top", "0px");
        $("#rps2").html("<ul><li data='Rock'><h3>Rock</h3></li><li data='Paper'><h3>Paper</h3></li><li data='Scissors'><h3>Scissors</h3></li></ul>");
    } else if (playNum === 2 && snap.val().turn === 1) {
        database.ref().child("Players/2/wins").set(wins);
        database.ref().child("Players/2/losses").set(losses);
        $("#rps1").hide();
        $("#middleMessage").html("<h2>Waiting for " + snap.child("Players/1").val().name + " to choose.</h2>");
        $("#leftBox").css("border", "3px solid yellow");
        $("#rightBox").css("border", "3px solid black");
        $("#rps2").empty();
    }

    $(document).on("click", "li", function() {
        if (playNum === 1) {
            userChoice1 = $(this).attr("data");
            database.ref().child("Players/1/userChoice").set(userChoice1);
            database.ref().child("turn").set(2);
            $("#rps1").html("<h1>" + userChoice1 + "<h1>");
            $("#rps1").css("padding-top", "45px");
        } else if (playNum === 2) {
            userChoice2 = $(this).attr("data");
            $("rps1").html("<h1>" + userChoice2 + "<h1>");
            database.ref().child("Players/2/userChoice").set(userChoice2);
            database.ref().child("turn").set(3);
            $("#rps2").html("<h1>" + userChoice2 + "<h1>");
            $("#rps2").css("padding-top", "45px");
        }
    });

    if (snap.val().turn === 3) {

      setTimeout(resetTurn, 4000);

        if (snap.child("Players/1").val().userChoice === snap.child("Players/2").val().userChoice) {
            $("#middleMessage").html("<h1>It's a Tie!</h1>");
            $("#rps1").show();
            $("#rps1").css("padding-top", "45px");
            $("#rps2").show();
            $("#rps2").css("padding-top", "45px");
            $("#rightBox").css("border", "3px solid black");
            $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
            $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
            setTimeout(resetTurn, 4000);
        }
        if (playNum === 1) {

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            }
        } else if (playNum === 2) {

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "6px solid green");
                $("#rightBox").css("border", "3px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "6px solid green");
                $("#leftBox").css("border", "3px solid black");
            }
        }

    }

});
