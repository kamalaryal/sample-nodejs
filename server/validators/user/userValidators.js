const Joi = require('@hapi/joi');

exports.loginSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
});

exports.signupSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required(),
    fullName: Joi.string().required(),
    role: Joi.string().required()
});

exports.getResetLinkSchema = Joi.object().keys({
    email: Joi.string().required().email()
});

exports.requestResetSchema = Joi.object().keys({
    // email: Joi.string().required().email(),
    password: Joi.string().required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required()
});

exports.changePasswordSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    currentPassword: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required()
});

exports.resetOtherPasswordSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    adminPassword: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required()
});

exports.editProfileSchema = Joi.object().keys({
    email: Joi.string().email(),
    fullName: Joi.string()
});

exports.editOtherProfileSchema = Joi.object().keys({
    email: Joi.string().email(),
    fullName: Joi.string(),
    role: Joi.string()
});

exports.OTPSchema = Joi.object().keys({
    token: Joi.string().required()
})
