require('dotenv').config()
const express = require("express");
const app = express()
const PORT = process.env.PORT
const db = require('./database/connection')

// routers
const provinceRoute = require("./router/province")


app.get("/", (req, res) => {
    res.status(200).send("Welcome to profile api")
});

app.use("/province", provinceRoute)


app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});