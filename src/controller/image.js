const user = require('../model/user');
const model = require('../model/index');
const app = require('../../app');
const image = require('../model/image');
const mongoose = require('mongoose');

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

/**
* @swagger
  * /api/uploads:
  *   get:
  *     tags:
  *       - Image
  *     summary: Retrieve all image info from current user
  *     produces:
  *       - application/json
  *     security:
  *       - JWT: []  
  *     responses:
  *       200:
  *         description: User images
  *         type: array
  *         items:
  *             $ref: '#/definitions/User Images'          
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.getAllImages = async (req,res) => {
    try {
        const uploads = req.user.uploads;
        const result = await Promise.all(uploads.map(async i => {
            try {
                return await image.getImageById(i.id);
            } catch (err) {
                return res.status(500).json({err});
            }
        }));
        if (!result || result.length === 0) {
            return res.status(400).json({err: "no image was found"});
        }
       return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/uploads/{_id}:
  *   get:
  *     tags:
  *       - Image
  *     summary: Retrieve all image info from current user
  *     produces:
  *       - image/jpeg
  *       - image/png
  *       - image/jpg
  *     security:
  *       - JWT: []  
  *     parameters:
  *       - name: _id
  *         in: path
  *         required: true
  *         description: ID of image to return
  *         type: string   
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
module.exports.getImage = async (req,res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params._id);
        const readStream = app.gfs.createReadStream({ _id });
        res.writeHead(200, {
            //this is important to add!!!
            'Content-Type': req.foundedImage.contentType
        });
        readStream.pipe(res);
    } catch (err) {
        return res.status(500).json({err});
    }
}

module.exports.deleteImage = async (req,res) => {

}