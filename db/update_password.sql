update users
set user_hash = $2
where user_email = $1;