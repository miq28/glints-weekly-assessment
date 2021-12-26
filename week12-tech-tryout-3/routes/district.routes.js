const cache = require('../cache')
const {verifyToken} = require('../auth/auth.jwt')

module.exports = app => {
  const districts = require("../controllers/district.controller.js");

  var router = require("express").Router();

  // Create a new district
  router.get("/render", districts.render);

  // Create a new district
  router.post("/", districts.create);

  // Retrieve all district
  router.get("/", districts.findAll);

  // Retrieve district by id
  router.get("/:id", districts.findOne);

  app.use('/api/districts', verifyToken, cache.route(), router);
};