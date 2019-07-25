const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const Speakeasy = require("speakeasy");
const nodeMailer = require("nodemailer");
const stringSimilarity = require('string-similarity');
const randomstring = require("randomstring");

const userBase = require('../../../../models/userBase');

const { validator } = require('../../../../validators/');
const { signupSchema } = require('../../../../validators/user/userValidators');

exports.signupController = (req, res, next) => {

    //Validation
    var validationError = validator(req.body, signupSchema);

    if(req.body && req.body.email && req.body.password){

        //similarityScore betweem mail and password
        var similarityScore = stringSimilarity.compareTwoStrings(req.body.email.split('@')[0], req.body.password); 
        console.log(similarityScore);
        if( similarityScore >= 0.3 ){

            similarityError = {
                    "location": "body",
                    "param": "password",
                    "msg": "The password is too similar to the email address. "
                };
            validationError ? validationError.push(similarityError.msg) : validationError=similarityError.msg;

        }

    }

    if(validationError){
        return res.status(400).json({
            message: validationError
        });
    }
    //End of validation

    userBase.findOne({ email: req.body.email.toLowerCase() }, function(err, data) {
        if(err) {
            return res.json({
                error : err
            });
        } else {
            if(data !== null) {
                return res.status(409).json({
                    message:'Mail already exists.'
                });
            } else {
                var id = new mongoose.Types.ObjectId;
                var id1 = new mongoose.Types.ObjectId;
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);    
                var tempToken1 = randomstring.generate(5) + id + randomstring.generate(3);
                var tempToken2 = randomstring.generate(3) + id1 + randomstring.generate(5);
                var token = tempToken2 + tempToken1;
                var otpCode = Speakeasy.generateSecret({ length: 30 });

                const newUser = new userBase({
                    _id: id,
                    fullName: req.body.fullName,
                    email: req.body.email.toLowerCase(),
                    password: hash,
                    passwordChangeStatus: false,
                    multiUseToken: token,
                    verificationStatus : "pending",
                    resetPasswordToken: token,
                    status: false,
                    role: req.body.role.toLowerCase(),
                    otpCode: otpCode.base32,
                    createdAt: Date.now()
                });

                newUser
                .save()
                .then(result => {
                    console.log(result);
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error : err.message
                    });
                });

                ejs.renderFile(appRoot + "/server/template/verification.ejs", { link: 'https://localhost:5001/user/verification/'+token, role: req.body.role, fullName: req.body.fullName }, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message : err.message
                        });
                    } else {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.smtp_email,
                                pass: process.env.smtp_password
                            }
                        });
                        
                        let mailOptions = {
                            from: '"Login Portal" <noreply@loginportal.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'Account Verification', // Subject line
                            text: "Message", // plain text body
                            html: data
                        };
                    
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return (error);
                            }
                            console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                // res.render('message', {message : "We have received you email"});
                            console.log("Message Send Successfully to: "+req.body.email);
                            });
                    }
                });

                ejs.renderFile(appRoot + "/server/template/accountCredentials.ejs", { role: req.body.role, email: req.body.email.toLowerCase(), password: req.body.password }, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message : err.message
                        });
                    } else {
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.smtp_email,
                                pass: process.env.smtp_password
                            }
                        });
                        
                        let mailOptions = {
                            from: '"Login Portal" <noreply@loginportal.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'Account Credentials', // Subject line
                            text: "Message", // plain text body
                            html: data
                        };
                    
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return (error);
                            }
                            console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                // res.render('message', {message : "We have received you email"});
                            console.log("Message Send Successfully to: "+req.body.email);
                            });
                    }
                });

                res.status(201).json({
                    message: "User has been created successfully.",
                });

            }
        }

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err.message
        });
    });

}