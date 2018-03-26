const user = require('../model/user');
const model = require('../model/index');

/**
* @swagger
  * /api/uploads:
  *   post:
  *     tags:
  *       - Image
  *     summary: Upload user image
  *     produces:
  *       - application/json
  *     security:
  *       - JWT: []
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: file
  *         in: formData
  *         required: true
  *         description: image to upload
  *         type: file     
  *     responses:
  *       200:
  *         description: file added           
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.uploadImage = async (req, res) => {
    try {
        const image = new model.UserImages ({
            name: req.file.originalname,
            id: req.file.id 
        });
        await user.linkImageToUser(req.user._id, image);
        return res.status(200).json({file: req.file});
    } catch (err) {
        return res.status(400).json({err});
    }
}