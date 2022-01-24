## Assessment Week 14 PTB Batch 1 (miq28)

Topik kali ini adalah tentang penanganan dokumen (file handling).
Defaultnya pakai library multer, tapi pakai library lain juga silahkan.

### Misalkan ada satu route sebagai berikut:
```javascript
router.post('/add', (req, res, next) => {
    // ...
})
```

### Bagaimana caranya supaya route tersebut dapat menerima satu file? (a.k.a memasang library file handling di route tersebut)
Agar route di atas bisa menerima satu file, kita harus menggunakan middleware file handling yang kita sisipkan sebelum mencapai controller akhir, misalnya multer.
Jika menggunakan multer, bisa menggunakan option ```limits```.

```javascript
// panggil multer
const multer = require('multer');

// option limit untuk multer
var limits = {
    files: 1, // membatasi hanya 1 file per request
};

// deklarasi middleware
var upload = multer ({
    limits: limits
});

// Sisipkan middleware multer di route
router.post('/add', upload.single('mypdf'), (req, res, next) => {
    // ...
})
```

### Tuliskan kode untuk konfigurasi apabila ingin membatasi ukuran file yang masuk maksimal 15mb
Jika menggunakan ```multer```, gunakan option ```fileSize```
```javascript
var limits = {
    fileSize: 15 * 1024 * 1024, // 15 MB (maksimum ukuran file 15 MB)
};

var upload = multer ({
    limits: limits
});
```

### Tuliskan kode untuk konfigurasi apabila ingin membatasi format file yang masuk hanya pdf
Jika menggunakan ```multer```, gunakan option ```fileFilter```
```javascript
var fileFilter = function (req, file, cb) {
    if (file.mimetype == "application/pdf") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only PDF format allowed!'));
    }

};

var upload = multer({
    fileFilter: fileFilter
});
```

### Ada istilah "Base64", apa itu dan apa kaitannya dengan file handling?
Dalam pemrograman komputer, Base64 adalah salah satu kumpulan skema encoding yang masuk dalam kelompok "binary-to-text", yaitu teknik encoding yang merepresentasikan data biner ke dalam format string ASCII dengan cara mengubah data tersebut ke dalam format radix-64.

Seperti pada umumnya untuk teknik encoding "binary-to-text", Base64 di rancang untuk membawa data dalam format binary dimana protocol komunikasi yang digunakan memang reliable untuk data/konten yang berupa teks (text).
Base64 mungkin paling sering digunakan dalam WWW (World Wide Web) dimana salah satu kemampuannya untuk mengikutkan (embedded) gambar atau aset data biner lainnya didalam aset-aset tekstual semisal file HTML atau CSS.