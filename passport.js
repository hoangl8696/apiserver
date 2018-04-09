const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { ExtractJwt } = require('passport-jwt');
const config = require('./src/config/config');
const model = require('./src/model/index');
const user = require('./src/model/user');
const contentful = require('./src/contentful/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const foundedUser = await user.getUserByEmail( email );
        const googleUser = await user.getUserByGoogleEmail(email);
        if (!foundedUser || googleUser) {
            return done(null, false);
        } 
        const isMatch = await user.validatePassword(password, foundedUser.password);
        if (!isMatch) {
            return done(null, false); 
        }
        return done(null, foundedUser);
    } catch (err) {
        return done(err,false);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader(config.TOKEN_NAME),
    secretOrKey: process.env.JWT_SECRET
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

passport.use("googlePlusToken", new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const foundedUser = await user.getUserByGoogleId(profile.id);
        if (!foundedUser) {
            const contentfulUser = await contentful.createUser(profile.emails[0].value);
            const newUser = await createNewGoogleUser(profile, contentfulUser.sys.id);
            return done(null, newUser);
        }
        return done(null, foundedUser);
    } catch (err) {
        return done(err, false, err.message);
    }
}));

createNewGoogleUser = async (profile, id) => {
    try {
        const newUser = new model.User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            },
            contentfulId: id
        });
        await newUser.save();
        return newUser;
    } catch(err) {
        console.log("error creating new user with google account: %s", err);
    }
}