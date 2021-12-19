var cache = require('express-redis-cache')({
    host: 'redis-18503.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 18503,
    auth_pass: 'A1U9UmEZjDuJjBP1lXzZe8Ifyu6vzSK8',
    expire: 15
});

cache.on('connected', function () {
    console.log('Connected to Redis')
});

module.exports = cache;
