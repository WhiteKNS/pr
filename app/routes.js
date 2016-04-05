module.exports = function(app, passport,models) {

    var api = require('./api.js')(models);

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    app.get('/partials/auth/:name', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });

    app.post('/api/login', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.login);

    app.post('/api/signup', showClientRequest, api.signup);


    app.get('/api/logout', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.logout);



    app.get('/api/things', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.getThings);

    app.post('/api/thing', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.createThing);

    app.put('/api/thing/:id', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.updateThing);

    app.delete('/api/thing/:id', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.removeThing);




    app.post('/api/search', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.search);


    app.get('/api/home', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.search);


    app.get('/api/map', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.search);






    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        console.log(request)
        return next();
    }
}
