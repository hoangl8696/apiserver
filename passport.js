const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./src/config/config');
const config = require('./src/config/config');

const user = require('./src/model/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const foundedUser = await user.getUserByEmail( email );
        if (!foundedUser) {
            return done(null, false);
        } 
        const isMatch = await user.validatePassword(password, foundedUser.password);
        if (!isMatch) {
            return done(null, false); 
        }
        return done(null, foundedUser)
    } catch (err) {
        return done(err,false);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader(config.TOKEN_NAME),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const foundedUser = await user.getUserById(payload.sub);
        if (!foundedUser) {
            return done(null, false);
        } 
        return done(null, foundedUser);
    } catch (err) {
        return done(err, false);
    }
}));