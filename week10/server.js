require('dotenv').config()
const express = require("express");
var cors = require('cors')
const app = express()
const NODE_PORT = process.env.PORT || process.env.NODE_PORT || 8000
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// var session = require('express-session')

// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//         secret: 'keyboard cat',
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             maxAge: 1000*10,
//             // secure: true
//         }
//     }))


// const passport = require('./passport');
const passport = require('passport');
const { application } = require('express');

app.use(express.static('public'));

app.set('view engine', 'ejs');

// CORS
var corsOptions = {
    exposedHeaders: '*',
    origin: true,
    credentials:  true, // to allow receive cookies sent by fetch
}
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize());

require('./routes')(app)

app.listen(NODE_PORT, '0.0.0.0', () => {
    console.log(`server is listening on http://localhost:${NODE_PORT}`);
});
