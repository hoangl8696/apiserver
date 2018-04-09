const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

/**
* @swagger
  * /api/contentful:
  *   post:
  *     tags:
  *       - Contentful
  *     summary: Upload user image to contentful
  *     description: At the time writting this API (9th of April 2018), Swagger UI will not work sometime, 
  *                  due to custom authorizers do not currently support passing through headers within 
  *                  the response and Swagger UI needs the Access-Control-Allow-Origin:*
  *                  within the response header(s) to display the correct HTTP status code, 
  *                  if that happen, please use other tools, such as Postman to test         
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
  *     description: At the time writting this API (9th of April 2018), Swagger UI will not work sometime, 
  *                  due to custom authorizers do not currently support passing through headers within 
  *                  the response and Swagger UI needs the Access-Control-Allow-Origin:*
  *                  within the response header(s) to display the correct HTTP status code, 
  *                  if that happen, please use other tools, such as Postman to test     
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