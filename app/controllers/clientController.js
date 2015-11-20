$(document).ready(function(){
   var appUrl = window.location.origin;    
   var apiUrl = window.location.origin + 'api/getUser';
   
//get user and load search results from saved search
   $.get(apiUrl, function(data){
       
       // only load if there is a user
        if (data !== null) {
            var userObject = data;
            if (userObject !== null) {
                
                //change button to Logout if logged in
                document.querySelector('#login-btn-con').innerHTML = '<a id="login-btn" href="/logout" class="btn btn-dark btn-lg">Logout</a>';
                
                //load last search from user
                $('#location-input').val(userObject.lastSearch);
                yelpAPICall(userObject.lastSearch);
            }
        }
   })




//new search
   $('#location-search').submit(function(e){
       yelpAPICall($(this).serializeArray()[0].value);
       e.preventDefault();
   })
    
    
    
    
    
//yelp API call to server
    var yelpAPICall = function(location){
        $.ajax({
            url: appUrl + 'api/yelp/' + location,
            type: 'GET',
            dataType: 'html',
            beforeSend: function() {$('.spinner').toggleClass("hidden")},
            complete: function() {$('.spinner').toggleClass("hidden")},
            success: function(data){
                $('#bars').html(data);
            }
        })
    }




//handle click on "I'm In" button
    $(document).on("click", '.bar-button.logged-in', function(e){
        var target = $(e.target);
        
        //get the current bar id going count element
        var curVisitorCountElem = $('#' + target.attr('id') + '.visitor-count');
        
        //define how to change text based on whether the user has already
        //selected they're going e.g. class=red
        if (target.hasClass('red')){
            var newText = parseInt(curVisitorCountElem.text())-1;
        } else {
            var newText = parseInt(curVisitorCountElem.text())+1;
        }
        
        //update UI (Optimistic update)
        target.toggleClass("red");
        curVisitorCountElem.text(newText);
        $('#' + target.attr('id') + '.visitor-count').text()
        
        //Database update
        $.get(appUrl+'api/visit/' + target.attr('id'), function(data){
            console.log(data);
        })
    })
    
    
    
    
    
//Login modal
    $(document).on('click', '.modal-trigger', function(e){
        $('#modal1').openModal();
    })
    
    
    
    
    
//Login button
    $(document).on('click', '.login-button', function(e){
        var searchText = $('#location-input').val();
        console.log(searchText)
        window.location = '/auth/github/callback/?location=' + searchText;
    })
    
    
})