const db = require("../models");
const District = db.district;
const Regency = db.regencie;
const Province = db.province;
const Op = db.Sequelize.Op;
const { isEmptyObject } = require("../utils")

// render
exports.render = async (req, res) => {
  try {
      const data = await District.findAll({ where: null, attributes: null })
      res.render('districts.view.ejs', { data: data });
      // res.render('test.ejs', { users: data });  
  } catch (err) {
      res.status(400).send({
          message: err.message
      });
  }
};

// Create and Save a district
exports.create = async (req, res) => {
  // Validate request
  if (isEmptyObject(req.query)) {
    res.status(400).send({
      message: " Bad query or query is empty!"
    });
    return;
  }

  // Create a Province
  const district = {
    name: req.query.name,
    // description: req.body.description,
    // published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  // Province.create(province)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the Tutorial."
  //     });
  //   });

  try {
    const data = await District.create(district)
    res.send(data);
  } catch (err) {
    err.message = err.message + '. ' + err.original.detail
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {

  // const name = req.query.name
  // var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  var condition;
  var include;
  if (isEmptyObject(req.query)) {

    condition = null;
    include = null;
  }
  else if (req.query.regencyId) {
    condition = { regency_id: req.query.regencyId }
    include = null;
  }
  else if (req.query.provinceId) {
    condition = null
    include = [
      {model: Regency, where: { province_id: req.query.provinceId }, required: true},
      // {model: Regency},
      // {model: Province, where: { id: req.query.provinceId }, required: true}
    ];
  }
  else {
    res.status(400).send('Bad query. Possible keyword: regencyId | provinceId')

    return;
  }

  try {
    const data = await District.findAll({
      where: condition,
      include: include
    })
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }

};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await District.findByPk(id);
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message:
        err.message || "Some error occurred while retrieving provinces."
    });
  }
};