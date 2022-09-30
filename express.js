var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
const favTweets = require('./favs.json')

var fs = require('fs');
const { response } = require('express');

//global variable for tweet data
var tweetinfo = []
var recentlySearched = []

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err, data){
  if(err){
    req.log.info('Cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    //TODO: store loaded data into a global variable for tweet data
    tweetinfo = JSON.parse(data)
  }
});

// Pad the given time with 0's if needed. Ex: 10-23-4 -> 10-23-04
function pad(num) {
  return ("0" + num).slice(-2);
}

// Function to get the current day, Sunday - Saturday, and return the abbreviated name
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
 
//Get functions
//Shows user info
app.get('/tweets', function(req, res) {
  //TODO: send all users' IDs
  res.send({tweetinfo})
});

//Shows tweet info
app.get('/tweetinfo', function(req, res) {
  //TODO: send tweet info
  res.send({tweetinfo})
});

//Shows searched tweets
app.get('/searchinfo', function(req, res){
  //TODO: send searched tweets
  res.send({recentlySearched})
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  //TODO: create a tweet.
  var tweetID = req.body.user.id
  var tweetText = req.body.text
  var today = new Date()
  var day
  var dd
  var mm
  var yyyy
  var time
  var dateTime
  
 day = getCurrentDay()
 dd = String(today.getDate()).padStart(2, '0')
 mm = getCurrentMonth()
 time = pad(today.getUTCHours()) + ":" + pad(today.getUTCMinutes()) + ":" + pad(today.getUTCSeconds()) + " +0000"
 yyyy = today.getFullYear()
 dateTime = day + " " + mm + " " + dd + " " + time + " " + yyyy

  tweetinfo.push ({
    id_str: tweetID,
    text: tweetText,
    created_at: dateTime
  })

  res.send("Successfully created tweet!")
});

//Posts searched tweets
app.post('/searchinfo', function(req, res) {
  //TODO: search a tweet
  var tweetID = req.body.id
  var tweetText
  var tweetID
  var createdAt

  for(var i = 0; i < tweetinfo.length; i++) {
    if(tweetID == tweetinfo[i].id_str) {
      tweetID = tweetinfo[i].id_str
      tweetText = tweetinfo[i].text
      createdAt = tweetinfo[i].created_at

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

//Update
app.put('/tweets/:nm', function(req, res) {
  //TODO: update tweets
  var name = req.params.nm
  var found = false
  var newName = req.body.name

  for(var i = 0; i < tweetinfo.length; i++) {
    if(!found && tweetinfo[i].user.name == name) {
      tweetinfo[i].user.screen_name = newName
      found = true
    }
  }

  res.send({tweetinfo})
});

//Delete 
app.delete('/tweetinfo/:tweetid', function(req, res) {
  //TODO: delete a tweet
  var elementID = Number(req.params.tweetid)

  for(var i = 0; i < tweetinfo.length; i++) {
    if(elementID == tweetinfo[i].id) {
      tweetinfo.splice(i, 1)
      res.send("Successfully deleted tweet!")
    }
  }
});

app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});