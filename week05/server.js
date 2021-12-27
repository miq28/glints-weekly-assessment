// overall sudah bagus dan berjalan dengan baik
// tambahan mungkin jika ingin bekerja dengan banyak file
// bisa di manage dengan pembuatan folder sendiri
// contohnya untuk file router harusnya di tempatkan pada folder sendiri
// agar lebih rapi dan tertata
// bisa explore "design pattern" pada nodejs express
const express = require("express");
const app = express()
const router = require("./router")
const morgan = require('morgan');

app.use(morgan('tiny'));

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello this is my first API"
    })
});


app.use("/profile", router)



app.listen(8000, () => {
    console.log('\n--------------------------------------------')
    console.log(`server is listening on http://localhost:8000`);
    console.log('--------------------------------------------\n')
});



