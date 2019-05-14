require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const app = express();

const authController = require('./controllers/authController');
const favoritesController = require('./controllers/favoritesController');
const dataController = require('./controllers/dataController');

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env;

app.use(express.json());
app.use(express.static(`$__dirname}/../build`));

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log(`The database is set.`);
    app.listen(SERVER_PORT, () => {
        console.log(`The server is listening on port ${SERVER_PORT}`);
    });
});

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.post('/auth/register', authController.registerUser);
app.post('/auth/login', authController.loginUser);
app.get('/auth/logout', authController.logoutUser);
app.get('/user', authController.getUser);
app.get('/data', dataController.getCountyData);
app.get('/favorites/:id', favoritesController.getFavorites);
app.delete('/favorites/:id', favoritesController.deleteFavorite);
app.put('/favorites/:id', favoritesController.editNote);


//median household income by county api url: https://datausa.io/api/data?measure=Median%20Household%20Income&year=latest&Geography=04000US:children
//median property value by county api url: https://datausa.io/api/data?measure=Property%20Value&year=latest&Geography=04000US:children
//average commute time by county api url: https://datausa.io/api/data?measure=Average%20Commute%20Time&year=latest&Geography=04000US:children
//median age by county api url: https://datausa.io/api/data?measure=Median%20Age&year=latest&Geography=04000US:children
