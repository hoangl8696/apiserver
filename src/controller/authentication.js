const user = require('../model/user');
const JWT = require('jsonwebtoken');
const contentful = require('../contentful/user');

signedToken = user => {
    return JWT.sign({
        iss: "oskar",
        iat: new Date().getTime(),
        sub: user._id,
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET)
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
        const contentfulUser = await contentful.createUser(email);
        const newUser = await user.saveNewUser(email, password, contentfulUser.sys.id);
        const token = signedToken(newUser);
        return res.status(200).json({ token, user: newUser });
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
   *                  At the time writting this API (9th of April 2018), Swagger UI will not work sometime, 
  *                   due to custom authorizers do not currently support passing through headers within 
  *                   the response and Swagger UI needs the Access-Control-Allow-Origin:*
  *                   within the response header(s) to display the correct HTTP status code, 
  *                   if that happen, please use other tools, such as Postman to test 
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