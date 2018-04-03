const user = require('../model/user');
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
   * /auth/signin:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Exchange credential for token
   *     produces:
   *       - application/json
   *     security:
   *       - APIKey: []
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
   *               $ref: '#/definitions/User full info'
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
   *       - APIKey: []
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
        const googleUser = await user.getUserByGoogleEmail(email);
        const foundedUser = await user.getUserByEmail(email);
                
        if (foundedUser || googleUser) {
            return res.status(403).json({error: "user already existed"});
        }
        const newUser = await user.saveNewUser(email, password);
    
        const token = signedToken(newUser);
        return res.status(200).json({ token, newUser });
    } catch (err) {
        res.status(500).json({err});
    }
}

/**
   * @swagger
   * /oauth/google:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Exchange google's access-token for api token
   *     description: Expect a google access-token, handle authorization and authorizatio-code <=> access-token exchange on the front end. 
   *                  At the time writting this API (3rd of April 2018), Swagger UI will not work sometime, due to third
   *                  party call this method make, if that happen, please use other tools, such as Postman to test
   *     produces:
   *       - application/json
   *     security:
   *       - APIKey: []
   *     parameters:
   *       - name: Credentials
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *               access_token:
   *                    type: string
   *               refresh_token:
   *                    type: string
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
module.exports.oauth = async function oauth (req, res) {
    try {
        const token = signedToken(req.user);
        res.status(200).json({token});
    } catch (err) {
        res.status(500).json({err});
    }
}