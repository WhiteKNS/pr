var mongoose = require('mongoose');

module.exports = function(connection) {

    var Schema = mongoose.Schema;
/*
    var thingSchema = new Schema({
        name: String,
        size: Number
    });
*/
    
    var thingSchema = new Schema({
        country: String,
        city: String,
        description: String,
        title: String,
        lat: Number,
        long: Number,
        length: String,
        type: String,
        dogAllowed: Boolean
    });
    
    var Thing = connection.model('Thing', thingSchema);

    return Thing;
}
