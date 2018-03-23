const express = require('express');
const UserControl = require('./src/controller/user');
const validator = require('./src/util/bodyValidation');

const router = express.Router();
module.exports = router;

router.put('/user/', validator.validateUpdateBody(), UserControl.updateUser);
router.get('/user/', UserControl.getUser);