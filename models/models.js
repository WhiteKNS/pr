module.exports = function(connection) {

    var User = require('./user')(connection);
    var Thing = require('./thing')(connection);

    return {
        user: User,
        thing: Thing
    }
}
