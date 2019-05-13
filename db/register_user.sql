INSERT INTO users (
    user_name,
    user_email,
    user_hash
) VALUES (
    $1,
    $2,
    $3
);

SELECT user_id, user_name, user_email FROM users WHERE user_name = $1;