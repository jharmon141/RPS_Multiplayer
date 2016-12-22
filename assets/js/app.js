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
var losses = 0;
var wins = 0;
var turn = 0;
var playNum = false;
var resetTurn = function() {
    database.ref().child("turn").set(1);
};

var connectionsRef = database.ref("/Players");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap){
  if (snap.val() === false && playNum === 2){
    database.ref().child("chat").push(" has disconnect");
  }
});

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

    //assigns player1 and player2
    connectionsRef.on("value", function(snap) {

        if (snap.numChildren() === 0) {
            name1 = $("#userName-input").val().trim();
            playNum = 1;
            $("#topRow").empty();
            $("#topRow").append("<h1>Hi " + name1 + "! You're Player " + playNum + "</h1>");
            connectionsRef.child("1").set({
                name: name1,
                losses: losses,
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
                losses: losses,
                wins: wins,
                userChoice: userChoice2
            });
            // connectionsRef.child("2").onDisconnect(function(){
            //   database.ref().child("chat").push(name2 + " has disconnected.");
            // });
            connectionsRef.child("2").onDisconnect().remove();
            database.ref().child("turn").onDisconnect().remove();
        }
    });

});


//submit chat input to chat child of database
$("#chatSubmit").on("click", function(){
  event.preventDefault();
  if (playNum === 1){
    var text = name1 + ": " + $("#chat-input").val().trim();
    database.ref().child("chat").push(text);
  } else if (playNum === 2){
    var text = name2 + ": " + $("#chat-input").val().trim();
    database.ref().child("chat").push(text);
  }
});

//add chat text to #chatBox
database.ref().child("chat").on("child_added", function(snap){
  $("#chatBox").append("<br><p>" + snap.val() + "</p>");
  $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
  $("form").trigger("reset");
});

// database.ref().child("Players").on("child_removed", function(snap){
//   database.ref().child("chat").push("whatevs");
// });

database.ref().child("turn").onDisconnect(function(){
  database.ref().child("chat").push("something");
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

    //set wins and losses
    $("#score1").html("<h3>Wins: " + snap.child("Players/1").val().wins + " Losses: " + snap.child("Players/1").val().losses + "</h3>");
    $("#score2").html("<h3>Wins: " + snap.child("Players/2").val().wins + " Losses: " + snap.child("Players/2").val().losses + "</h3>");

    //set turns
    if (playNum === 1 && snap.val().turn === 1) {
        database.ref().child("Players/1/wins").set(wins);
        database.ref().child("Players/1/losses").set(losses);
        $("#rps1").show();
        $("#rps2").hide();
        $("#middleMessage").html("<h1>It's your turn " + name1 + ".</h1>");
        $("#leftBox").css("border", "4px solid yellow");
        $("#rightBox").css("border", "4px solid black");
        $("#rps1").css("padding-top", "0px");
        $("#rps1").html("<ul><li data='Rock'><h3>Rock</h3></li><li data='Paper'><h3>Paper</h3></li><li data='Scissors'><h3>Scissors</h3></li></ul>");
    } else if (playNum === 1 && snap.val().turn === 2) {
        $("#middleMessage").html("<h1>Waiting for " + snap.child("Players/2").val().name + " to choose.</h1>");
        $("#rightBox").css("border", "4px solid yellow");
        $("#leftBox").css("border", "4px solid black");
    } else if (playNum === 1 && !snap.val().turn) {
        $("#rps1").hide();
        $("#leftBox").css("border", "4px solid black");
        $("#topBox").html("<h1>Hi " + name1 + "! You're Player " + playNum + ".</h1>");
    } else if (playNum === 2 && snap.val().turn === 2) {
        $("#rps2").show();
        $("#middleMessage").html("<h1>It's your turn " + name2 + ".</h1>");
        $("#rightBox").css("border", "4px solid yellow");
        $("#leftBox").css("border", "4px solid black");
        $("#rps2").css("padding-top", "0px");
        $("#rps2").html("<ul><li data='Rock'><h3>Rock</h3></li><li data='Paper'><h3>Paper</h3></li><li data='Scissors'><h3>Scissors</h3></li></ul>");
    } else if (playNum === 2 && snap.val().turn === 1) {
        database.ref().child("Players/2/wins").set(wins);
        database.ref().child("Players/2/losses").set(losses);
        $("#rps1").hide();
        $("#middleMessage").html("<h1>Waiting for " + snap.child("Players/1").val().name + " to choose.</h1>");
        $("#leftBox").css("border", "4px solid yellow");
        $("#rightBox").css("border", "4px solid black");
        $("#rps2").empty();
    }

    //player selection
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

    //user choices compared
    if (snap.val().turn === 3) {

        //delay reset of game
        setTimeout(resetTurn, 4000);

        //results of tie
        if (snap.child("Players/1").val().userChoice === snap.child("Players/2").val().userChoice) {
            $("#middleMessage").html("<h1>It's a Tie!</h1>");
            $("#rps1").show();
            $("#rps1").css("padding-top", "45px");
            $("#rps2").show();
            $("#rps2").css("padding-top", "45px");
            $("#rightBox").css("border", "4px solid black");
            $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
            $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
            setTimeout(resetTurn, 4000);
        }

        //player 1 game logic
        if (playNum === 1) {

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps2").show();
                $("#rps2").css("padding-top", "45px");
                $("#rps2").html("<h1>" + snap.child("Players/2").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            }
          //player 2 game logic
        } else if (playNum === 2) {

            if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Scissors") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Rock" && snap.child("Players/2").val().userChoice == "Paper") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Scissors") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Paper" && snap.child("Players/2").val().userChoice == "Rock") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Paper") {
                losses++;
                $("#middleMessage").html("<h1>" + snap.child("Players/1").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#leftBox").css("border", "4px solid red");
                $("#rightBox").css("border", "4px solid black");
            } else if (snap.child("Players/1").val().userChoice == "Scissors" && snap.child("Players/2").val().userChoice == "Rock") {
                wins++;
                $("#middleMessage").html("<h1>" + snap.child("Players/2").val().name + " wins!</h1>");
                $("#rps1").show();
                $("#rps1").css("padding-top", "45px");
                $("#rps1").html("<h1>" + snap.child("Players/1").val().userChoice + "</h1>");
                $("#rightBox").css("border", "4px solid red");
                $("#leftBox").css("border", "4px solid black");
            }
        }
    }

});
