var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
const favTweets = require('./favs.json')

var fs = require('fs');
const { response } = require('express');

// Global variables for tweet data and recently searched data
var tweetinfo = []
var recentlySearched = []

// Load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err, data){
  if(err){
    req.log.info('Cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    // Store loaded data into a global variable for tweet data
    tweetinfo = JSON.parse(data)
  }
});

// Pad the given time with 0's if needed. Ex: 10-23-4 -> 10-23-04
function pad(num) {
  return ("0" + num).slice(-2);
}

/* Function to get the current day, Sunday - Saturday, and return the
abbreviated name */
function getCurrentDay() {
  var today = new Date()
  var abbreviatedDay

  switch (today.getDay()) {
    case 0:
      abbreviatedDay = "Sun"
      break

    case 1:
      abbreviatedDay = "Mon"
      break

    case 2:
      abbreviatedDay = "Tue"
      break

    case 3:
      abbreviatedDay = "Wed"
      break

    case 4:
      abbreviatedDay = "Thur"
      break

    case 5:
      abbreviatedDay = "Fri"
      break

    case 6:
      abbreviatedDay = "Sat"
      break
  }

  return abbreviatedDay
}

// Function to get the current month and return the abbreviated name
function getCurrentMonth() {
  var today = new Date()
  var abbreviatedMonth

  switch (String(today.getMonth() + 1).padStart(2, '0')) {
    case '01':
      abbreviatedMonth = "Jan"
      break
  
    case '02':
      abbreviatedMonth = "Feb"
      break
  
    case "03":
      abbreviatedMonth = "Mar"
      break
  
    case '04':
      abbreviatedMonth = "Apr"
      break
  
    case '05':
      abbreviatedMonth = "May"
      break
  
    case '06':
      abbreviatedMonth = "Jun"
      break
  
    case '07':
      abbreviatedMonth = "Jul"
      break
  
    case '08':
      abbreviatedMonth = "Aug"
      break
  
    case '09':
      abbreviatedMonth = "Sep"
      break
  
    case '10':
      abbreviatedMonth = "Oct"
      break
  
    case '11':
      abbreviatedMonth = "Nov"
      break
  
    case '12':
      abbreviatedMonth = "Dec"
      break
    }

    return abbreviatedMonth
}
 
/* For most of the functions, I opted to send the full tweetinfo array instead
of only certain parts. I saw my friend's code, and he wanted to send parts of
the array and really struggled to get it working correctly, so I sent the whole
array to access on the front end instead, since the array is small, so that I 
could focus on getting the whole program to run correctly instead of trying to 
optimize it. I do my actual searching for the different parts in the front 
end. */

// Get functions
// Shows user info
app.get('/tweets', function(req, res) {
  res.send({tweetinfo})
});

// Shows tweet info
app.get('/tweetinfo', function(req, res) {
  res.send({tweetinfo})
});

// Shows searched tweets
app.get('/searchinfo', function(req, res){
  res.send({recentlySearched})
});

// Post functions
// Posts created tweets
app.post('/tweetinfo', function(req, res) {
  var tweetID = req.body.tweetid // The tweet ID
  var tweetText = req.body.tweetText // The tweet text
  var today = new Date() // New date function to make a created_at string
  var day // The day the tweet was created, abbreviated. Ex: Sun, Mon, etc.
  var dd // The day the tweet was created, to go with the month. Ex: Sep 29
  var mm // The month the tweet was created, abbreviated. Ex: September => Sep
  var yyyy // The year the tweet was created
  var time // The time that the tweet was created, in UTC and padded with 0's
  var dateTime // The full created_at string, saved in the end
  
  day = getCurrentDay()
  dd = String(today.getDate()).padStart(2, '0')
  mm = getCurrentMonth()

  time = pad(today.getUTCHours()) + ":" + pad(today.getUTCMinutes()) + ":" 
  + pad(today.getUTCSeconds()) + " +0000"

  yyyy = today.getFullYear()
  dateTime = day + " " + mm + " " + dd + " " + time + " " + yyyy

  // Push our new tweet and the other information into the tweetinfo array
  tweetinfo.push ({
    id_str: tweetID,
    text: tweetText,
    created_at: dateTime
  })

  res.send("Successfully created tweet!")
});

// Posts searched tweets
app.post('/searchinfo', function(req, res) {
  var tweetID = req.body.ID // The tweet ID
  var tweetText // The tweet text
  var createdAt // The created_at string

  /* Loop through the tweetinfo array until the inputted tweet ID matches a
  tweet id in the array. Once it does, we add that tweet's ID, text, and
  created_at string to the recentlySearched array, which can be return when we
  get the recently searched tweets. */
  for(var i = 0; i < tweetinfo.length; i++) {
    if(tweetID == tweetinfo[i].id_str) {
      tweetText = tweetinfo[i].text
      createdAt = tweetinfo[i].created_at

      /* Add the various tweet information to the recently searched array,
      except we are adding to the front and pushing the other elements back */
      recentlySearched.unshift ({
        id: tweetID,
        id_str: tweetID,
        text: tweetText,
        created_at: createdAt
      })

      break
    }
  }

  res.send({tweetinfo})
});

// Update tweets
app.put('/tweets/:nm', function(req, res) {
  var name = req.params.nm // The inputted name
  var newUsername = req.body.newUsername

  /* Loop through the tweetinfo array until we find the given name.
  We then update the username for that given name */
  for(var i = 0; i < tweetinfo.length; i++) {
    if(tweetinfo[i].user.name == name) {
      tweetinfo[i].user.screen_name = newUsername
      break
    }
  }

  res.send({tweetinfo})
});

// Delete a tweet
app.delete('/tweetinfo/:tweetid', function(req, res) {
  var tweetID = Number(req.params.tweetid) // The ID of the tweet to be deleted

  // Loop through the tweetinfo array. If the ID's match, delete that element
  for(var i = 0; i < tweetinfo.length; i++) {
    if(tweetID == tweetinfo[i].id) {
      tweetinfo.splice(i, 1)
      res.send("Successfully deleted tweet!")
      break
    }
  }
});

// A simple port listener that hosts the website on localhost:3000
app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});