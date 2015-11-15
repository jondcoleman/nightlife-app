$(document).ready(function(){
   var apiUrl = appUrl + 'api/getUser';
   
   $.get(apiUrl, function(data){
        if (data !== null) {
            var userObject = data;
            if (userObject !== null) {
                document.querySelector('#login-btn-con').innerHTML = '<a id="login-btn" href="/logout" class="btn btn-dark btn-lg">Logout</a>';
                console.log(userObject);
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


    $(document).on("click", '.bar-button', function(e){
        console.log('ets');
        $(e.target).toggleClass("red");
        $.get(appUrl+'api/visit/' + $(e.target).attr('id'), function(data){
            console.log(data);
        })
    })

})