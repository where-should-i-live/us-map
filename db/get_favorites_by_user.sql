SELECT favorite_id, favorites.user_id, favorite_county_name, favorite_county_state_name, favorite_note FROM favorites
JOIN users ON users.user_id = favorites.user_id
WHERE favorites.user_id = $1
ORDER BY favorite_county_name asc, favorite_county_state_name asc;