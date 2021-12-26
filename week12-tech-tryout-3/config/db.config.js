// WARNING: NOT USED. See model/index.js for used config

module.exports = {
  HOST: process.env.DBHOST,
  USER: process.env.DBUSER,
  PASSWORD: process.env.DBPASSWORD,
  DB: process.env.DBDATABASE,
  dialect: process.env.DBDIALECT,
  "timestamps": false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};