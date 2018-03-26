const mongoose = require('mongoose');

module.exports.UserImages = UserImages = new mongoose.Schema ({
    name: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true}
});

module.exports.User = new mongoose.Schema ({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    name: { type: String, required: false },
    age: { type: Number, required: false },
    description: { type: String, required: false },
    uploads: [ UserImages ]
});