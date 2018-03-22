const user = require('../model/user');

/**
* @swagger
 *definitions:
 *  Update Information:
 *    type: object
 *    properties:
 *      name:
 *          type: string
 *      age:
 *          type: number
 *      description:
 *          type: string                          
*/


/**
* @swagger
  * /api/user/update:
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
  *             newUser:
  *               $ref: '#definitions/User'  
  *             addInfo:
  *               $ref: '#definitions/Update Information'
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