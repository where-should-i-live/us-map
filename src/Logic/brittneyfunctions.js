module.exports = {
    testUserName: (user_name) => {
        if (user_name === '') {
            return 'Please enter your name.'
        } else {
            return 'Name accepted.'
        };
    },

    testEmailValidity: (email) => {
        if (email === '') {
            return 'Please enter your email address.';
        }
        if (!email.includes('@')) {
            return 'Invalid email address.'
        }
        else {
            return email;
        }
    },

    testPassword: (password) => {
        let number = false;
            for (let i = 0; i <= 9; i++) {
                if (password.includes(i)) {
                    number = true;
                };
            };

        let symbol = false;
            let symbols = ['!', '?', '@', '$', '#'];
            for (let i = 0; i < symbols.length; i++) {
                if (password.includes(symbols[i])) {
                    symbol = true;
                };
            };

        if (password === '') {
           return 'Please enter a password.';  
        } else if (password.length < 8) {
            return 'Please enter a password that is at least 8 characters long.';
        }  else if (number === false) {
            return 'Your password must include at least one number.';
        } else if (symbol === false) {
            return 'Your password must include one of the following symbols: !?@$#';
        } else {
            return 'Password accepted';
        } 
    }
};
