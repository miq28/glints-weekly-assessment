//passport.js

const db = require("./models");
const User = db.user;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("./utils")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalStrategy = require('./auth.local')
// const { noExtendLeft } = require("sequelize/dist/lib/operators");



let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.ACCESS_TOKEN_KEY;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("JWT BASED VALIDATION GETTING CALLED")
    console.log("JWT", jwt_payload)
    // if (CheckUser(jwt_payload.data)) {
    //     return done(null, jwt_payload.data)
    // } else {
    //     // user account doesnt exists in the DATA
    //     return done(null, false);
    // }

    if (jwt_payload.provider) {
        if (jwt_payload.provider === 'google') {
            return done(null, jwt_payload)
        }
    }

    return done(null, jwt_payload)

    User.findOne({ id: jwt_payload.sub }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(passportLocalStrategy);