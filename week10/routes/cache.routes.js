const cache = require('../controllers/cache.controller')
const authJwt = require('../auth/auth.jwt')

module.exports = app => {
    var router = require("express").Router();
  
    // Create a new district
    router.get("/all", cache.all);
  
    app.use('/api/cache', authJwt.verifyToken, router);
  };