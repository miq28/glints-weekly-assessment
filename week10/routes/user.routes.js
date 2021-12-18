const AUTH = require('../auth')

module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.get('/me',
    AUTH.authJWT.verifyToken,
    user.welcome
  );

  // Retrieve all Users
  router.get("/", user.findAll);

  // render users
  router.get("/render", user.render);

  // User welcome
  router.get("/welcome",
    AUTH.authJWT.verifyToken,
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
    AUTH.authLocal,
    user.authEmail
  );


  app.use('/api/users', router);
};