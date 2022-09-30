$(function() {
  // Get 
  $('#get-button').on('click', function() {
       // Get all users' IDs & display it
       $.ajax({
         url: '/tweets',
         method: 'GET',
         contentType: 'application/json',
         success: function(response) {
             var tbodyEl = $('#namebody')
             tbodyEl.html('')

             /* Iterate through each element of the tweetinfo array and display
             the user id, screen name, and name */
             response.tweetinfo.forEach(function(tweetinfo) {
               tbodyEl.append('\
                       <tr>\
                       <td><input type="text" class="name" value="' 
                       + tweetinfo.user.id_str + '"></td>\
                       \
                       <td><input type="text" class="name" value="' 
                       + tweetinfo.user.screen_name + '"></td>\
                       \
                       <td><input type="text" class="name" value="' 
                       + tweetinfo.user.name + '"></td>\
                       </tr>\
               ')
             })
         }
   })
})

   // Get tweets
   $('#get-tweets-button').on('click', function() {
       // Get tweet info and display it
       $.ajax({ 
        url: '/tweetinfo',
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          var tbodyEl = $('#tweetbody')
          tbodyEl.html('')

          /* Iterate through each element of the tweetinfo array and display
          the tweet id, tweet text, and the created_at string */
          response.tweetinfo.forEach(function(tweetinfo) {
            tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' 
                    + tweetinfo.id_str + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + tweetinfo.text + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + tweetinfo.created_at + '"></td>\
                    </tr>\
            ')
          })
        }
       })
   })

   // Get recently searched tweets
   $('#get-searched-tweets').on('click', function() {
       //Get a searched tweet(s) & display it
       $.ajax({
        url: '/searchinfo',
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          var tbodyEl = $('#searchbody')
          tbodyEl.html('')

          /* Iterate through each element of the recentlySearched array and
          display the tweet id, tweet text, and the created_at string */
          for(var i = 0; i < response.recentlySearched.length; i++) {
              tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' 
                    + response.recentlySearched[i].id_str + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + response.recentlySearched[i].text + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + response.recentlySearched[i].created_at + '"></td>\
                    </tr>\
              ')
          }
        }
       })
   })

 // CREATE
 $('#create-form').on('submit', function(event){
       event.preventDefault();
       const createInput = $('#create-input');
       var inputString = createInput.val();
       const parsedStrings = inputString.split(';'); // Split the input
       var tweetid = parsedStrings[0]; // The new tweet id
       var tweetText = parsedStrings[1]; // The new tweet text

       /* Create a tweet. I send the tweet id and tweet text to the front end so
       that the info can be added to the tweetinfo array */
       $.ajax({
        url: '/tweetinfo',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tweetid, tweetText}),
        success: function(response) {
          console.log(response)
          createInput.val('')
          $('#get-button').click()
        }
    })
 })

 // Create searched tweets
 $('#search-form').on('submit', function(event){
   event.preventDefault();
   var searchInput = $('#search-input');
   var ID = searchInput.val(); // The ID of the tweet we are looking for
   
   /* Search a tweet and display it. I send the tweet id to the back end so that
   the searched tweet can be added to an array, which will be displayed when we
   look for all of the recently searched tweets */
   $.ajax({
    url: '/searchinfo',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ID}),
    success: function(response) {
      var tbodyEl = $('#searchbody')
          tbodyEl.html('')

          /* Iterate through each element of the tweet info array, searching
          for the inputted tweet id. If we find it, the tweet id, twee text,
          and created_at string are displayed */
          for(var i = 0; i < response.tweetinfo.length; i++) {
            if(ID == response.tweetinfo[i].id_str) {
              tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' 
                    + response.tweetinfo[i].id_str + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + response.tweetinfo[i].text + '"></td>\
                    \
                    <td><input type="text" class="name" value="' 
                    + response.tweetinfo[i].created_at + '"></td>\
                    </tr>\
              ')
            }
          }
      }
   })
 })

 // UPDATE/PUT
 $("#update-user").on('submit', function(event){
   event.preventDefault();
   var updateInput = $('#update-input');
   var inputString = updateInput.val();

   const parsedStrings = inputString.split(';');

   var name = parsedStrings[0]; // The user's name
   var newUsername = parsedStrings[1]; // The user's new screen name
   
   /* Update a tweet. I send the name and new screen name to the back end and
   update the tweetinfo array */
   $.ajax({
    url: '/tweets/' + name,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({name, newUsername}),
    success: function(response) {
      console.log(response)
      $('#get-button').click()
    }
   })
 })

 // DELETE
 $("#delete-form").on('submit', function() {
   event.preventDefault();
   var deleteInput = $('#delete-input')
   var tweetID = deleteInput.val();

   // Delete a tweet. I delete from the backend and update my tweetinfo array
   $.ajax({
    url: '/tweetinfo/' + tweetID,
    method: 'DELETE',
    contentType: 'application/json',
    success: function(response) {
      console.log(response)
      $('#get-button').click()
    }
   })
 })
})