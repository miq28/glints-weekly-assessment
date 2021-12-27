require('dotenv').config()
const express = require("express");
const app = express()
const PORT = process.env.PORT
const routerApi = require("./router")


app.get("/", (req, res) => {
    res.status(200).send("Welcome to profile api")
});

// app.use('/', (req, res) => res.redirect('/province'))

app.use("/api", routerApi)


app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});