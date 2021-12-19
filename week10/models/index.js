'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/database.json')[env];
const db = {};

// const SequelizeAuto = require('sequelize-auto');




const dbConfig = require("../config/db.config.js");

/*
const auto = new SequelizeAuto(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    output: '../modelku', // where to write files
    port: dbConfig.PORT,
    caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
    singularize: true, // convert plural table names to singular model names
    additional: {
        timestamps: false
        // ...options added to each model
    },
    // tables: ['table1', 'table2', 'myschema.table3'] // use all tables, if omitted
    //...
})
*/

// auto.run().then(data => {
//   console.log(data.tables);      // table and field list
//   console.log(data.foreignKeys); // table foreign key list
//   console.log(data.indexes);     // table indexes
//   console.log(data.hasTriggerTables); // tables that have triggers
//   console.log(data.relations);   // relationships between models
//   console.log(data.text)         // text of generated models
// });

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: false
  },

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    // console.log(model)
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// console.log('DEEEEEEE BEEEEEEE', db)

// db.sequelize.sync();

module.exports = db;
