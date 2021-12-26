const db = require("../models");
const User = db.user;
const RefreshToken = db.refreshToken;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("../utils")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const { GenerateToken } = require('../auth/auth.jwt')

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {

    // const name = req.query.name
    // var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    var condition;
    if (isEmptyObject(req.query)) {

        condition = null;
    }
    else if (req.query.name) {
        condition = { name: { [Op.iLike]: `%${req.query.name}%` } }
    }
    else {
        res.status(400).send('Bad query. Possible keyword: name')

        return;
    }

    try {
        const data = await User.findAll({ where: condition, attributes: { exclude: ['password'] } })
        res.send(data);
    } catch (err) {
        res.status(400).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }

};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = id ? { id: id } : null;

    try {
        const data = await User.findByPk(id);
        if (data) return res.send(data)
        return res.status(400).send('User not exist')
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Create and Save a new Tutorial
exports.signup = async (req, res) => {
    try {
        // console.log(req)
        // Get user input
        const { first_name, last_name, district_id, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name && district_id)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ where: { email: email } });

        if (oldUser) {
            return res.status(409).send("Email address has been used. Please use other email address");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const createdUser = await User.create({
            first_name,
            last_name,
            district_id,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        const payload = {
            id: createdUser.id,
            first_name,
            last_name,
            email,
            district_id
        }

        let token_duration;

        if (req.body.token_duration && req.body.token_duration !== null) {
            token_duration = Number(req.body.token_duration)
        } else token_duration = process.env.ACCESS_TOKEN_EXPIRE

        const { accessToken, refreshToken } = GenerateToken(payload, token_duration)

        // convert sequelize object to json
        const objUser = createdUser.toJSON()


        // return new user
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)
        res.cookie('jwt', accessToken)
        return res.status(200).send({
            user: objUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
};

// User sign-in choose
exports.signin = async (req, res) => {
    res.sendFile('login_form.html', { root: process.cwd() + '/public' })
}

// User sign-in
exports.authEmail = async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        // const { email, password } = req.body;

        // res.redirect('/protected');
        // res.status(200).send('OKKE');
        const user = req.user

        const payload = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            district_id: user.district_id
        }

        let token_duration;

        if (req.body.token_duration && req.body.token_duration !== null) {
            token_duration = Number(req.body.token_duration)
        } else token_duration = process.env.ACCESS_TOKEN_EXPIRE

        const { accessToken } = GenerateToken(payload, token_duration)

        // Create user in our database
        const storedRefreshToken = await RefreshToken.createToken(
            // {
            //     token: refreshToken
            // }
            payload
        );

        console.log(storedRefreshToken)


        // res.status(200).send({user, token}).redirect('/protected');
        // res.set('x-token', token);
        // return res.redirect(200, '/protected');
        // res.header('Access-Control-Allow-Origin', req.headers.origin);


        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', storedRefreshToken)
        // res.cookie('jwt', accessToken)
        return res.status(200).json({
            // user,
            accessToken: accessToken,
            refreshToken: storedRefreshToken
        })

        // res.send('OK')

    } catch (err) {
        console.log(err);
        return res.status(400).send({err: err.message})
    }
    // Our register logic ends here

};


// User welcome
exports.welcome = (req, res) => {
    const second_expire = Math.round(req.user.exp - Date.now() / 1000)
    res.status(200).send({
        user: req.user,
        message: `Welcome ${req.user.first_name} 😁🤗🤡 <br>Your JWT token will expire in: ${second_expire} seconds`
    });
};

// Find a single Tutorial with an id
exports.render = async (req, res) => {
    try {
        const data = await User.findAll({ where: null, attributes: { exclude: ['password'] } })
        res.render('users.view.ejs', { users: data });
        // res.render('test.ejs', { users: data });  
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
};