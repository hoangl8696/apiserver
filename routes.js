const express = require('express');
const UserControl = require('./src/controller/user');
const validator = require('./src/util/validator');
const ImageControl = require('./src/controller/image');
const fileControl = require('./src/model/image');
const config = require('./src/config/config');

const router = express.Router();
module.exports = router;

router.put('/user', validator.validateUpdateBody(), UserControl.updateUser);
router.get('/user', UserControl.getUser);
router.delete('/user', UserControl.deleteUser);

router.post('/uploads', fileControl.upload.single(config.FILE_NAME), ImageControl.uploadImage);
router.get('/uploads', ImageControl.getAllImages);
router.get('/uploads/:_id', validator.validateParamObjectId(), ImageControl.getImage);