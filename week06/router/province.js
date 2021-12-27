const express = require('express')
const router = express.Router()
const morgan = require('morgan')
router.use(morgan('dev'))
const db = require('../database/connection')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// get all provinces
router.get('/', async (req, res) => {
    const { id } = req.query
    if (id) {
        const { rows } = await db.query('SELECT * FROM provinces WHERE id = $1', [id])
        // res.send(rows[0])
        if (rows[0]) { res.send(rows[0]) }
        else res.status(400).send('Province not exist')
    } else {
        const { rows } = await db.query('SELECT * FROM provinces ORDER BY id ASC;')
        res.send(rows)
    }
})

// update 1 province by Id
router.put('/', async (req, res) => {
    try {
        const { id, name } = req.query
        if (id && name) {
            const now = new Date()
            const { rows } = await db.query('UPDATE provinces SET name=$2, updated_at=$3 WHERE id = $1 RETURNING *', [id, name, now])
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
})

// add 1 province
router.post('/', async (req, res) => {
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
})

// update 1 province by Id
router.delete('/', async (req, res) => {
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

})

module.exports = router