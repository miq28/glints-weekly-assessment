const express = require("express");
const router = express.Router();
const homeController = require("../controller/home");
const uploadController = require("../controller/upload");
const upload = require("../middleware/upload");


const imageController= require('../controller/upload');

let routes = (app) => {
    router.get("/",
        homeController.getHome
    );

    router.post("/upload",
        upload.single("file"),
        uploadController.uploadFiles
    );

    router.get('/display-image',imageController.displayImage);

    router.get('/get-projects',imageController.getAllProjects);
    router.get('/render',imageController.render);

    return app.use("/", router);
};

module.exports = routes;