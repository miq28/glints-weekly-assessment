const { QueryTypes } = require('sequelize');
const db = require("../models");
const sequelize = db.sequelize;
const Office = db.office;
const District = db.district;
const Regency = db.regency;
const Province = db.province;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("../utils")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Retrieve all Offices from the database.
exports.findAll = async (req, res) => {

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
        const data = await Office.findAll({ where: condition, attributes: { exclude: ['password'] } })
        res.send(data);
    } catch (err) {
        res.status(400).send({
            message:
                err.message || "Some error occurred while retrieving users."
        });
    }

};

// Find a single office based on Id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    var condition = id ? { id: id } : null;

    try {
        const data = await Office.findByPk(id);
        if (data) return res.send(data)
        return res.status(400).send('User not exist')
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.GetOfficesByUserId = async (req, res) => {
    const user_id = req.params.id;

    try {
        const rawText =
            `
            WITH t AS (
                select p.id AS prov_id, p.name AS prov_name
                from users u
                INNER JOIN districts d ON d.id = u.district_id
                INNER JOIN regencies r ON r.id = d.regency_id
                INNER JOIN provinces p ON p.id = r.province_id
                where u.id = ${user_id}
            )
            select o.id, o.name AS office_name, p.name AS province
            from t, offices o
            INNER JOIN districts d ON d.id = o.district_id
            INNER JOIN regencies r ON r.id = d.regency_id
            INNER JOIN provinces p ON p.id = r.province_id
            WHERE p.id = t.prov_id;
            `
        const [results, metadata] = await sequelize.query(rawText)
        res.send(results)
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.GetOneOfficeByDistrictId = async (req, res) => {

    var condition, attributes, include

    if (isEmptyObject(req.params)) {
        return res.status(400).send({ message: "Bad query. Missing district Id"});
    }

    condition = {
        "district_id": Number(req.params.id)
    }

    attributes = null

    include = {
        model: District,
        include: {
            model: Regency,
            include: {
                model: Province
            }
        }
    }

    include = {
        model: District,
        include: {
            model: Regency,
            include: {
                model: Province
            }
        }
    }

    try {
        const data = await Office.findAll({ where: condition, attributes: attributes, include: include })
        res.send(data);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};