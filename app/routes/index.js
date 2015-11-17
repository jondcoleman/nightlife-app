'use strict';

var path = process.cwd();

var BarHandler = require(path + '/app/controllers/barHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');
var Yelp = require(path + '/app/controllers/yelp.js');

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
                Yelp(location, function(error, response, body){
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