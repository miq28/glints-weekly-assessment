var cache = require('../cache')

exports.all = async (req, res) => {
    try {

        console.log({info: 'GET ALL REDIS CACHE'})
        cache.get(function (error, entries) {
            if (error) throw error;

            var arr = []
            for (let i = 0; i < entries.length; i++) {
                const key = entries[i]
                arr[i] = key                
            }

            console.log(arr)
            return res.send(arr)
        });

    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
};
