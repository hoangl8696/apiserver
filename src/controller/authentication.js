const User = require('../model/user');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

signedToken = user => {
    return JWT.sign({
        iss: "oskar",
        iat: new Date().getTime(),
        sub: user._id,
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)
};

module.exports.signIn = async function signIn (req, res) {
    try{

    } catch (err) {

    }
    res.send("signin");
}

module.exports.signUp = async function signUp (req, res) {
    try{
        const { email, password } = req.body;
        const foundedUser = await User.findOne({ email });
                
        if (foundedUser) {
            return res.status(403).json({error: "email already existed"});
        }
        const newUser = new User({ email, password});
        await newUser.save();
    
        const token = signedToken(newUser);
        return res.status(200).json({ token });
    } catch (err) {
        res.status(500).json(err);
    }

}