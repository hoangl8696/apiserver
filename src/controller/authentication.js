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

/**
 * @swagger
 * definitions:
 *   Credentials:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       __v:
 *         type: number
 */

/**
   * @swagger
   * /auth/signin:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Exchange credential for token
   *     produces:
   *       - application/json
   *     security:
   *       - JWT: []
   *     parameters:
   *       - name: Credentials
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Credentials'
   *     responses:
   *       200:
   *         description: Authentication token.
   *         schema:
   *           type: object
   *           properties:
   *             token:
   *               type: string
   *             user:
   *               $ref: '#/definitions/User'
   *       403:
   *         description: Invalid credentials.
   *       500:
   *         description: Internal error.
   */

module.exports.signIn = async function signIn (req, res) {
    try{
        const token = signedToken(req.user);
        const user = req.user;
        res.status(200).json({token , user});
    } catch (err) {
        res.status(500).json({err});
    }
}

/**
   * @swagger
   * /auth/signup:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Exchange credential for token
   *     produces:
   *       - application/json
   *     security:
   *       - JWT: []
   *     parameters:
   *       - name: Credentials
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Credentials'
   *     responses:
   *       200:
   *         description: Authentication token and pass in new users.
   *         schema:
   *           type: object
   *           properties:
   *             token:
   *               type: string
   *             newUser:
   *               $ref: '#definitions/User'  
   *       403:
   *         description: Invalid credentials.
   *       500:
   *         description: Internal error.
   */

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
        return res.status(200).json({ token, newUser });
    } catch (err) {
        res.status(500).json({err});
    }

}