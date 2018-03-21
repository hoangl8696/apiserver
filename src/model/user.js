const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.method.validatePassword = async function (codedPassword) {
    try {
        return await bcrypt.compare(codedPassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;