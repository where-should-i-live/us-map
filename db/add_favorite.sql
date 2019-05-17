INSERT INTO favorites (
    user_id,
    favorite_county_id
) VALUES (
    $1,
    $2
);

SELECT favorites.favorite_id, favorites.user_id, county.county_name, county.county_state_name, household_income, property_value, commute_time, median_age, favorites.favorite_note FROM favorites
JOIN users ON users.user_id = favorites.user_id
JOIN county ON favorites.favorite_county_id = county.county_id
WHERE favorites.user_id = $1
ORDER BY county.county_name asc, county.county_state_name asc;