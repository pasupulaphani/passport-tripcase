# Passport-TripCase

[Passport](http://passportjs.org/) strategy for authenticating with [TripCase](https://www.tripcase.com/)
using the OAuth 2.0 API.

This module lets you authenticate using TripCase in your Node.js applications.
By plugging into Passport, TripCase authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-tripcase

## Usage

#### Configure Strategy

The TripCase authentication strategy authenticates users using a TripCase account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new TripCaseStrategy({
        clientID: TRIPCASE_CLIENT_ID,
        clientSecret: TRIPCASE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/tripcase/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ tripcaseId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tripcase'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/tripcase',
      passport.authenticate('tripcase'));

    app.get('/auth/tripcase/callback', 
      passport.authenticate('tripcase', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/pasupulaphani/passport-tripcase/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

## Credits

  - [pasupulaphani](http://github.com/pasupulaphani)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Phaninder Pasupula <[http://phaninder.com/](http://phaninder.com/)>

