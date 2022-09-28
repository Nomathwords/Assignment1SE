$(function() {
  //Get 
  $('#get-button').on('click', function() {
       //TODO: get all users' IDs & display it
       $.ajax({
         url: '/tweets',
         method: 'GET',
         contentType: 'application/json',
         success: function(response) {
             var tbodyEl = $('#namebody')
             tbodyEl.html('')
             response.tweetinfo.forEach(function(tweetinfo) {
               tbodyEl.append('\
                       <tr>\
                       <td><input type="text" class="name" value="' + tweetinfo.user.id + '"></td>\
                       <td><input type="text" class="name" value="' + tweetinfo.user.screen_name + '"></td>\
                       <td><input type="text" class="name" value="' + tweetinfo.user.name + '"></td>\
                       </tr>\
               ')
             })
         }
   })
})

   //Get tweets
   $('#get-tweets-button').on('click', function() {
       //TODO: get tweet info and display it
       $.ajax({ 
        url: '/tweetinfo',
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          var tbodyEl = $('#tweetbody')
          tbodyEl.html('')
          response.tweetinfo.forEach(function(tweetinfo) {
            tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' + tweetinfo.id + '"></td>\
                    <td><input type="text" class="name" value="' + tweetinfo.text + '"></td>\
                    <td><input type="text" class="name" value="' + tweetinfo.created_at + '"></td>\
                    </tr>\
            ')
          })
        }
       })
   })

   //Get recently searched tweets
   $('#get-searched-tweets').on('click', function() {
       //TODO: get a searched tweet(s) & display it
       $.ajax({
        url: '/searchinfo',
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
          var tbodyEl = $('#searchbody')
          tbodyEl.html('')
          for(var i = 0; i < response.recentlySearched.length; i++) {
              tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' + response.recentlySearched[i].id + '"></td>\
                    <td><input type="text" class="name" value="' + response.recentlySearched[i].text + '"></td>\
                    <td><input type="text" class="name" value="' + response.recentlySearched[i].created_at + '"></td>\
                    </tr>\
              ')
          }
        }
       })
   })

 //CREATE
 $('#create-form').on('submit', function(event){
       event.preventDefault();
       const createInput = $('#create-input');
       var inputString = createInput.val();
       const parsedStrings = inputString.split(';');
       var tweetid = parsedStrings[0];
       var tweetText = parsedStrings[1];

       //TODO: create a tweet
       $.ajax({
        url: '/tweetinfo',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({user: {id: tweetid}, text: tweetText}),
        success: function(response) {
          console.log(response)
          createInput.val('')
          $('#get-button').click()
        }
    })
 })

   //Create searched tweets
 $('#search-form').on('submit', function(event){
   event.preventDefault();
   var searchInput = $('#search-input');
   var ID = searchInput.val();
   
   //TODO: search a tweet and display it.
   $.ajax({
    url: '/searchinfo',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({id: ID}),
    success: function(response) {
      var tbodyEl = $('#searchbody')
          tbodyEl.html('')
          for(var i = 0; i < response.tweetinfo.length; i++) {
            if(ID == i) {
              tbodyEl.append('\
                    <tr>\
                    <td><input type="text" class="name" value="' + response.tweetinfo[i].id + '"></td>\
                    <td><input type="text" class="name" value="' + response.tweetinfo[i].text + '"></td>\
                    <td><input type="text" class="name" value="' + response.tweetinfo[i].created_at + '"></td>\
                    </tr>\
              ')
            }
          }
      }
   })
 })

 //UPDATE/PUT
 $("#update-user").on('submit', function(event){
   event.preventDefault();
   var updateInput = $('#update-input');
   var inputString = updateInput.val();

   const parsedStrings = inputString.split(';');

   var name = parsedStrings[0];
   var newName = parsedStrings[1];
   console.log("Input name: " + name)
   console.log("New name: " + newName)
   
   //TODO: update a tweet
   $.ajax({
    url: '/tweets/' + name,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({name: newName}),
    success: function(response) {
      console.log(response)
      $('#get-button').click()
    }
   })
 })

 //DELETE
 $("#delete-form").on('submit', function() {
   event.preventDefault();
   var deleteInput = $('#delete-input')
   var tweetID = deleteInput.val();

   //TODO: delete a tweet
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