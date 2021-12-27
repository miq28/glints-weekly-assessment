// this is file to connect to DB

const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information



//----uncomment this to reset the database
/*
  const client = new Client()

  async function resetDb() {
    await client.connect()
    await client.query(resetTableQuery)
    await client.end()
  }
  console.log(`resetting Database [ ${process.env.PGDATABASE} ]`)
  resetDb()
*/

const pool = new Pool()

module.exports = {
  async query(text, params) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  },
  async getClient() {
    const client = await pool.connect()
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!')
      console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args
      return query.apply(client, args)
    }
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout)
      // set the methods back to their old un-monkey-patched version
      client.query = query
      client.release = release
      return release.apply(client)
    }
    return client
  }
}

const resetTableQuery = `
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS regencies CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS sub_districts CASCADE;

-- create 'provinces' table
CREATE TABLE IF NOT EXISTS provinces (
	id serial PRIMARY KEY,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);

-- create 'regencies' table
CREATE TABLE IF NOT EXISTS regencies (
	id serial PRIMARY KEY,
  province_id integer,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp ,
    FOREIGN KEY (province_id)
        REFERENCES provinces(id)
        ON DELETE CASCADE
);


-- create 'districts' table
CREATE TABLE IF NOT EXISTS districts (
	id serial PRIMARY KEY,
    regency_id integer,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp ,
    FOREIGN KEY (regency_id)
        REFERENCES regencies(id)
        ON DELETE CASCADE
);

BEGIN WORK;
LOCK TABLE provinces IN ACCESS EXCLUSIVE MODE;
INSERT INTO provinces VALUES
  ('11', 'ACEH'),
  ('12', 'SUMATERA UTARA'),
  ('32', 'JAWA BARAT'),
  ('33', 'JAWA TENGAH'),
  ('34', 'DI YOGYAKARTA'),
  ('35', 'JAWA TIMUR'),
COMMIT WORK;

BEGIN WORK;
LOCK TABLE regencies IN ACCESS EXCLUSIVE MODE;
INSERT INTO regencies VALUES
  ('1101', '11', 'KABUPATEN SIMEULUE'),
  ('1102', '11', 'KABUPATEN ACEH SINGKIL'),
  ('1103', '11', 'KABUPATEN ACEH SELATAN'),
  ('1273', '12', 'KOTA PEMATANG SIANTAR'),
  ('1274', '12', 'KOTA TEBING TINGGI'),
  ('1275', '12', 'KOTA MEDAN'),

  ('3201', '32', 'KABUPATEN BOGOR'),
  ('3202', '32', 'KABUPATEN SUKABUMI'),
  ('3203', '32', 'KABUPATEN CIANJUR'),

  ('3301', '33', 'KABUPATEN CILACAP'),
  ('3302', '33', 'KABUPATEN BANYUMAS'),
  ('3303', '33', 'KABUPATEN PURBALINGGA'),

  ('3401', '34', 'KABUPATEN KULON PROGO'),
  ('3402', '34', 'KABUPATEN BANTUL'),
  ('3403', '34', 'KABUPATEN GUNUNG KIDUL'),

  ('3501', '35', 'KABUPATEN PACITAN'),
  ('3502', '35', 'KABUPATEN PONOROGO'),
  ('3503', '35', 'KABUPATEN TRENGGALEK'),
COMMIT WORK;

BEGIN WORK;
LOCK TABLE districts IN ACCESS EXCLUSIVE MODE;
INSERT INTO districts VALUES
  ('1101010', '1101', 'TEUPAH SELATAN'),
  ('1101020', '1101', 'SIMEULUE TIMUR'),
  ('1101021', '1101', 'TEUPAH BARAT'),
  ('1101022', '1101', 'TEUPAH TENGAH'),
  ('1102010', '1102', 'PULAU BANYAK'),
  ('1102011', '1102', 'PULAU BANYAK BARAT'),
  ('1102020', '1102', 'SINGKIL'),
  ('1102021', '1102', 'SINGKIL UTARA'),
  ('1103010', '1103', 'TRUMON'),
  ('1103011', '1103', 'TRUMON TIMUR'),
  ('1103012', '1103', 'TRUMON TENGAH'),
  ('1103020', '1103', 'BAKONGAN'),  
  ('1273010', '1273', 'SIANTAR MARIHAT'),
  ('1273011', '1273', 'SIANTAR MARIMBUN'),
  ('1273020', '1273', 'SIANTAR SELATAN'),
  ('1273030', '1273', 'SIANTAR BARAT'),
  ('1274010', '1274', 'PADANG HULU'),
  ('1274011', '1274', 'TEBING TINGGI KOTA'),
  ('1274020', '1274', 'RAMBUTAN'),
  ('1274021', '1274', 'BAJENIS'),
  ('1275010', '1275', 'MEDAN TUNTUNGAN'),
  ('1275020', '1275', 'MEDAN JOHOR'),
  ('1275030', '1275', 'MEDAN AMPLAS'),
  ('1275040', '1275', 'MEDAN DENAI');
COMMIT WORK;
`

