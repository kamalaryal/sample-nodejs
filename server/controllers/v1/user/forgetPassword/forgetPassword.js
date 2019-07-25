const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");
const randomstring= require('randomstring');
const stringSimilarity = require('string-similarity');
const ejs = require("ejs");

const userBase = require('../../../../models/userBase');

const { validator } = require('../../../../validators/');
const {
    changePasswordSchema,
    resetOtherPasswordSchema,
    requestResetSchema
} = require('../../../../validators/user/userValidators');

exports.forgetPasswordSendLinkController = (req, res, next) =>{
    userBase.findOne({ email: req.body.email})
    .exec()
    .then(user =>{
        if(user === null){
            console.log(user);
            return res.status(401).json({
                message: 'The e-mail address is not assigned to any of our user account'
            });
        } else {

            var token = randomstring.generate(5) + user._id + randomstring.generate(3);
            console.log(token);
            var expireTime = Date.now() + 3600000; // 1 hour
            console.log(user._id);

            userBase.updateOne({ _id : user._id },
                { 
                    $set: { resetPasswordToken: token, resetPasswordExpires : expireTime }
                }
            )
            .exec()
            .then(user =>{
                console.log(user);
                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.smtp_email,
                        pass: process.env.smtp_password
                    }
                });
                

                ejs.renderFile(appRoot + "/server/template/forgetPassword.ejs", {link: "https://localhost:3000/forgotpassword/" + token}, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message : err
                        });
                    } else {
                        // console.log(req.files);
                        let mailOptions = {
                            from: '"Login Portal" <noreply@loginportal.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'Reset Account', // Subject  line
                            text: "Message", // plain text body
                            html: data, // html body
                        };
                    
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                // res.render('message', {message : "We have received you email"});
                            console.log("Message Send Successfully to: "+ req.body.email);
                            });
                    }
                });

            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error : err.message
                });
            });

            return res.status(200).json({
                message: 'Reset link has been send to your email.'
            });
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err.message
        });

    });
}

exports.forgetPasswordController = (req, res, next) => {
    //Validation
    var validationError = validator(req.body, requestResetSchema);
    if(validationError){
        return res.status(400).json({
            message: validationError
        });
    }
    //End of validation

    bcrypt.hash(req.body.password, 10, (err,hash) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                error : err.message
            });
        } else {
            userBase.findOneAndUpdate({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, { $set: {
                password: hash
                }
            })
            .exec()
            .then(result =>{
                console.log(result);
                if(result == null || result == undefined){
                    return res.status(401).json({
                        message: "Password reset token is invalid or has expired.",
                    });
                }

                let email = result.email;
                
                userBase.updateOne({_id : result._id}, { $set: { resetPasswordExpires: Date.now() - 36000000 }})
                .exec()
                .then(result => {
                    console.log('token has been expired!')
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
        

                });

                if(result){
                    ejs.renderFile(appRoot + "/server/template/passwordChangeAlert.ejs", { user: 'user', email: result.email }, (err, data) => {
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
                                to: email, // list of receivers
                                subject: 'Security Alert', // Subject line
                                text: "Message", // plain text body
                                html: data, // html body
                            };
                        
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                    // res.render('message', {message : "We have received you email"});
                                console.log("Message Send Successfully to:" +result.email);
                                });
                        }
                        });
                
                res.status(200).json({
                    message: "Password updated successfully.",
                });
                } else {
                    res.status(401).json({
                        message: "Password reset token is invalid or has expired.",
                    });
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err.message
                });
            });
        }
    });
}

exports.changePasswordController = (req, res, next) => {
        //Validation
        var validationError = validator(req.body, changePasswordSchema);

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

    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);
    
    userBase.findOne({ email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Invalid credentials.'
                });
            }
            bcrypt.compare(req.body.currentPassword, user.password, (err,result) =>{
                if(err){
                    console.log(err);
                    return res.status(401).json({
                        message: 'Invalid credentials.'
                    });
                }
                if(result) {
                    if(req.body.password == req.body.confirmPassword){
                        bcrypt.hash(req.body.password, 10, (err,hash) => { //10 in saltround for non reverse password
                            if(err) {
                                return res.status(500).json({
                                    error : err.message
                                });
                            } else {
                                userBase.findOneAndUpdate({ email : req.body.email }, { $set: {
                                    password: hash
                                    }})
                                .exec()
                                .then(result =>{
                                    console.log(result)

                                    if(result) {

                                        ejs.renderFile(appRoot + "/server/template/passwordChangeAlert.ejs", { user: 'user', email: result.email}, (err, data) => {
                                            if (err) {
                                                console.log(err);
                                                res.status(500).json({
                                                    message : err
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
                                                    to: decoded.email, // list of receivers
                                                    subject: 'Security Alert', // Subject line
                                                    text: "Message", // plain text body
                                                    html: data, // html body
                                                };
                                            
                                                transporter.sendMail(mailOptions, (error, info) => {
                                                    if (error) {
                                                        return console.log(error);
                                                    }
                                                    console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                                        // res.render('message', {message : "We have received you email"});
                                                    console.log("Message Send Successfully: "+ decoded.email);
                                                    });
                                            }
                                        });

                                        res.status(200).json({
                                            message: "Password updated successfully.",
                                        });

                                    } else {
                                        res.status(401).json({
                                            message: "Somethings went wrong. Please try again.",
                                        });
                                    }

                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                    
                                });
                            }});
                    } else {
                            res.status(200).json({
                                message: "Password not match.",
                            });
                        }
                } else {
                    return res.status(401).json({
                        message: 'Invalid credentials.'
                    });
                }
                
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error : err.message
            });
        });
}

