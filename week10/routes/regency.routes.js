const cache = require('../cache')

module.exports = app => {
  const regencies = require("../controllers/regency.controller.js");

  var router = require("express").Router();

  // render
  router.get("/render", regencies.render);

  // Create a new regency
  router.post("/", regencies.create);

  // Retrieve all regency
  router.get("/", regencies.findAll);

  // Retrieve a regency with id
  router.get("/:id", regencies.findOne);

  app.use('/api/regencies', cache.route(), router);
};