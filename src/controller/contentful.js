const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

/**
* @swagger
  * /api/contentful:
  *   post:
  *     tags:
  *       - Contentful
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

/**
* @swagger
  * /api/contentful:
  *   get:
  *     tags:
  *       - Contentful
  *     summary: Retrieve all contentful images of the current user    
  *     produces:
  *       - aplication/json
  *     security:
  *       - JWT: []  
  *     responses:
  *       200:
  *         description: User images
  *         schema:
  *             type: file
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getImages = async (req, res) => {
    try {
        const images = await contentfulImage.getImagesOfUser(req.user.contentfulId);
        if (images) {
            return res.status(200).json({images});
        } 
        return res.status(404).json({error: 'no images were found'});
    } catch (err) {
        res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/contentful/{_id}:
  *   get:
  *     tags:
  *       - Contentful
  *     summary: Retrieve contentful image of the current user with _id   
  *     produces:
  *       - aplication/json
  *     parameters:
  *       - name: _id
  *         in: path
  *         required: true
  *         description: ID of image to return
  *         type: string 
  *     security:
  *       - JWT: []  
  *     responses:
  *       200:
  *         description: User images
  *         schema:
  *             type: file
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getImage = async (req, res) => {
    try {
        const images = await contentfulImage.getImagesOfUser(req.user.contentfulId);
        if (images) {
            const id = images.map(image => image.sys.id);
            if (id.includes(req.params._id)) {
                const image = await contentfulImage.getImageById(req.params._id);
                return res.status(200).json({image});
            }
            return res.status(401).json({error: 'cannot find this image or this image does not belong to the user'});
        }
        return res.status(404).json({error: 'this user have no images'});
    } catch (err) {
        res.status(500).json({err});
    }
}