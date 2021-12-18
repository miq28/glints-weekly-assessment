// routes/index.js

module.exports = app => {
    require("./other.routes")(app);
    require("./province.routes")(app);
    require("./regency.routes")(app);
    require("./district.routes")(app);
    require("./user.routes")(app);
    require("./office.routes")(app);
};