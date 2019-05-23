const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const { PASSWORD, EMAIL} = process.env

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  })

module.exports = {
    checkEmail: async (req, res) => {
        const db = req.app.get('db')
        const { user_email } = req.body
        const userEmail = db.get_user_by_email(user_email)
        res.status(200).send(userEmail)
    },

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
    },

    sendEmail: async (req, res) => {
        const { user_email, randomStr } = req.body
        const db = await req.app.get('db')
        const checkUser = await db.get_user_by_email(user_email)
        res.status(200).send('user found')
        if(checkUser[0]){
            let mailOption = {
                from: EMAIL,
                to: user_email,
                subject: 'temporary password',
                text: `your temporary password is ${randomStr}`
            }
            transporter.sendMail(mailOption, function(err) {
                if(err) {
                    console.log('Error sending email')
                }else{
                    console.log('Email sent!!!')
                }
            })
        }
    },

    updatePassword: async (req, res) => {
        const db = req.app.get('db')
        const { newPassword, user_email } = req.body
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        const user = await db.update_password(user_email, hash)
        req.session.user = user[0];
        req.session.user.isLoggedIn = true;
        delete req.session.user.user_hash;
        res.status(200).send(req.session.user)
    }
    
}