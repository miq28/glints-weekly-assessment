const db = require("../models");
const Regency = db.regency;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("../utils")

// render
exports.render = async (req, res) => {
  try {
      const data = await Regency.findAll({ where: null, attributes: null })
      res.render('regencies.view.ejs', { data: data });
      // res.render('test.ejs', { users: data });  
  } catch (err) {
      res.status(400).send({
          message: err.message
      });
  }
};


// Create and Save a regency
exports.create = async (req, res) => {
  // Validate request
  if (isEmptyObject(req.query)) {
    res.status(400).send({
      message: " Bad query or query is empty!"
    });
    return;
  }

  // Create a regency
  const province = {
    name: req.query.name,
  };

  try {
    const data = await Regency.create(province)
    res.send(data);
  } catch (err) {
    err.message = err.message + '. ' + err.original.detail
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }
};

// Retrieve all regency
exports.findAll = async (req, res) => {

  var condition;
  if (isEmptyObject(req.query)) {

    condition = null;
  }
  else if (req.query.provinceId) {
    condition = { province_id: req.query.provinceId }
  }
  else {
    res.status(400).send('Bad query. Possible keyword: name')

    return;
  }

  try {
    const data = await Regency.findAll({ where: condition })
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message
    });
  }

};

// Find a regency with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  var condition = id ? { id: id } : null;

  try {
    const data = await Regency.findByPk(id);
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message
    });
  }
};