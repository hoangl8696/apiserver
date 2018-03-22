const mongoose = require('mongoose');

module.exports.User = new mongoose.Schema ({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});