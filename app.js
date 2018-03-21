const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Authentication = require('./src/controller/authentication');
const validateBody = require('./src/util/authBodyValidation');
const passport = require('passport');
const passportConf = require('./passport');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/demoAPI');

const app = express();
const passportLocalStrat = passport.authenticate('local', { session: false });

app.use(bodyParser.json());

app.post('/signup', validateBody(), Authentication.signUp);
app.post('/signin', validateBody(), passportLocalStrat ,Authentication.signIn);
// app.post('/api', )

const port = process.env.PORT || 3000;
app.listen(port);