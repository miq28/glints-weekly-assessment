var cache = require('../cache')

exports.all = async (req, res) => {
    try {
        var obj = {}
        console.log('cacheeee')
        cache.get(function (error, entries) {
            if (error) throw error;
            
            // console.log(entries)
            // return res.send(entries)
            // entries.forEach(console.log.bind(console));
            entries.forEach((val, index)=>{
                // console.log.bind(console);
                console.log(val)
                obj[index]= val;
            });
            // return res.send(obj)
        });
        res.send(obj)
        
    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
};
