const user = require('../model/user');

/**
* @swagger
  * /api/user:
  *   put:
  *     tags:
  *       - User
  *     summary: Update user information
  *     produces:
  *       - application/json
  *     security:
  *       - JWT: []
  *     parameters:
  *       - name: User Info
  *         in: body
  *         required: true
  *         schema:
  *           $ref: '#definitions/Update Information'
  *     responses:
  *       200:
  *         description: User updated.
  *         schema:
  *           type: object
  *           properties:
  *             $ref: '#definitions/User full info'
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.updateUser = async (req,res) => {
    try {
        const newUser = await user.updateUser(req.user._id, req.body);   
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json({err});
    }    
}

/**
* @swagger
  * /api/user:
  *   get:
  *     tags:
  *       - User
  *     summary: Get user information
  *     produces:
  *       - application/json
  *     security:
  *       - JWT: []
  *     responses:
  *       200:
  *         description: User information.
  *         schema:
  *           $ref: '#definitions/User full info'             
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getUser = async (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({err});
    }
}