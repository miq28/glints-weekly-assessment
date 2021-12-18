// routes/index.js

const auth = require('../auth/auth.jwt')

module.exports = app => {
    require("./other.routes")(app);
    require("./province.routes")(app);
    require("./regency.routes")(app);
    require("./district.routes")(app);
    require("./user.routes")(app);
    require("./office.routes")(app);
};

// module.exports = app => {
//     const root = require("../controllers");

//     var router = require("express").Router();

//     router.get('/protected', auth, root.protected);

//     app.use('/', router);
// };

// require("./routes")(app);
// require("./province.routes")(app);
// require("./regency.routes")(app);
// require("./district.routes")(app);
// require("./user.routes")(app);
// require("./office.routes")(app);

// require("./routes")(app);
// require("./routes/province.routes")(app);
// require("./routes/regency.routes")(app);
// require("./routes/district.routes")(app);
// require("./routes/user.routes")(app);
// require("./routes/office.routes")(app);