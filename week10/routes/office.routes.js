const authJwt = require('../auth/auth.jwt')

module.exports = app => {
  const office = require("../controllers/office.controller.js");
  const cache = require('../cache')

  var router = require("express").Router();

  // Retrieve all offices
  router.get("/", office.findAll);

  // Retrieve all offices
  router.get("/", office.findAll);

  // Retrieve 1 office
  router.get("/:id", office.findOne);

  // Get offices in a province based on user Id
  router.get("/scope/province/reff/user/:id", office.GetOfficesByUserId);

  // Get an office by district Id
  router.get("/scope/province/reff/district/:id", office.GetOneOfficeByDistrictId);

  app.use('/api/offices', authJwt.verifyToken, cache.route(), router);
};