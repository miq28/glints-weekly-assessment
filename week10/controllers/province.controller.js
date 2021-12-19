const db = require("../models");
const Province = db.province;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("../utils")

// render
exports.render = async (req, res) => {
  try {
      const data = await Province.findAll({ where: null, attributes: null })
      res.render('provinces.view.ejs', { data: data });
      // res.render('test.ejs', { users: data });  
  } catch (err) {
      res.status(400).send({
          message: err.message
      });
  }
};

// Create a province
exports.create = async (req, res) => {
  // Validate request
  if (isEmptyObject(req.query)) {
    res.status(400).send({
      message: " Bad query or query is empty!"
    });
    return;
  }

  // Create a Province
  const province = {
    name: req.query.name,
    // description: req.body.description,
    // published: req.body.published ? req.body.published : false
  };

  try {
    const data = await Province.create(province)
    res.send(data);
  } catch (err) {
    err.message = err.message + '. ' + err.original.detail
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }
};

// Retrieve all provinces
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
    const data = await Province.findAll({ where: condition })
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }

};

// Find a province
exports.findOne = async (req, res) => {
  const id = req.params.id;
  var condition = id ? { id: id } : null;

  try {
    const data = await Province.findByPk(id);
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }
};