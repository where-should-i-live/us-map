CREATE TABLE users (
	user_id serial NOT NULL,
	user_name varchar(200) NOT NULL,
	user_email varchar NOT NULL UNIQUE,
	-- user_pic TEXT,
	user_hash TEXT NOT NULL,
	CONSTRAINT Users_pk PRIMARY KEY (user_id)
);

CREATE TABLE favorites (
	favorite_id serial NOT NULL UNIQUE,
	user_id integer NOT NULL,
	favorite_county_name varchar(200),
	favorite_county_state_name varchar(200),
	favorite_note varchar(1000),
	CONSTRAINT Favorites_pk PRIMARY KEY (favorite_id)
);

ALTER TABLE favorites ADD CONSTRAINT favorites_fk0 FOREIGN KEY (user_id) REFERENCES users(user_id);



-- sample favorites values

-- INSERT INTO favorites (
--     user_id,
--     favorite_county_name,
--     favorite_county_state_name,
--     favorite_note
-- ) VALUES (
--     3,
--     'Salt Lake County',
--     'Utah',
--     'cool area, cheap rent'
-- ), (
--     3,
--     'Wasatch County',
--     'Utah',
--     'lots of farm land out here'
-- );
