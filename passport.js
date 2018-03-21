const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./src/config/config');

const User = require('./src/model/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false);
        } 
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return done(null, false); 
        }
        return done(null, user)
    } catch (err) {
        return done(err,false);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        } 
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));