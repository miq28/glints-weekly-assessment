const auth = require('../auth/auth.jwt')

module.exports = app => {
    const root = require("../controllers");

    var router = require("express").Router();

    router.get('/protected',
        auth.verifyToken,
        root.protected
    );


    router.get('/', (req, res) => {
        res.sendFile('home.html', { root: process.cwd() + '/public' })
    })

    router.get('/signin', (req, res) => {
        res.sendFile('signin.html', { root: process.cwd() + '/public' })
    })

    router.post('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
        console.log(`-------> User Logged out`)
    });

    router.get('/adduser', (req, res) => {
        res.sendFile('adduser-form.html', { root: process.cwd() + '/public' })
    })

    app.use('/', router);
};