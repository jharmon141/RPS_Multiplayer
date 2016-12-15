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
  var losses = 0;
  var wins = 0;
  var turn = 0;
  var playNum = false;

  var connectionsRef = database.ref("/Players");
  var connectedRef = database.ref(".info/connected");

  $("#rps1").hide();
  $("#rps2").hide();

  $("#userName").on("click", function(){
    event.preventDefault();

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
              wins: wins
            });
            connectionsRef.child("1").onDisconnect().remove();
          } else if (snap.numChildren() === 1 && !playNum){
            playNum = 2;
            turn = 1;
            database.ref().child("turn").set(turn);
            $("#topRow").html("<h2>Hi " + name + "! You're Player " + playNum + "</h2>");
            connectionsRef.child("2").set({
              name: name,
              losses: losses,
              wins: wins
            });
            connectionsRef.child("2").onDisconnect().remove();
            database.ref().child("turn").onDisconnect().remove();
          }
        });

  });

  connectionsRef.on("value", function(snap) {

    if (snap.numChildren() === 1) {
      $("#name1").html("<h2>" + snap.child("1").val().name + "</h2>");
    } else if (snap.numChildren() === 2) {
      $("#name1").html("<h2>" + snap.child("1").val().name + "</h2>");
      $("#name2").html("<h2>" + snap.child("2").val().name + "</h2>");
    }
  });

  database.ref().on("value", function(snap){
    if (snap.val().turn === 1 && playNum === 1){
      $("#rps1").show();
      $("#topRow").html("<h2>It's your turn " + name + "</h2>");
    } else if (snap.val().turn === 2 && playNum === 1){
      $("#topRow").html("<h2>Waiting for " + snap.child("2").val().name + " to choose</h2>");
    } else if (snap.val().turn === 2 && playNum === 2){
      $("#rps2").show();
      $("#topRow").html("<h2>It's your turn " + name + "</h2>");
    } else if (snap.val().turn === 1 && playNum === 2){
      $("#topRow").html("<h2>Waiting for " + snap.child("1").val().name + " to choose</h2>");
    }
  });



  //when a user connects to database add to connections and remove them when they disconnect
  // connectedRef.on("value", function(snap){
  //   if (snap.val()){
  //     var con = connectionsRef.push({
  //       name: name,
  //       losses: losses,
  //       wins: wins
  //     });
  //     con.onDisconnect().remove();
  //   }
  //
  // });
