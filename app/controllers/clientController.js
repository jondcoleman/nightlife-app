$(document).ready(function(){
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
})