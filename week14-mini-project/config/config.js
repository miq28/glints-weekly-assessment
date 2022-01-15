const fs = require('fs');

module.exports = {
    development: {
        username: 'rcmfqpvzlqzbpq',
        password: 'b24a629651197a29a752f9f1c9664d00a432ec157e953ad2903984ff40aa83a9',
        database: 'dbhao2rjtpfruo',
        host: 'ec2-52-205-3-3.compute-1.amazonaws.com',
        port: 5432,
        dialect: 'postgres',
        // dialectOptions: {
        //   bigNumberStrings: true
        // }
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
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
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOSTNAME,
        port: process.env.PROD_DB_PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            //   ssl: {
            //     ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
            //   }
        }
    }
};