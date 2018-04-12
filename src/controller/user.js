const user = require('../model/user');
const image = require('../model/image');
const contentfulUser = require("../contentful/user");
const contentfulImage = require("../contentful/image");
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
  *         description: Atleast one field is required
  *         schema:
  *           $ref: '#definitions/Update Information'
  *     responses:
  *       200:
  *         description: User updated.
  *         schema:
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
module.exports.getUser = (req,res) => {
    res.status(200).json({user: req.user});
} 

/**
* @swagger
  * /api/user:
  *   delete:
  *     tags:
  *       - User
  *     summary: Delete this user
  *     produces:
  *       - application/json
  *     security:
  *       - JWT: []
  *     responses:
  *       200:
  *         description: User that get deleted.
  *         schema:
  *             $ref: '#definitions/User full info'
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.deleteUser = async (req,res) => {
    try {
        const uploads = req.user.uploads;
        const images = await contentfulImage.getImagesOfUser(req.user.contentfulId);
        await Promise.all([
            uploads.map(i => image.deleteImageById(i.id)),
            images.map(i => contentfulImage.deleteImageById(i.sys.id)),
            user.deleteUser(req.user._id),
            contentfulUser.deleteUserById(req.user.contentfulId)
        ]);
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({err});
    }
}