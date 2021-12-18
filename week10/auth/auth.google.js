const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(accessToken, refreshToken, profile)
        console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
        return cb(null, profile)
    }
));

const GoogleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

const GoogleCallback =  passport.authenticate('google')

// app.get('/google/callback', passport.authenticate('google'), (req, res) => {
//     console.log('redirected', req.user)
//     let user = {
//         first_name: req.user.name.givenName,
//         last_name: req.user.name.familyName,
//         displayName: req.user.displayName,
//         name: req.user.name.givenName,
//         email: req.user._json.email,
//         provider: req.user.provider
//     }

//     // FindOrCreate(user)

//     let token = jwt.sign(
//         user,
//         process.env.TOKEN_KEY,
//         { expiresIn: '1h' }
//     );

//     res.cookie('jwt', token)
//     res.redirect('/protected')
// })

passport.serializeUser(function (user, cb) {
    console.log('\n---------> Serialize user')
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    console.log('\n---------> Deserialize user')
    cb(null, obj);
});

module.exports = {
    GoogleAuth,
    GoogleCallback
};