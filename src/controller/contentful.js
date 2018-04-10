const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

/**
* @swagger
  * /api/contentful/image:
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
  * /api/contentful/image:
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
  * /api/contentful/image/{_id}:
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
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getImage = async (req, res) => {
    try {
        const image = await contentfulImage.getImageById(req.params._id);
        return res.status(200).json({image});
    } catch (err) {
        res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/contentful/image/{_id}:
  *   delete:
  *     tags:
  *       - Contentful
  *     summary: Delete contentful image of the current user with _id   
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
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.deleteImage = async (req, res) => {
    try {
        const results = await Promise.all([
            contentfulUser.unlinkAsset(req.user.contentfulId, req.params._id),
            contentfulImage.deleteImageById(req.params._id)
        ])
        res.status(200).json({ image: results[1] });
    } catch (err) {
        res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/contentful/user:
  *   get:
  *     tags:
  *       - Contentful
  *     summary: Retrieve the current contentful user data that link to this user   
  *     produces:
  *       - aplication/json
  *     security:
  *       - JWT: []  
  *     responses:
  *       200:
  *         description: User data
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getUser = async (req, res) => {
    try {
        const user = await contentfulUser.getUserById(req.user.contentfulId);
        return res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}