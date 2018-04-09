const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

/**
* @swagger
  * /api/contentful:
  *   post:
  *     tags:
  *       - Contentul
  *     summary: Upload user image to contentful
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
  *       - name: title
  *         in: formData
  *         required: true
  *         description: title of the image
  *         type: string    
  *       - name: description
  *         in: formData
  *         required: false
  *         description: description of the image
  *         type: string       
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
        const image = await contentfulImage.uploadImage(req.body, req.file);
        await contentfulUser.linkAsset(req.user.contentfulId, image.sys.id);
        res.status(200).json({image});
    } catch (err) {
        res.status(500).json({err});
    }
}
