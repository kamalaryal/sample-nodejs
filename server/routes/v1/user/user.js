const express = require('express');
const router = express.Router();

const { signupController } = require('../../../controllers/v1/user/signup/signup');
const {
    loginController,
    ValidateOTPController,
    getOTPCodeController
} = require('../../../controllers/v1/user/login/login');
const { 
    verificationTokenController,
    getVerificationLinkController
} = require('../../../controllers/v1/user/emailVerification/emailVerification');
const { 
    forgetPasswordSendLinkController,
    forgetPasswordController,
    changePasswordController,
    resetOtherUserPasswordController,
    resetPasswordController
} = require('../../../controllers/v1/user/forgetPassword/forgetPassword');
const { 
    getSingleProfileController,
    getProfileController,
    editProfileController,
    editOtherProfileController,
    toggleStatusController
} = require('../../../controllers/v1/user/profile/profile');

const CheckAuth = require('../../../middlewares/check-auth');
const { isAdmin } = require('../../../middlewares/check-role');

// SIGNUP
router.post('/signup', CheckAuth, isAdmin, signupController);

// LOGIN
router.post('/login', loginController);
router.post('/validateOTP', CheckAuth, ValidateOTPController);
router.get('/getOTP', CheckAuth, getOTPCodeController);

//VERIFICATION
router.patch('/verification/:token', verificationTokenController);
router.get('/getVerificationLink', getVerificationLinkController);

//FORGETPASSWORD
router.post('/forgetpassword', forgetPasswordSendLinkController);
router.patch('/forgetpassword/:token', forgetPasswordController);
router.patch('/reset', CheckAuth, changePasswordController);
router.patch('/reset/single/:_id', CheckAuth, isAdmin, resetOtherUserPasswordController);
router.patch('/password/reset', CheckAuth, resetPasswordController)

// PROFILE INFO
router.get('/profile/single', CheckAuth, getSingleProfileController);
router.get('/profile', CheckAuth, isAdmin, getProfileController);
router.patch('/editProfile', CheckAuth, editProfileController);
router.patch('/editOtherProfile/:_id', CheckAuth, isAdmin, editOtherProfileController);
router.patch('/toggleStatus/:_id', toggleStatusController);


module.exports = router;