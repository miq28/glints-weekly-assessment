const express = require('express')
const router = express.Router()
const db = require("./db/data")
const { findData, updateData, deleteData } = require("./index")

// middleware
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', (req, res) => {
    try {
        const records = db;
        let obj = new Object
        obj.code = 200
        obj.status = 'Ok'
        obj.data = records
        res.status(200).send(obj);
    } catch (err) {
        res.status(400).send(err);
    }
})


router.get('/:id', (req, res) => {
    const { id } = req.params
    try {
        const obj = findData(id);
        if (!obj.record) {
            res.status(400).send(obj.msg)
        } else {
            res.send(obj);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const newData = req.body
    console.log(newData)
    try {
        const obj = updateData(id, newData);
        if (!obj.record) {
            res.status(400).send(obj.msg)
        } else {
            res.send(obj);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    try {
        const record = deleteData(id);
        if (!record) {
            res.status(400).send(`Record with id ${id} not found...`)
        } else {
            res.send(record);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})




module.exports = router

