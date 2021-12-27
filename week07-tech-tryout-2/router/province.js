const express = require('express')
const router = express.Router()
const { isEmptyObject } = require('../utils')
const db = require('../database/connection')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get('/', [
    GET_ALL_PROVINCES,
    GET_PROVINCE_BY_PROVINCE_ID,
    GET_PROVINCE_BY_KEYWORD,
    GET_PROVINCE_BY_REGENCY_ID,
    GET_PROVINCE_BY_DISTRICT_ID
])
router.put('/', [
    UPDATE_PROVINCE_BY_ID,
])
router.post('/', [
    ADD_PROVINCE
])
router.delete('/', [
    DELETE_PROVINCE_BY_ID
])


async function GET_ALL_PROVINCES(req, res, next) {
    try {
        if (isEmptyObject(req.query)) {
            const { rows } = await db.query('SELECT * FROM provinces ORDER BY id ASC;')
            res.send(rows)
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_PROVINCE_BY_PROVINCE_ID(req, res, next) {
    try {
        const { id, keyword } = req.query
        if (id && keyword === undefined) {
            const { rows } = await db.query('SELECT * FROM provinces WHERE id = $1;', [id])

            rows[0] ?
                res.send(rows[0]) : res.status(400).send('Province not exist');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_PROVINCE_BY_KEYWORD(req, res, next) {
    try {
        const { id, keyword } = req.query
        if (id === undefined && keyword) {
            console.log('keyword:', keyword)
            const { rows } = await db.query("SELECT * FROM provinces WHERE name ILIKE '%' || $1 || '%' ORDER BY id ASC;", [keyword])
            rows[0] ?
                res.send(rows) : res.status(400).send(`No province name contain '${keyword}' keyword`);
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_PROVINCE_BY_REGENCY_ID(req, res, next) {
    try {
        const { regencyId } = req.query
        if (regencyId) {
            const myquery = {
                text:
                `
                SELECT p.id, p.name, p.created_at, p.updated_at, p.deleted_at
                FROM provinces p
                INNER JOIN regencies r
                    ON r.province_id = p.id
                WHERE r.id = $1;
                `,
                values: [regencyId]
            }

            const { rows } = await db.query(myquery)

            rows[0] ?
                res.send(rows[0]) : res.status(400).send(`Regency id '${regencyId}' not exist!`);
        } else {
            next();
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function GET_PROVINCE_BY_DISTRICT_ID(req, res, next) {
    try {
        const { districtId } = req.query
        if (districtId) {
            const myquery = {
                text:`
                SELECT p.id, p.name, p.created_at, p.updated_at, p.deleted_at
                FROM provinces p
                INNER JOIN regencies r
                    ON r.province_id = p.id
                INNER JOIN districts d
                    ON d.regency_id = r.id
                WHERE d.id = $1;
                `,
                values: [districtId]
            }

            const { rows } = await db.query(myquery)

            rows[0] ?
                res.send(rows[0]) : res.status(400).send(`District id '${districtId}' not exist!`);
        } else {
            res.status(400).send(`Bad request bro`);
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function UPDATE_PROVINCE_BY_ID(req, res, next) {
    try {
        const { id, name } = req.query
        if (id && name) {
            const { rows } = await db.query('UPDATE provinces SET name=$2, updated_at=$3 WHERE id = $1 RETURNING *', [id, name, new Date()])
            if (rows[0]) {
                res.send(rows[0])
            }
            else res.status(400).send('Province not exist')
        } else {
            res.status(400).send('Bad request bro')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function ADD_PROVINCE(req, res, next) {
    try {
        const { name } = req.query
        if (name) {
            const { rows } = await db.query('INSERT INTO provinces(name) VALUES ($1) RETURNING *', [name])
            res.send(rows[0])
        } else {
            res.status(400).send('Bad request bro')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function DELETE_PROVINCE_BY_ID(req, res, next) {
    try {
        const { id } = req.query
        if (id) {
            const { rows } = await db.query('DELETE FROM provinces WHERE id = $1 RETURNING *', [id])
            if (rows[0]) {
                res.send(rows[0])
            } else
                res.status(400).send('Province not exist')
        } else {
            res.status(400).send('Bad request bro')
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message)
    }
}


module.exports = router