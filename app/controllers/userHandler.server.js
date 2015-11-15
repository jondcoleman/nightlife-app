'use strict';

var Users = require('../models/users.js');

function UserHandler () {

    this.addUserVisits = function (req, res) {
        Users
            .findByIdAndUpdate(req.user._id, { $inc: { 'nbrClicks.clicks': 1 } })
            .exec(function (err, result) {
                    if (err) { throw err; }
                }
            );
    };

    this.removeUserVisits = function (req, res) {
        Users
            .findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
            .exec(function (err, result) {
                    if (err) { throw err; }

                    res.json(result.nbrClicks);
                }
            );
    };

};

module.exports = BarHandler;