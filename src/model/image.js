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
    url: process.env.MONGODB_URI || config.DATABASE_URI,
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

const getImageById = async _id => {
    try {
        return await app.gfs.files.findOne({ _id });
    } catch (err) {
        console.log("error getting image by ID: %s", err);
    }
}
module.exports.getImageById = getImageById;

module.exports.deleteImageById = async _id => {
    try {
        return await app.gfs.files.findOneAndDelete({ _id });
    } catch (err) {
        console.log("error deleting image by ID: %s", err);
    }
}

//DEPRECATED
const getRawImageById = async _id => {
    try {
        return new Promise(async (resolve, reject) => {
            const readStream = await app.gfs.createReadStream({_id});
            let data = [];
            let img;
            readStream.on('data', (chunk) => {
                data.push(chunk);
            });
            readStream.on('end', () => {
                data = Buffer.concat(data);
                decodedData = data.toString('base64');
                resolve(decodedData);
            });
            readStream.on('error', (error) => {
                reject(error);
            });
        });
    } catch (err) {
        console.log("error getting raw image by ID: %s", err);
    }
}
module.exports.getRawImageById = getRawImageById;

//DEPRECATED
module.exports.getFastImage = async _id => {
    const result = await app.redis.getAsync(_id.toString());
    if (!result) {
        const rawImg = await getRawImageById(_id);
        //cache for 60 seconds, then delete key, request new value
        await app.redis.setexAsync(_id.toString(), 60, rawImg);
        return rawImg
    }
    return result;
}