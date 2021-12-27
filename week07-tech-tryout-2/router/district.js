const express = require('express')
const router = express.Router()
const {isEmptyObject} = require('../utils')
const db = require('../database/connection')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', [
    GET_ALL_DISTRICTS,
    GET_DISTRICT_BY_DISTRICT_ID,
    GET_DISTRICT_BY_PROVINCE_ID
])

async function GET_ALL_DISTRICTS(req, res, next) {
    try {
        if (isEmptyObject(req.query)) {
            const { rows } = await db.query('SELECT * FROM districts ORDER BY id ASC;')
            res.send(rows)
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_DISTRICT_BY_DISTRICT_ID(req, res, next) {
    try {
        const { id, provinceId } = req.query
        if (id && provinceId === undefined) {
            const { rows } = await db.query('SELECT * FROM districts WHERE id = $1;', [id])
            rows[0] ?
                res.send(rows[0]) : res.status(400).send(`District with id ${id} not exist`);
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_DISTRICT_BY_PROVINCE_ID(req, res, next) {
    try {
        const { id, provinceId } = req.query
        if (id === undefined && provinceId) {

            const myquery = {
                text: `
                SELECT d.id, d.regency_id, d.name, d.created_at, d.updated_at, d.deleted_at
                FROM districts d
                INNER JOIN regencies r
                    ON d.regency_id = r.id
                INNER JOIN provinces p 
                    ON r.province_id = p.id
                WHERE p.id = $1;
                `,
                values: [provinceId]
              }
              
            const { rows } = await db.query(myquery)

            rows[0] ?
                res.send(rows) : res.status(400).send(`District with province_id ${provinceId} not exist`);
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