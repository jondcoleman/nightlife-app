'use strict';

var path = process.cwd();

var BarHandler = require(path + '/app/controllers/barHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');

/* require the modules needed */
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 
 Credit: https://arian.io/how-to-use-yelps-api-with-node/
 
 */
var request_yelp = function(location, callback) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'http://api.yelp.com/v2/search';

  /* We can setup default parameters here */
  var default_parameters = {
    sort: '2',
    location: location,
    category_filter: 'bars'
  };

  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : process.env.oauth_consumer_key,
    oauth_token : process.env.oauth_token,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0',
  };

  /* We combine all the parameters in order of importance */ 
  var parameters = _.assign(default_parameters, required_parameters);

  /* We set our secrets here */
  var consumerSecret = process.env.consumerSecret;
  var tokenSecret = process.env.tokenSecret;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;

  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};



module.exports = function (app, passport) {
    
    var barHandler = new BarHandler();
    var userHandler = new UserHandler();
    var Bar = require('../models/bars.js');

    app.route('/')
        .get(function (req, res) {
            res.render('index');
        });
        
    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/');
        });
        
    app.route('/api/getUser')
        .get(function (req, res) {
            if(req.user !== undefined){
                res.json(req.user);
            }
        });
    
    app.route('/api/visit/:barID')
        .get(function(req, res) {
            userHandler.addOrRemoveUserVisit(req, res);
            barHandler.addVisit(req.params.barID, req.user._id);
            res.send('done');
        });
    
    app.route('/api/yelp/:location')
        .get(function(req, res) {
            var allBars;
            Bar.find({}, function(err, docs){
                if (err)  {throw err}
                allBars = docs;
                yelpCall(allBars);
            })
            var yelpCall = function(allBars){
                var location = req.params.location;
                request_yelp(location, function(error, response, body){
                    var json = JSON.parse(body)
                    json.businesses.forEach(function(val, index, array){
                        array[index].visitorCount = 0;
                        allBars.forEach(function(v, i, a){
                            if (val.id === v.yelpBarID) {
                                array[index].visitorCount = v.visitors.length;
                                //console.log(array[index])
                            }
                        })
                    })
                    var businesses = json.businesses;
                    businesses.sort();
                    res.render('bar', {results: businesses, allBars: allBars, user: req.user});
                    if(req.user !== undefined){
                        var User = require('../models/users');
                        var query = {_id: req.user._id};
                        User.update(query, {lastSearch: location}, {}, function(err, raw){
                            if (err) {throw err}
                            console.log('The raw response from Mongo was ', raw);  
                    })
                    }
            })
            }
            

    })

    app.route('/auth/github/callback')
        .get(function(req, res, next){
            console.log(req.query.location);
            passport.authenticate('github', {
                successRedirect: '/#GetStarted',
                failureRedirect: '/',
                state: req.query.location
            })(req, res, next)
    })
        
}