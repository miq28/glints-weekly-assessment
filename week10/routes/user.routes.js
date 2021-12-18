const authJWT = require("../auth/auth.jwt");
const passportLocalStrategyAll = require('../auth')

module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get('/me',
    authJWT,
    user.welcome
  );

  // Retrieve all Users
  router.get("/", user.findAll);

  // render users
  router.get("/render", user.render);

  // User welcome
  router.get("/welcome",
    authJWT,
    user.welcome
  );

  // Retrieve 1 user
  router.get("/:id", user.findOne);

  // User sign-up
  router.post("/signup", user.signup);

  // User sign-in by email
  router.post("/signin", user.signin);

  router.get("/auth/email", user.getAuthEmail);

  // User sign-in by email
  router.post("/auth/email",
    passportLocalStrategyAll,
    user.authEmail
  );





  app.use('/api/users', router);
};