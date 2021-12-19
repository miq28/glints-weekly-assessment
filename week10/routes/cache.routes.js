const cache = require('../controllers/cache.controller')

module.exports = app => {
    var router = require("express").Router();
  
    // Create a new district
    router.get("/all", cache.all);
  
    app.use('/api/cache', router);
  };