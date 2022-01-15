const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const app = express();
const db = require("./db/models");
const initRoutes = require("./route/web");

global.__basedir = __dirname;

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

initRoutes(app);

// db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

let port = process.env.NODE_PORT; // default: 8000
app.listen(port, '0.0.0.0', () => {
  console.log(`App started on http://localhost:${port}`);
});