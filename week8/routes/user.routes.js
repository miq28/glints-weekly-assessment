const auth = require("../middleware/auth");

module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Users
    router.get("/", user.findAll);

    // render users
    router.get("/render", user.render);

    // User welcome
    router.get("/welcome", auth, user.welcome);

    // Retrieve 1 user
    router.get("/:id", user.findOne);

    // User sign-up
    router.post("/signup", user.signup);

    // User sign-in by email
    router.post("/signin", user.signin);

    // User sign-in by email
    router.post("/auth/email", user.authEmail);


    
    app.use('/api/users', router);
  };