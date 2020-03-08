require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const path = require('path');
const session = require("express-session");

mongoose
  .connect('mongodb://localhost/users', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();
const MongoStore = require("connect-mongo")(session);

// Middleware Setup

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  resave: true,
  saveUninitialized: true
}));

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// default value for title local

app.locals.title = 'Express basic auth';


const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/', auth);
const inside = require('./routes/inside');
app.use('/', inside);


module.exports = app;
