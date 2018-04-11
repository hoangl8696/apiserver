require('dotenv').config();
const express = require('express');
const redirect = require('express-redirect');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Authentication = require('./src/controller/authentication');
const validator = require('./src/util/validator');
const passport = require('passport');
const passportConf = require('./passport');
const routes = require('./routes');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); 
const config = require('./src/config/config');
const Grid = require('gridfs-stream');
const redis = require('redis');
const bluebird = require('bluebird');
const queue = require('./src/jobs/queue');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.DATABASE_URI);
mongoose.connection.once('open', () => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
    module.exports.gfs = gfs;
});

const client = redis.createClient(process.env.REDISCLOUD_URL || config.REDIS_URL);
module.exports.redis = client;

const app = express();
redirect(app);
const passportLocalStrat = passport.authenticate('local', { session: false });
const passportJwtStrat = passport.authenticate('jwt', { session: false });
const passportGooglePlusStrat = passport.authenticate('googlePlusToken', { session: false });

app.use(bodyParser.json());

const authRouter = express.Router();
authRouter.post('/signup', Authentication.signUp);
authRouter.post('/signin', passportLocalStrat, Authentication.signIn);

const oauthRouter = express.Router();
oauthRouter.post('/google', passportGooglePlusStrat, Authentication.oauth);

app.use('/auth', validator.validateDeveloper, validator.validateAuthBody(), authRouter);
app.use('/oauth', validator.validateDeveloper, validator.validateOAuthBody(), oauthRouter);
app.use('/api',  passportJwtStrat, routes);

const swaggerOptions = require('./swagger-config.json');
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, true, { validatorUrl: null }));

app.redirect('*','https://api-image-server.herokuapp.com/api-docs/');

const q = queue.createQueue();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    process.on('SIGTERM', () => {
        server.close(async ()=>{
            await Promise.all([mongoose.connection.close(), client.quit()]);
            process.kill();
        });
    });
});