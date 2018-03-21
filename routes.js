const express = require('express');
const UserControl = require('./src/controller/user');


const router = express.Router();
module.exports = router;

router.get('/', UserControl.demo);