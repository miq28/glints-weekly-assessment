DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS regencies CASCADE;
DROP TABLE IF EXISTS sub_districts CASCADE;

-- create 'provinces' table
CREATE TABLE IF NOT EXISTS provinces (
	id serial PRIMARY KEY,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp ,
);


-- create 'districts' table
CREATE TABLE IF NOT EXISTS districts (
	id serial PRIMARY KEY,
    province_id integer,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp ,
    FOREIGN KEY (province_id)
        REFERENCES provinces(id)
        ON DELETE CASCADE
);

-- create 'regencies' table
CREATE TABLE IF NOT EXISTS regencies (
	id serial PRIMARY KEY,
    district_id integer,
	name VARCHAR (255) UNIQUE NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp ,
    FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE CASCADE
);

