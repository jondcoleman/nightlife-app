'use strict';

var Users = require('../models/users.js');

function UserHandler () {

    this.addOrRemoveUserVisit = function (req, res) {
        Users
            .findOne({'_id': req.user._id, 'barsVisiting': req.params.barID})
            .exec(function (err, result){
                if (err) { throw err; }
                if (result) {
                    console.log(result);
                    Users.update({'_id': req.user._id}, { $pull: { 'barsVisiting': req.params.barID }})
                    .exec(function (err, result) {
                        if (err) { throw err; }
                        console.log('removed');
                        console.log(result);
                    })
                } else {
                    Users.update({'_id': req.user._id}, { $push: { 'barsVisiting': req.params.barID }})
                    .exec(function (err, result) {
                        if (err) { throw err; }
                        console.log('added');
                        console.log(result);
                        
                    })
                }
            })
    };

};

module.exports = UserHandler;