exports.resetOtherUserPasswordController = (req, res, next) => {
    //Validation
    var validationError = validator(req.body, resetOtherPasswordSchema);

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

    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    const { adminPassword, password, confirmPassword } = req.body;

    userBase.findOne({ email: decoded.email })
    .select('email password')
    .exec()
    .then(user =>{
        console.log(user, decoded.email);
        if(user === null){
            return res.status(401).json({
                message: 'Invalid credentials.'
            });
        }
        
        bcrypt.compare(adminPassword, user.password, (err,result) =>{
            if(err){
                return res.status(401).json({
                    message: 'Invalid credentials.'
                });
            }
            if(!result) {
                return res.status(401).json({
                    message: 'Invalid credentials.'
                });
            }
            
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            userBase.findOne({ _id: req.params._id })
            .exec()
            .then(docs => {
                if(docs === null) {
                    return  res.status(404).json({
                        message: 'Invalid user id.'
                    });
                }

                userBase.updateOne({ email: req.body.email },
                    {
                        $set: { password: hash, passwordChangeStatus: false }
                    }
                )
                .exec()
                .then(result => {
                    console.log(result);

                    if(result) {

                        ejs.renderFile(appRoot + "/server/template/accountCredentials.ejs", { email: req.body.email, password: req.body.password, role: '' }, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({
                                    message : err
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
                                    subject: 'Security Alert', // Subject line
                                    text: "Message", // plain text body
                                    html: data, // html body
                                };
                            
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                        // res.render('message', {message : "We have received you email"});
                                    console.log("Message Send Successfully: "+ decoded.email);
                                    });
                            }
                        });
    
                        res.status(200).json({
                            message: "Password updated successfully."
                        });
                    }
    
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: err.message
                    })
                });

            })
            .catch(err => {
                console.log(err);
                res.send(500).json({
                    error: err.message
                });

            });

        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    });

}

exports.resetPasswordController = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    //Validation
    var validationError = validator(req.body, requestResetSchema);

    if(req.body && decoded.email && req.body.password){

        //similarityScore betweem mail and password
        var similarityScore = stringSimilarity.compareTwoStrings(decoded.email.split('@')[0], req.body.password); 
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
    
    userBase.findOne({ email: decoded.email })
    .exec()
    .then(user =>{
        if(user == null){
            return res.status(401).json({
                message: 'Invalid credentials.'
            });
        }

        if(req.body.password == req.body.confirmPassword){
            bcrypt.hash(req.body.password, 10, (err,hash) => { //10 in saltround for non reverse password
                if(err) {
                    return res.status(500).json({
                        error : err.message
                    });
                } else {
                    userBase.update({ email : decoded.email },
                        { $set: { password: hash, passwordChangeStatus: true } }
                    )
                    .exec()
                    .then(result =>{

                        if(result) {

                            ejs.renderFile(appRoot + "/server/template/passwordChangeAlert.ejs", { user: 'user', email: decoded.email}, (err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({
                                        message : err
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
                                        to: decoded.email, // list of receivers
                                        subject: 'Security Alert', // Subject line
                                        text: "Message", // plain text body
                                        html: data, // html body
                                    };
                                
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Success:Message %s sent: %s', info.messageId, info.response);
                                            // res.render('message', {message : "We have received you email"});
                                        console.log("Message Send Successfully: "+ decoded.email);
                                        });
                                }
                            });

                            res.status(200).json({
                                message: "Password is changed."
                            });

                        } else {
                            res.status(401).json({
                                message: "Somethings went wrong. Please try again.",
                            });
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
        
        
                    });
                        }});
        } else {
            res.status(200).json({
                message: "Password not match.",
            });
        }
                
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err.message
        });
    });
}