//passport.js

const db = require("./models");
const User = db.user;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("./utils")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false
},
    async function (req, email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        try {
            const user = await User.findOne({ where: {email: email} })
            const passwordIsCorrect = await bcrypt.compare(password, user.password)
            if (!user || !passwordIsCorrect ) {
                console.log('Incorrect email or password.')
                return cb(null, false, { message: 'Incorrect email or password.' });
            }
            // console.log('Logged In Successfully', user)
            console.log('Logged In Successfully')
            return cb(null, user, { message: 'Logged In Successfully' });
            // return cb(null, user);
        } catch (err) {
            cb(err)
        }
    }
));