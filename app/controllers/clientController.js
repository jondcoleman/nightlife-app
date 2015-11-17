$(document).ready(function(){
   var apiUrl = appUrl + 'api/getUser';
   
   $.get(apiUrl, function(data){
        if (data !== null) {
            var userObject = data;
            if (userObject !== null) {
                document.querySelector('#login-btn-con').innerHTML = '<a id="login-btn" href="/logout" class="btn btn-dark btn-lg">Logout</a>';
                $('#location-input').val(userObject.lastSearch);
                yelpAPICall(userObject.lastSearch);
            }
        }
   })


   $('#location-search').submit(function(e){
       yelpAPICall($(this).serializeArray()[0].value);
       e.preventDefault();
   })

    var yelpAPICall = function(location){
        $.ajax({
            url: appUrl + 'api/yelp/' + location,
            type: 'GET',
            dataType: 'html',
            success: function(data){
                $('#bars').html(data);
            }
        })
    }
    
    
    $(document).on('click', '.modal-trigger', function(e){
        $('#modal1').openModal();
    })

    //handle click
    $(document).on("click", '.bar-button.logged-in', function(e){
        var target = $(e.target);
        var curVisitorCountElem = $('#' + target.attr('id') + '.visitor-count');
        if (target.hasClass('red')){
            var newText = parseInt(curVisitorCountElem.text())-1;
        } else {
            var newText = parseInt(curVisitorCountElem.text())+1;
        }
        target.toggleClass("red");
        curVisitorCountElem.text(newText);
        $('#' + target.attr('id') + '.visitor-count').text()
        $.get(appUrl+'api/visit/' + target.attr('id'), function(data){
            console.log(data);
        })
    })
    
    $(document).on('click', '.login-button', function(e){
        var searchText = $('#location-input').val();
        console.log(searchText)
        window.location = '/auth/github/callback/?location=' + searchText;
    })
    
    
})