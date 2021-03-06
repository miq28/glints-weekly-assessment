const auth = require("../controllers/auth.controller");
const authJwt = require('../auth/auth.jwt')

module.exports = function (app) {

    var router = require("express").Router();

    router.post("/refreshtoken", auth.refreshToken);

    router.post("/login", auth.login);

    router.post("/logout", (req, res, next) => {
        // Delete user refresh token from Redis
        redis.del(req.body.uid);

        // ... and then remove httpOnly cookies from browser
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.redirect("/");
    });



    router.post('/verifytoken',
        // authJwt.verifyToken,
        auth.verifyToken
    );

    app.use('/api/auth', router);
};