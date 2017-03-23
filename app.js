 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCuLFTp6VwT59AS9_1yrsdypAb9WSUiRBs",
    authDomain: "group-project-d625c.firebaseapp.com",
    databaseURL: "https://group-project-d625c.firebaseio.com",
    storageBucket: "group-project-d625c.appspot.com",
    messagingSenderId: "501572989146"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// ticketMaster api

function searchTicketMaster(search) {
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://app.ticketmaster.com/discovery/v2/events.json?apikey=NcYkAlSJ5X8cMzKARzlzARZitr6TdBF9&keyword="+ search,
     "method": "GET",
      "headers": {
      
      
      }
  }

  $.ajax(settings).done(function (response) {

    var info = response._embedded.events[0];

      console.log(response);
      console.log(info.name);
      console.log(response._embedded.events[0].images[0].url);
      console.log(response._embedded.events[0].dates.start.localDate)
      console.log(info._embedded.venues[0].name);
      // creating a div to display the artist information
      var artistDiv = $("<div>");
      //variable  to hold name
      var artistName = info.name;
      //element to display artist name
      // var artName = $("<p>").text("Artist name: " + artistName);
      //appending it to artistDiv
      // artistDiv.append(artName);
      //variable to hold img
      var artistImage = info.images[0].url;
      //element to display img
      var artistImg = $("<img>").attr("src",artistImage);
      //appending to artistDiv
      // artistDiv.append(artistImg);
      // artist next date
      var nextDate = info.dates.start.localDate;
      //link to buy tickets
      var buyTix = info.url;
      console.log("buy tickets here: " + buyTix)
      //event venue
      var venue = info._embedded.venues[0].name;

      //prepending to html id
      // $("#artist-info").prepend(artistDiv);

      //spotify api
      // Running an initial search to identify the artist's unique Spotify id
  var queryURL = "https://api.spotify.com/v1/search?q=" + search + "&type=artist";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {

    // Printing the entire object to console
    console.log(response);

    // Printing the artist id from the Spotify object to console
    var artistID = response.artists.items[0].id;

    // Building a SECOND URL to query another Spotify endpoint (this one for the tracks)
    var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US";

      // Running a second AJAX call to get the tracks associated with that Spotify id
      $.ajax({
        url: queryURLTracks,
        method: "GET"
      }).done(function(popTrack) {

        // Logging the tracksv
        console.log("here i am" + popTrack);

        // Building a Spotify player playing the top song associated with the artist
        // (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
        var player = "<iframe src='https://embed.spotify.com/?uri=spotify:track:" +
          popTrack.tracks[1].id + 
          "' frameborder='0' allowtransparency='true'></iframe>";
        // sending the player link to firebase
      
        // Appending the new player into the HTML
        $("#one").append(player);

          //sending info to firebase
        database.ref().set({
          artistName: artistName,
          artistImage: artistImage,
          nextDate: nextDate,
          buyTix: buyTix,
          venue: venue,
          player: player
        });

      });

    

    });
    

  });



};





//getting info from search
$("#display-search").on("click", function(event){
  //preventing the button from trying to submit the form
  event.preventDefault();
  // storing artist search input
  var search = $("#search-input").val().trim();
  //running the search ticketMaster api

  

  searchTicketMaster(search);
  //clearing the div
  ;
        
    
  

});

//loading from firebase
database.ref().on("value", function(snapshot) {

  //console log values
  console.log("everything: " + snapshot.val().artistName);

  //loading to html
  $("#artistName").html(snapshot.val().artistName);
  $("#nextDate").html("Next concert: " + snapshot.val().nextDate);
  $("#venue").html("Location: " + snapshot.val().venue);
  //$("#buyTix").html(snapshot.val().buyTix);
  var link = $('<a>').attr('href', snapshot.val().buyTix).text("Buy tickets here!");
  $("#buyTix").append(link);
  //opening link in new window
  // $('<iframe>', {
  //  src: snapshot.val().buyTix,
  //  id:  'myFrame',
  //  frameborder: 0,
  //  scrolling: 'no'
  //  }).appendTo('#buyTix');
  
  var image = $("<img>").attr("src",snapshot.val().artistImage);
  $("#image").append(image);
  
  $("#player").append(snapshot.val().player);

}, function(errorObject) {
  console.log("errors handled: " + errorObject.code);


  
  
});


 