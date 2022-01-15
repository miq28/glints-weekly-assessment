const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DEV_DBUSER,
    password: process.env.DEV_DBPASS,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_DBHOST,
    port: process.env.DEV_DBPORT,
    dialect: process.env.DEV_DBDIALECT,
    // dialectOptions: {
    //   bigNumberStrings: true
    // }
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.DEV_DBUSER,
    password: process.env.DEV_DBPASS,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_DBHOST,
    port: process.env.DEV_DBPORT,
    dialect: process.env.DEV_DBDIALECT,
    // dialectOptions: {
    //   bigNumberStrings: true
    // }
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};