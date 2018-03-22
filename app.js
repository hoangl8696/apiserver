const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Authentication = require('./src/controller/authentication');
const validator = require('./src/util/bodyValidation');
const passport = require('passport');
const passportConf = require('./passport');
const routes = require('./routes');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); 

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/demoAPI');

const app = express();
const passportLocalStrat = passport.authenticate('local', { session: false });
const passportJwtStrat = passport.authenticate('jwt', { session: false });

app.use(bodyParser.json());

const authRouter = express.Router();
authRouter.post('/signup', Authentication.signUp);
authRouter.post('/signin', passportLocalStrat, Authentication.signIn);

app.use('/auth', validator.validateAuthBody(), authRouter);
app.use('/api',  passportJwtStrat, routes);

const swaggerOptions = require('./swagger-config.json');
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, true, { validatorUrl: null }));

const port = process.env.PORT || 3000;
app.listen(port);