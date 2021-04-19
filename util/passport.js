let passport = require('passport');
let localStategy = require('passport-local').Strategy;
let githubStrategy = require('passport-github').Strategy;
let User = require('../model/user');
let Constant = require('./constant');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use('local', new localStategy({
    usernameField: 'userName',
    passwordField: 'password'
}, async (userName, password, done) => {
    try {
        const user = await User.findOne({
            'username': userName,
            'password': password
        });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, {
                message: 'User name or password is wrong!'
            });
        }
    } catch (err) {
        return done(err)
    }
}));

passport.use(new githubStrategy({
    clientID: Constant.githubClientId,
    clientSecret: Constant.githubClientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
}
));
