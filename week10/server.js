require('dotenv').config()
const express = require("express");
var cors = require('cors')
const app = express()
const NODE_PORT = process.env.PORT || process.env.NODE_PORT || 8000
const cookieParser = require('cookie-parser')
const session = require('express-session')

// const passport = require('./passport');
const passport = require('passport');

app.use(express.static('public'));

app.set('view engine', 'ejs');





const db = require("./models");
db.sequelize.sync();

// CORS
var corsOptions = {
    exposedHeaders: '*'
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(passport.initialize());
// app.use(passport.session())

// checkAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) { return next() }
//     // res.redirect("/signin")
// }


// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

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


require('./routes')(app)


app.listen(NODE_PORT, '0.0.0.0', () => {
    console.log(`server is listening on http://localhost:${NODE_PORT}`);
});