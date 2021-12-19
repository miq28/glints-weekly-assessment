require('dotenv').config()
const express = require("express");
var cors = require('cors')
const app = express()
const NODE_PORT = process.env.PORT || process.env.NODE_PORT || 8000
const cookieParser = require('cookie-parser')




// const passport = require('./passport');
const passport = require('passport');
const { application } = require('express');

app.use(express.static('public'));

app.set('view engine', 'ejs');

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

require('./routes')(app)
const cache = require('./cache')
// app.use(cache.route())





app.listen(NODE_PORT, '0.0.0.0', () => {
    console.log(`server is listening on http://localhost:${NODE_PORT}`);
});
