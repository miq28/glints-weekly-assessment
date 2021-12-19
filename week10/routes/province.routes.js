const { verifyToken } = require('../auth/auth.jwt')
const cache = require('../cache')

module.exports = app => {
  const provinces = require("../controllers/province.controller.js");

  var router = require("express").Router();

  // render province
  router.get("/render", provinces.render);

  // Create a province
  router.post("/", provinces.create);

  // Retrieve all province
  router.get("/",
    // cache.route(),
    provinces.findAll
  );

  // Retrieve a province by id
  router.get("/:id", provinces.findOne);

  app.use('/api/provinces', cache.route(), router);
};