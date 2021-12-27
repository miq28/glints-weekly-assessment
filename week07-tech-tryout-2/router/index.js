const express = require('express')
const app = express.Router()

const morgan = require('morgan')
app.use(morgan('dev'))

const provinceRoute = require("./province")
const regencyRoute = require("./regency")
const districtRoute = require("./district")

app.use("/province", provinceRoute)
app.use("/regency", regencyRoute)
app.use("/district", districtRoute)

module.exports = app