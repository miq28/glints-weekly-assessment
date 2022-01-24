let multer = require('multer');

// File upload folder
const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var limits = {
    files: 1, // allow only 1 file per request
    fileSize: 15 * 1024 * 1024, // 15 MB (max file size)
};

var fileFilter = function (req, file, cb) {
    if (file.mimetype == "application/pdf") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only PDF format allowed!'));
    }

};

var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

// POST
app.post('/add', upload.single('mypdf'), (req, res, next) => {

    // put your routing logic here

    res.status(201).json({
        message: "File uploaded successfully!",
    })

})