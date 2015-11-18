'use strict';

var Moment = require('moment');
var Bar = require('../models/bars.js');
var Yelp = require('./yelp.js');

function BarHandler () {

    this.addVisit = function (barID, userID) {
        // var today = Moment().startOf('day')
        // var tomorrow = Moment(today).add(1, 'days')
        
        
        Bar
            .findOneAndUpdate(
                {'yelpBarID': barID, visitors: userID},
                {$pull : {'visitors': userID}})
                .exec(function(err, result){
                    if (err) {throw err;}
                    if (result){
                        console.log(result);
                    } else {
                    Bar.findOneAndUpdate(
                        {'yelpBarID': barID},
                        {$push : {'visitors': userID}})
                        .exec(function(err, result){
                            if (err) {throw err;}
                            if (result){
                                console.log(result);
                            } else {
                            var newBar = new Bar({
                                'yelpBarID' : barID,
                                'visitors' : [userID]
                            })
                            newBar.save(function(err, document){
                                if (err) {throw err;}
                                console.log(document);
                            })                                                  
                            }
                        })    
                    }
                }
            );
    };
    
    this.getAllBars = function (callback) {
        Bar.find({}, function(err, docs){
            if (err)  {throw err}
            callback(docs);
        })
    };        
    
    
    this.sendBars = function (req, res, callback) {
        var location = req.params.location;
        var user = req.user;
        
        var yelpCall = function(allBars){
            Yelp(location, function(body){
                var businesses = JSON.parse(body).businesses;
                
                //add visitor count
                businesses.forEach(function(val, index, array){
                    array[index].visitorCount = 0;
                    allBars.forEach(function(v, i, a){
                        if (val.id === v.yelpBarID) {
                            array[index].visitorCount = v.visitors.length;
                        }
                    })
                })
                
                businesses.sort();
                callback(businesses, allBars, user);
            })
        }
        this.getAllBars(yelpCall);
    }
};

module.exports = BarHandler;