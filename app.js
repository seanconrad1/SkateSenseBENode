const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });
conn_new_app = mongoose.createConnection('mongodb://localhost/new_app');
const Image = require('./models/image')(conn_new_app);
const User = require('./models/user')(conn_new_app);
const Location = require('./models/location')(conn_new_app);

const login = require('./controllers/login');
const getSpots = require('./controllers/getSpots');
const getBookmarks = require('./controllers/getBookmarks');
const getBookmark = require('./controllers/getBookmark');
const createBookmark = require('./controllers/createBookmark');
const deleteBookmark = require('./controllers/deleteBookmark');
const getUserCreatedSpots = require('./controllers/getUserCreatedSpots');
const deleteSpot = require('./controllers/deleteSpot');
const getNotApprovedList = require('./controllers/getNotApprovedList');
const createSpot = require('./controllers/createSpot');
const getAdmins = require('./controllers/getAdmins');
const approveSpot = require('./controllers/approveSpot');
const getSpotOwner = require('./controllers/getSpotOwner');
const getUsers = require('./controllers/getUsers');
const createUser = require('./controllers/createUser');

app.use(bodyParser({ limit: '20mb' }));

app.use(auth);

app.get('/', (req, res, next) => {
  res.send('Hello World!');
});

app.post('/login', (req, res, next) => {
  login(req, res, next);
});

app.get('/getSpots', (req, res, next) => {
  getSpots(req, res, next);
});

app.post('/getBookmarks', (req, res, next) => {
  getBookmarks(req, res, next);
});

app.post('/getBookmark', (req, res, next) => {
  getBookmark(req, res, next);
});

app.post('/createBookmark', (req, res, next) => {
  createBookmark(req, res, next);
});
app.post('/deleteBookmark', (req, res, next) => {
  deleteBookmark(req, res, next);
});

app.post('/getUserCreatedSpots', (req, res, next) => {
  getUserCreatedSpots(req, res, next);
});

app.post('/deleteSpot', (req, res, next) => {
  deleteSpot(req, res, next);
});

app.get('/getNotApprovedList', (req, res, next) => {
  getNotApprovedList(req, res, next);
});

app.post('/createSpot', (req, res, next) => {
  createSpot(req, res, next);
});

app.get('/getAdmins', (req, res, next) => {
  getAdmins(req, res, next);
});

app.post('/approveSpot', (req, res, next) => {
  approveSpot(req, res, next);
});

app.post('/getSpotOwner', (req, res, next) => {
  getSpotOwner(req, res, next);
});

app.get('/getUsers', (req, res, next) => {
  getUsers(req, res, next);
});

app.post('/createUser', (req, res, next) => {
  createUser(req, res, next);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

mongoose
  .connect(process.env.DB_HOSTNAME, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('connected to db!'))
  .catch(err => console.log('Connection error', err));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://${process.env.URL}:${process.env.PORT}`);
});
