const authJwt = require('../auth/auth.jwt')
const authLocal = require('../auth/auth.local')
const cache = require('../cache')

module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();
  const cache = require('../cache')

  // router.get('/me',
  //   authJwt.verifyToken,
  //   user.welcome
  // );

  // Retrieve all Users
  router.get("/", user.findAll);

  // render users
  // router.get("/render", user.render);

  // User welcome
  router.get("/welcome",
    authJwt.verifyToken,
    user.welcome
  );

  // Retrieve 1 user
  // router.get("/:id", user.findOne);

  // User sign-up
  router.post("/signup", user.signup);

  // User sign-in by email
  router.post("/signin", user.signin);

  // router.get("/auth/email", user.getAuthEmail);

  // User sign-in by email
  router.post("/auth/email",
    authLocal,
    user.authEmail
  );


  app.use('/api/users', cache.route(), router);
};