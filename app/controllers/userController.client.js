'use strict';

(function () {
   var apiUrl = appUrl + 'api/getUser';
   
   $.get(apiUrl, function(data){
        if (data !== null) {
            var userObject = data;
            if (userObject !== null) {
                document.querySelector('#login-btn-con').innerHTML = '<a id="login-btn" href="/logout" class="btn btn-dark btn-lg">Logout</a>';
            }
        }
   })
   
})();       