'use strict';

var Moment = require('moment');
var Bar = require('../models/bars.js');

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
    
    this.getAllBars = function () {
        var allBars
        Bar
            .find({}, function(err, bars){
                if (err) {throw err}
                allBars = bars;
                console.log(allBars);
                returnAllBars(allBars);
            })
        function returnAllBars(val) {
            return val;
        }
        
    }
            

};

module.exports = BarHandler;