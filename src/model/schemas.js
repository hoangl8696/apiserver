const mongoose = require('mongoose');

module.exports.UserImages = UserImages = new mongoose.Schema ({
    name: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true}
});

module.exports.User = new mongoose.Schema ({
    email: { type: String, required: false },
    password: { type: String, required: false },
    name: { type: String, required: false },
    age: { type: Number, required: false },
    description: { type: String, required: false },
    uploads: [ UserImages ],
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true,
        default: 'local'
    },
    google: { 
        id: { type: String },
        email: { type: String, required: false }
    },
    facebook: { 
        id: { type: String },
        email: { type: String, required: false }
    },
    contentfulId: { type: String, required: true }
});