const Grid = require('gridfs-stream');
const connection = require('../../app');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('../config/config');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const converter = require('byte-converter').converterBase2;
const app = require('../../app');

const storage = new GridFsStorage({
    url: config.DATABASE_URI,
    file: async (req, res) => {
        try {
            const buf = await crypto.randomBytes(10);
            const fileName = buf.toString('hex') + path.extname(res.originalname);
            const fileInfo = {
                fileName,
                bucketName: 'uploads', 
            } 
            return fileInfo;
        } catch (err) {
            return err;
        }
    }
});

const limits = {
    fileSize: converter(config.FILE_SIZE_IN_MB, 'MB', 'B'),
    files: 1,
    parts: 1
}

module.exports.upload = multer({ storage, limits, fileFilter: (req,res,cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(res.mimetype);
    const extension = fileTypes.test(path.extname(res.originalname).toLowerCase());

    if (mimeType && extension) {
        return cb(null, true);
    }
    return cb("Error: file type need to be " + fileTypes, false);
}});

module.exports.getImageById = async _id => {
    try {
        return await app.gfs.files.findOne({ _id });
    } catch (err) {
        console.log("error getting image by ID: %s", err);
    }
}

module.exports.deleteImageById = async _id => {
    try {
        return await app.gfs.files.findOneAndDelete({ _id });
    } catch (err) {
        console.log("error deleting image by ID: %s", err);
    }
}