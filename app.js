const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Authentication = require('./src/controller/authentication');
const validateAuthBody = require('./src/util/authBodyValidation');
const passport = require('passport');
const passportConf = require('./passport');
const routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/demoAPI');

const app = express();
const passportLocalStrat = passport.authenticate('local', { session: false });
const passportJwtStrat = passport.authenticate('jwt', { session: false });

app.use(bodyParser.json());

app.post('/signup', validateAuthBody(), Authentication.signUp);
app.post('/signin', validateAuthBody(), passportLocalStrat, Authentication.signIn);
app.use('/api',  passportJwtStrat, routes);

const port = process.env.PORT || 3000;
app.listen(port);