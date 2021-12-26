const auth = require('../auth/auth.jwt')
const authGoogle = require('../auth/auth.google')

module.exports = app => {
    const root = require("../controllers");

    var router = require("express").Router();

    router.get('/protected',
        auth.verifyToken,
        root.protected
    );


    router.get('/',
        // auth.verifyToken,
        (req, res) => {
            res.sendFile('home.html', { root: process.cwd() + '/public' })
        })

    router.get('/signin', (req, res) => {
        // res.sendFile('signin.html', { root: process.cwd() + '/public' })
        res.sendFile('signin-email-form.html', { root: process.cwd() + '/public' })
    })

    router.get('/signin/email', (req, res) => {
        res.sendFile('signin-email-form.html', { root: process.cwd() + '/public' })
    })

    router.post('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
        console.log(`-------> User Logged out`)
    });

    router.get('/adduser', (req, res) => {
        res.sendFile('adduser-form.html', { root: process.cwd() + '/public' })
    })

    router.get('/auth/google', authGoogle.GoogleAuth, (req, res) => {
        res.sendFile('home.html', { root: process.cwd() + '/public' })
    })

    router.get('/google/callback', authGoogle.GoogleCallback, (req, res) => {
        console.log('redirected', req.user)
        let user = {
            first_name: req.user.name.givenName,
            last_name: req.user.name.familyName,
            displayName: req.user.displayName,
            name: req.user.name.givenName,
            email: req.user._json.email,
            provider: req.user.provider
        }

        const payload = user

        // FindOrCreate(user)

        let token_duration;

        if (req.body.token_duration && req.body.token_duration !== null) {
            token_duration = Number(req.body.token_duration)
        } else token_duration = process.env.ACCESS_TOKEN_EXPIRE

        

        const { accessToken, refreshToken } = auth.GenerateToken(payload, token_duration)

        // res.cookie('jwt', accessToken)
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)
        res.redirect('/protected')
    })

    app.use('/', router);
};