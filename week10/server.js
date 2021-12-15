require('dotenv').config()
const express = require("express");
var cors = require('cors')
const app = express()
const NODE_PORT = process.env.PORT || process.env.NODE_PORT || 8000
const cookieParser = require('cookie-parser')
const session = require('express-session')

require('./passport');

app.set('view engine', 'ejs');




// const app = express();
// app.use(...);

const db = require("./models");
db.sequelize.sync();

app.use(cors())
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//Middleware
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

const passport = require('passport')
app.use(passport.initialize());
app.use(passport.session())
const jwt = require('jsonwebtoken')
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
opts.secretOrKey = process.env.TOKEN_KEY;
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


//console.log() values of "req.session" and "req.user" so we can see what is happening during Google Authentication
let count = 1
showlogs = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)

    console.log(`\n req.user -------> `)
    console.log(req.user)

    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`)
    console.log(`req.session.cookie -------> `)
    console.log(req.session.cookie)

    console.log("===========================================\n")

    next()
}

app.use(showlogs)


passport.serializeUser(function (user, cb) {
    console.log('\n--------> Serialize user')
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    console.log('\n--------- Deserialize user')
    cb(null, obj);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

    passReqToCallback: true,
    proxy: true
},
    function (req, accessToken, refreshToken, profile, done) {
        // console.log(accessToken, refreshToken, profile)
        console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
        return done(null, profile)
    }
));


app.get('/', (req, res) => {
    res.sendFile('home.html', { root: __dirname + '/public' })
})

app.get('/signin', (req, res) => {
    res.sendFile('signin.html', { root: __dirname + '/public' })
})

app.post('/signout', function (req, res) {
    req.logout();
    res.redirect('/');
    console.log(`-------> User Logged out`)
});

app.get('/adduser', (req, res) => {
    res.sendFile('adduser-form.html', { root: __dirname + '/public' })
})

app.get('/auth/email', (req, res) => {
    res.sendFile('signin-email-form.html', { root: __dirname + '/public' })
})

checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    // res.redirect("/signin")
}

// app.post('/api/users/auth/email', passport.authenticate('jwt', { session: true}), (req, res) => {
//     res.send(`Hello ${req.user.first_name} ${req.user.last_name}, you are now authenticated.`)
// })


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))




app.get("/protected", passport.authenticate('jwt', { session: true}), (req, res) => {
    // res.render("dashboard.ejs", {name: req.user.displayName})
    if (req.user.provider === 'google') {
        return res.send(`Hello ${req.user.displayName}, you are now authenticated and can access /protected route.`)
    }
    res.send(`Hello ${req.user.first_name} ${req.user.last_name}, you are now authenticated and can access /protected route.`)

})


// app.get('/protected', checkAuthenticated, passport.authenticate('jwt', { session: true}), (req, res) => {
//     res.send(`Hello ${req.user.first_name} ${req.user.last_name}, you are now authenticated.`)
// })

app.get('/google/callback', passport.authenticate('google'), (req, res) => {
    console.log('redirected', req.user)
    let user = {
        first_name: req.user.name.givenName,
        last_name: req.user.name.familyName,
        displayName: req.user.displayName,
        name: req.user.name.givenName,
        email: req.user._json.email,
        provider: req.user.provider
    }

    // FindOrCreate(user)

    let token = jwt.sign(
        user,
        process.env.TOKEN_KEY,
        { expiresIn: '1h' }
    );

    res.cookie('jwt', token)
    res.redirect('/protected')
})

require("./routes/province.routes")(app);
require("./routes/regency.routes")(app);
require("./routes/district.routes")(app);
require("./routes/user.routes")(app);
require("./routes/office.routes")(app);



app.listen(NODE_PORT, '0.0.0.0', () => {
    console.log(`server is listening on http://localhost:${NODE_PORT}`);
});