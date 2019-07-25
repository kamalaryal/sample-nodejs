const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: { type: String, required: true },
    email: {
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/  //email regex
    },
    multiUseToken: { type: String, unique: true, required: true },
    verificationStatus : { type: String, required: true }, // 'verified' after verification, 'unverified' default
    resetPasswordToken: { type: String, unique: true, required: true },
    resetPasswordExpires: { type: Date, default: Date.now() - 3600000, required: true },
    otpCode:{ type: String, required: true },
    password: { type: String, required: true },
    passwordChangeStatus: { type: Boolean, required: true },
    role: { type: String, required: true }, // admin, read, write
    status : { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('userBase', userSchema);