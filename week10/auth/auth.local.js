const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passportLocalStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    // passReqToCallback: true,
    session: false
},
    async function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        try {
            console.log('PASSSSSS')
            const user = await User.findOne({ where: { email: email } })
            const passwordIsCorrect = await bcrypt.compare(password, user.password)
            if (!user || !passwordIsCorrect) {
                console.log('Incorrect email or password.')
                return cb(null, false, { message: 'Incorrect email or password.' });
            }
            // console.log('Logged In Successfully', user)
            console.log('Logged In Successfully via Local Strategy')

            const token = jwt.sign(
                { user_id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email },
                process.env.ACCESS_TOKEN_KEY,
                {
                    expiresIn: "30s",
                }
            );

            user.token = token

            console.log('TOKEN_1', token)

            return cb(null, user, { message: 'Logged In Successfully via Local Strategy' });

            // return cb(null, user);
        } catch (err) {
            cb(err)
        }
    }
)

const passportLocalStrategyAll = passport.authenticate(passportLocalStrategy, { failureRedirect: '/login' })

passport.serializeUser(function (user, cb) {
    console.log('\n--------> Serialize user')
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    console.log('\n--------- Deserialize user')
    cb(null, obj);
});

module.exports = passportLocalStrategyAll;