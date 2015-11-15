'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
    yelpBarID: String,
    //visitors: [String]
    visitors: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Bar', Bar);