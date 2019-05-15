const bcrypt = require('bcryptjs');

module.exports = {
    registerUser: async (req, res) => {
        const db = req.app.get('db');
        const {user_name, user_email, password} = req.body;
        let potentialUser = await db.get_user_by_email(user_email);
        if (potentialUser[0]) {
            return res.status(200).send({message: 'This email is already in use. Please use a different email.'});
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let newUser = await db.register_user([user_name, user_email, hash]);
        
        req.session.user = newUser[0];
        req.session.user.isLoggedIn = true;

        res.status(200).send(req.session.user);
    },

    loginUser: async (req, res) => {
        const db = req.app.get('db');
        const {user_email, password} = req.body;
        const userCheck = await db.get_user_by_email(user_email);
        const user = userCheck[0];
        if (!user) {
            return res.status(200).send({message: 'This email account does not exist.'});
        }

        const passwordMatch = bcrypt.compareSync(password, user.user_hash);

        if (!passwordMatch) {
            return res.status(200).send({message: 'The password you entered is incorrect.'});
        }

        req.session.user = userCheck[0];
        req.session.user.isLoggedIn = true;
        delete req.session.user.user_hash;
        res.status(200).send(req.session.user);
    },

    logoutUser: async (req, res) => {
        req.session.destroy();
        res.status(200).send({});
    },

    getUser: async (req, res) => {
        if (!req.session.user) {
            res.status(200).send({message: 'Please Log In'});
        }
        else res.status(200).send(req.session.user);
    }
}