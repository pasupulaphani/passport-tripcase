var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , TripCaseStrategy = require('passport-tripcase').Strategy;

var TRIPCASE_CLIENT_ID = "--your_client_id--"
var TRIPCASE_CLIENT_SECRET = "--your_client_secret--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete TripCase profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the TripCaseStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and tripcase
//   profile), and invoke a callback with a user object.
passport.use(new TripCaseStrategy({
    clientID: TRIPCASE_CLIENT_ID,
    clientSecret: TRIPCASE_CLIENT_SECRET,
    callbackURL: "https://airmax.herokuapp.com/auth/tripcase/callback",
    authorizationURL: 'https://dharma.tripcase.com/client_api_permissions',
    tokenURL: 'https://dharma.tripcase.com/developer_api/tokens',
    userProfileURL: 'https://dharma.tripcase.com/developer_api/users',
    userAgent: 'airmax-api'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's TripCase profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the TripCase account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/tripcase
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in tripcase authentication will involve redirecting
//   the user to tripcase.com.  After authorization, tripcase wii redirect the user
//   back to this application at /auth/tripcase/callback
app.get('/auth/tripcase',
  passport.authenticate('tripcase'),
  function(req, res){
    // The request will be redirected to tripcase for authentication, so this
    // function will not be called.
  });

// GET /auth/tripcase/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/tripcase/callback', 
  passport.authenticate('tripcase', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
