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
            barHandler.sendBars(req, res, function(businesses, allBars, user){
                res.render('bar', {results: businesses, allBars: allBars, user: req.user});
            });

            //save user search
            if(req.user !== undefined){
                userHandler.saveSearch(req.user, req.params.location);
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