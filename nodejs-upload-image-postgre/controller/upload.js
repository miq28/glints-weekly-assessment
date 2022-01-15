const fs = require("fs");
const { isEmptyObject } = require("../utils")

const db = require("../db/models");
const Image = db.Image;

const uploadFiles = async (req, res) => {
    try {
        console.log(req.file);

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        Image.create({
            type: req.file.mimetype,
            name: req.file.originalname,
            data: fs.readFileSync(
                __basedir + "/resources/static/assets/uploads/" + req.file.filename
            ),
        }).then((image) => {
            fs.writeFileSync(
                __basedir + "/resources/static/assets/tmp/" + image.name,
                image.data
            );

            return res.send(`File has been uploaded.`);
        });
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload images: ${error}`);
    }
};


const displayImage = async (req, res) => {

    var condition;
    if (isEmptyObject(req.query)) {
        condition = null;
    }
    else if (req.query.name) {
        condition = { name: { [Op.iLike]: `%${req.query.name}%` } }
    }
    else {
        res.status(400).send('Bad query. Possible keyword: name')
        return;
    }

    try {
        const data = await Image.findAll({ where: condition, attributes: { exclude: ['password'] } })
        res.send(data);
    } catch (err) {
        res.status(400).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }
};


const getAllProjects = async (req, res) => {
    try {
        const projects = await Image.findAll({
            // include: [
            //     {
            //         model: User,
            //         as: "createdBy",
            //     },
            // ],
        })
        await projects.map(project => {
            const projectImage = project.data.toString('base64')
            project['data'] = projectImage
        });
        return res.status(200).json({ projects: projects })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.mesage);
    }
};


const render = async (req, res) => {
    try {
        const data = await Image.findAll({ where: null, attributes: null })
        await data.map(el => {
            const projectImage = el.data.toString('base64')
            el['data'] = projectImage
        });
        res.render('provinces.view.ejs', { data: data });
        // res.render('test.ejs', { users: data });  
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
};




module.exports = {
    uploadFiles,
    displayImage,
    getAllProjects,
    render
};