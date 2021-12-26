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
    // session: false
},
    async function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        var message;
        try {
            // console.log('Local strategy is called', email, password)

            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                message = 'Incorrect username/email or password'
                console.log({ message: message })
                return cb(null, false, { message: message });
                // return res.status(400).send({message: 'Incorrect username/email or password'})
            }

            const passwordIsCorrect = await bcrypt.compare(password, user.password)
            if (!passwordIsCorrect) {
                message = 'Incorrect username/email or password'
                console.log(message)
                return cb(null, false, { message: message });
                // return res.status(400).send({message: 'Incorrect username/email or password'})
            }


            message = 'Logged In Successfully via Local Strategy';
            console.log({ message: message, user: user.dataValues })
            return cb(null, user, { message: 'Logged In Successfully via Local Strategy' });

            // return cb(null, user);
        } catch (err) {
            cb(err)
            // return res.status(400).send({message: 'Incorrect username/email or password'})
        }
    }
)

// const passportLocalStrategyAll = passport.authenticate(passportLocalStrategy, { failureRedirect: '/logan' })
const passportLocalStrategyAll = passport.authenticate(passportLocalStrategy)

passport.serializeUser(function (user, cb) {
    console.log('\n---------> Serialize user')
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    console.log('\n---------> Deserialize user')
    cb(null, obj);
});

module.exports = passportLocalStrategyAll;