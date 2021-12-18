const auth = require('../auth/auth.jwt')

module.exports = app => {
    const root = require("../controllers");

    var router = require("express").Router();

    router.get('/protected', auth, root.protected);

    app.use('/', router);
};