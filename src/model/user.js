const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const model = require('./index');

encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt); 
    } catch (err) {
        console.log("error encrypting password: %s", err);
    }
};

module.exports.validatePassword = async (encryptedPassword, password) => {
    try {
        return await bcrypt.compare(encryptedPassword, password);
    } catch (err) {
        console.log("error validating password: %s", err);
    }
}

module.exports.getUserByEmail = async (email) => {
    try {
        const foundedUser = await model.User.findOne({email});
        return foundedUser;
    } catch (err) {
        console.log("error getting user by email: %s", err);
    }
}

module.exports.getUserById = async (_id) => {
    try {
        return await model.User.findById(_id);
    } catch (err) {
        console.log("error getting user by id: %s", err);
    }
}

module.exports.saveNewUser = async (email, password, contentfulId) => {
    try {
        const newUser = new model.User({email, password, contentfulId});
        
        newUser.password = await encryptPassword(password);
        return await newUser.save();
    } catch (err) {
        console.log("error saving the user: %s", err);
    }
}

module.exports.updateUser = async (_id, update) => {
    try {
        return await model.User.findOneAndUpdate({ _id }, update, { new: true });
    } catch (err) {
        console.log("error updating user: %s", err);
    }
}

module.exports.deleteUser = async (_id) => {
    try {
        return await model.User.remove({ _id });
    } catch (err) {
        console.log("error deleting user: %s", err);
    }
}

module.exports.linkImageToUser = async (_id, uploads) => {
    try {
        return await model.User.update({ _id }, { $push: { uploads } });
    } catch (err) {
        console.log("error linking image: %s", err);
    }
}

module.exports.unlinkImageToUser = async (_id, imageId) => {
    try {
        return await model.User.update({ _id }, { $pull: { uploads: { imageId } } });
    } catch (err) {
        console.log("error unlinking image: %s", err);
    }
}

module.exports.getUserByGoogleId = async _id => {
    try {
        return await model.User.findOne({ "google.id": _id });
    } catch (err) {
        console.log("error getting user by google id: %s", err);
    }
}

module.exports.getUserByGoogleEmail = async email => {
    try {
        return await model.User.findOne({ "google.email": email });
    } catch (err) {
        console.log("error getting user by google email: %s", err);
    }
}