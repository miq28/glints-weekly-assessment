const express = require('express')
const router = express.Router()
const {isEmptyObject} = require('../utils')
const db = require('../database/connection')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', [
    GET_ALL_REGENCIES,
    GET_REGENCY_BY_REGENCY_ID,
    GET_REGENCY_BY_PROVINCE_ID
])



async function GET_ALL_REGENCIES(req, res, next) {
    try {
        if (isEmptyObject(req.query)) {
            const { rows } = await db.query('SELECT * FROM regencies ORDER BY id ASC;')
            res.send(rows)
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_REGENCY_BY_REGENCY_ID(req, res, next) {
    try {
        const { id, provinceId } = req.query
        if (id && provinceId === undefined) {
            const { rows } = await db.query('SELECT * FROM regencies WHERE id = $1;', [id])
            rows[0] ?
                res.send(rows[0]) : res.status(400).send(`Regency with id ${id} not exist`);
        }
        next();
    } catch (error) { 
        res.status(400).send(error.message)
    }
}

async function GET_REGENCY_BY_PROVINCE_ID(req, res, next) {
    try {
        const { id, provinceId } = req.query
        if (id === undefined && provinceId) {
            const { rows } = await db.query('SELECT * FROM regencies WHERE province_id = $1;', [provinceId])
            rows[0] ?
                res.send(rows) : res.status(400).send(`Regency with province_id ${provinceId} not exist`);
        }
        // Other than that, return bad request
        else {
            res.status(400).send('Bad request bro')
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}


module.exports = router