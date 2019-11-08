var mongoose = require('mongoose');

var travelSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
});

var travelModel = mongoose.model('journeys', travelSchema);

module.exports = travelModel;