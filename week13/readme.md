## Assessment Week 13 PTB Batch 1 (miq28)

### Apa itu cookies dan seperti apa rupanya?
Cookies adalah file/data berukuran kecil yang dikirim dari server ke client (saat ada server request) dan disimpan di sisi client. Setiap kali client nge-load website yang sama tersebut, cookies juga otomatis akan ikut terkirim / ikut dalam request.

Penggunaan cookies antara lain:
- Session management
- Personalization
- User tracking

### Apa saja yang bisa disimpan di cookies?

*Common practice* sih cookie dipakai untuk menyimpan session ID, jwt token / username / email (sudah di enkripsi), atau informasi relevan lainnya terkait database (atau file atau apapun) yang berkaitan dengan server, dan terindex berdasarkan session ID tadi.

### Apa saja yang tidak boleh disimpan di cookies?

Pastinya bukan password! 😁 ... atau informasi lain yang sensitif semisal nomor kartu kredit, NIK dll.
Ingat cookie tersimpan di komputer pengguna, dan komputer pengguna bisa dipakai oleh siapa saja, dan mudah diakses.

### Dalam framework ExpressJS, kapan memakai ```req.cookies``` dan ```res.cookies``` ?

```req.cookies``` digunakan untuk nge-parsing cookie yang diterima oleh server saat incoming server request, menggunakan paket ```cookie-parser```.

```res.cookies``` digunakan saat server ingin mengirim cookies ke client.