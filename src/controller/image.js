const user = require('../model/user');
const model = require('../model/index');
const app = require('../../app');
const image = require('../model/image');
const mongoose = require('mongoose');
const stream = require('stream');

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
  *         description: Image that get upload.
  *         schema:
  *             $ref: '#definitions/Avatar'         
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
            imageId: req.file.id 
        });
        await user.linkImageToUser(req.user._id, image);
        return res.status(200).json(req.file);
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
  *             $ref: '#/definitions/Avatar summary'          
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
                return await image.getImageById(i.imageId);
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
  *     summary: Retrieve image with the id from current user
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
        const readStream = app.gfs.createReadStream({ _id : req._id });
        res.writeHead(200, {
            //this is important to add!!!
            'Content-Type': req.foundedImage.contentType
        });
        readStream.pipe(res);
    } catch (err) {
        return res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/uploads/{_id}:
  *   delete:
  *     tags:
  *       - Image
  *     summary: Delete image with the id of current user
  *     produces:
  *       - aplication/json
  *     security:
  *       - JWT: []  
  *     parameters:
  *       - name: _id
  *         in: path
  *         required: true
  *         description: ID of image to delete
  *         type: string   
  *     responses:
  *       200:
  *         description: Return the deleted image meta data
  *         schema:
  *             $ref: '#definitions/Avatar summary'
  *       403:
  *         description: Invalid credentials.
  *       500:
  *         description: Internal error.
  *
  */
module.exports.deleteImage = async (req,res) => {
    try {
        const deletedImage = await image.deleteImageById(req._id);
        const result = await user.unlinkImageToUser(req.user._id, req._id);
        return res.status(200).json(deletedImage.value);
    } catch (err) {
        return res.status(500).json({err});
    }
}

/**
* @swagger
  * /api/uploads/raw/{_id}:
  *   get:
  *     tags:
  *       - Image
  *     summary: Retrieve image from either Redis cache or Mongo database with the id from current user
  *     description: Deprecated due to relatively small performance change when using, need further testing
  *     deprecated: true
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
module.exports.getCachedImage = async (req,res) => {
    try {
        const result = await image.getFastImage(req._id);
        const bufferStream = new stream.PassThrough();
        const encodedData = new Buffer(result, 'base64'); 
        res.writeHead(200, {
            //this is important to add!!!
            'Content-Type': req.foundedImage.contentType
        });
        bufferStream.end(encodedData);
        bufferStream.pipe(res);
    } catch (err) {
        return res.status(500).json({err});
    }
}