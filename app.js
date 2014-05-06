
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var qs = require('querystring');
var mysql = require('mysql');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//using passport for authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// to connect mysql
var connection = require('./db.js').localConnect();
connection.connect();   

//Local strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log(username , password);
      //console.log('SELECT * FROM employees WHERE Username = "'+ username +'" AND  Password = "'+ password +'" AND Designation = "Bidding Manager"');
      connection.query('SELECT * FROM employees WHERE Username = "'+ username +'" AND  Password = "'+ password +'" AND Designation = "Bidding Manager"', function(error , response){
      if (response.length != 0)  {
        //res.cookie('cookiename', response[0].Username, { maxAge: 1 * 24 * 60 * 60 * 1000 });
        return done(null, {name: response});

      }
      return done(null, false, { message: 'Incorrect username.' });
     
    });
}
));


//Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  console.log("serialize user: ",user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserialize user: ",user);
  done(null, user);
});

var auth = function(req, res, next){
    console.log("check req.isAuthenticated(): "+  req.isAuthenticated());
    if (!req.isAuthenticated()) {
        res.send(401);
    }
    else{
        next();
    }
};
//ends here

// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'securesession' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var connection = require('./db.js').localConnect();
connection.connect();
app.get('/', routes.search);
//app.get('/users', user.list);
//app.get('/userlist', routes.userlist(db));
//app.get('/newuser', routes.newuser);
//app.post('/adduser', routes.adduser(db));
app.post('/newproject', routes.newproject(db));

app.get('/login', routes.login);
app.get('/addproject', routes.addproject);
app.get('/autocomplete', routes.autocomplete(db));
app.get('/keyautocomplete', routes.keyautocomplete(db));
app.get('/searchautocomplete', routes.searchautocomplete(db));
app.get('/search', routes.search);
app.post('/searchproject', routes.searchproject(db));
app.get('/projectlist', routes.projectlist(db));
//app.post('/newkeyword', routes.newkeyword(db));
app.get('/deleteproject', routes.deleteproject(db));
app.get('/editproject', routes.editproject);
app.get('/edit', routes.edit(db));
app.get('/newbid', routes.newbid);
app.post('/reportbid', routes.reportbid);
app.get('/searchbid', routes.searchbid);
app.post('/bidsave', routes.bidsave);
app.post('/bidgetsearch',routes.bidgetsearch);
app.post('/latestbids', routes.latestbids);
app.post('/changestatus', routes.changestatus);
app.get('/deletebid', routes.deletebid);

//route to log in
app.post('/checklogin', passport.authenticate('local'), function(req, res) {
  console.log(req.user);
    res.send(req.user);
});

//route to log out
app.post('/logout', function(req, res){
    req.logOut();
    res.send(200);
});



//check user login credentials
// app.post( '/checklogin1', function(req, res){
//     //console.log(req.body.username);
//     var username = req.body.username;
//     var password = req.body.password;
//     //console.log("heredascfascf",username,password);
//     connection.query('SELECT * FROM employees WHERE Username = "'+ username +'" AND  Password = "'+ password +'" AND Designation = "Bidding Manager"', function(error , response){
//         if (!error){
//             res.json({"userinfo":response});
//         if (response != ''){
//             res.cookie('cookiename', response[0].Username, { maxAge: 1 * 24 * 60 * 60 * 1000 });
//         }
//         //res.cookie('cookiename', response[0].Username, { maxAge: 900000  });
//         }else{
//             console.log("error");
//         }


//     });
// }

//app.get('/imagelist', routes.imagelist(db));
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
