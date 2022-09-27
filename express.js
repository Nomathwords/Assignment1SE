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
  res.send({tweetinfo})

});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  //TODO: create a tweet.
  var tweetID = req.body.user.id
  var tweetText = req.body.text

  tweetinfo.push ({
    user: {id : tweetID}, // Fix this later
    text: tweetText
  })

  res.send("Successfully created tweet!")
});

//Posts searched tweets
app.post('/searchinfo', function(req, res) {
  //TODO: search a tweet
});

//Update
app.put('/tweets/:nm', function(req, res) {
  //TODO: update tweets
  var name = req.params.nm
  var found = false
  var newName = req.body.name

  for(var i = 0; i < tweetinfo.length; i++) {
    if(!found && tweetinfo[i].user.screen_name == name) {
      tweetinfo[i].user.screen_name = newName
      found = true
    }
  }

  res.send({tweetinfo})
});

//Delete 
app.delete('/tweetinfo/:tweetid', function(req, res) {
  //TODO: delete a tweet

});

app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});