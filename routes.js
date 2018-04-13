const express = require('express');
const UserControl = require('./src/controller/user');
const validator = require('./src/util/validator');
const ImageControl = require('./src/controller/image');
const fileControl = require('./src/model/image');
const contentfulControl = require('./src/controller/contentful');
const multer = require('multer');
const upload = multer();
const config = require('./src/config/config');

const router = express.Router();
module.exports = router;

router.put('/user', validator.validateUpdateBody(), UserControl.updateUser);
router.get('/user', UserControl.getUser);
router.delete('/user', UserControl.deleteUser);

router.all('/uploads/:_id', validator.validateParamObjectId(), validator.validateImageBelongToUser);
router.post('/uploads', fileControl.upload.single(config.FILE_NAME), ImageControl.uploadImage);
router.get('/uploads', ImageControl.getAllImages);
router.get('/uploads/:_id', ImageControl.getImage);
router.delete('/uploads/:_id', ImageControl.deleteImage);
//DEPRECATED
router.get('/uploads/raw/:_id', validator.validateParamObjectId(), validator.validateImageBelongToUser, ImageControl.getCachedImage);

router.all('/contentful/image/:_id', validator.validateContentfulImageBelongToUser);
router.post('/contentful/image', upload.single(config.FILE_NAME), validator.validateContentfulUploadBody(), contentfulControl.uploadImage);
router.get('/contentful/image', contentfulControl.getImages);
router.get('/contentful/image/:_id', contentfulControl.getImage);
router.delete('/contentful/image/:_id', contentfulControl.deleteImage);
router.get('/contentful/user', contentfulControl.getUser);
router.post('/contentful/stream/image/', validator.validateContentfulImageStreamBody(), contentfulControl.streamImage)

router.post('/contentful/fast/image/', upload.single(config.FILE_NAME), validator.validateContentfulUploadBody(), contentfulControl.uploadImageFast);
router.delete('/contentful/fast/image/:_id', contentfulControl.deleteImageFast);