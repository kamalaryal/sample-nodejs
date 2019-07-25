const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");
const Speakeasy = require("speakeasy");
const ejs = require("ejs");

const userBase = require('../../../../models/userBase');

const { validator } = require('../../../../validators/');
const {
    loginSchema,
    OTPSchema
} = require('../../../../validators/user/userValidators');

exports.loginController = (req, res, next) => {

    //Validation
    var validationError = validator(req.body, loginSchema);

    if(validationError){
        return res.status(400).json({
            message: validationError
        });
    }
    //End of validation

    userBase.findOne({ email: req.body.email.toLowerCase() })
    .exec()
    .then(user =>{

        if(user === null) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        } else if(!user.status){
            return res.status(401).json({
                message : 'Your account has been blocked by admin.'
            });
        }

        var mainId = user._id;
        var role = user.role;
        var email = user.email;
        var status = user.passwordChangeStatus;
        var secret = user.otpCode;
        var passwordChangeStatus = user.passwordChangeStatus;

        bcrypt.compare(req.body.password, user.password, (err,result) =>{
            if(err){
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if(result) {

                const token = jwt.sign({
                        email: email,
                        userId: mainId,
                        role: role,
                        status: status
                    }, 
                    process.env.secret_key,   
                    {
                        expiresIn: process.env.token_expires_in
                    },
                );
                const refreshToken = jwt.sign({
                    email: email,
                    userId: mainId,
                    role: role,
                    status: status
                }, 
                process.env.refresh_token_secret_key,   
                {
                    expiresIn: process.env.token_expires_in
                },
                );

                if(passwordChangeStatus) {
                    
                    getOTP(secret, email);
                    return res.status(200).json({
                        message: 'Auth Successful. OTP code is send to your E-mail. Please check the E-mail.',
                        token: token,
                        refreshToken: refreshToken
                    });

                }

                return res.status(200).json({
                    message: 'Auth Successful. Please change your password.',
                    token: token,
                    refreshToken: refreshToken
                });

            }

            res.status(401).json({
                message: 'Auth Failed'
            });
            
        });

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err.message
        });
    });
}

exports.getOTPCodeController = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    userBase.findOne({ _id: decoded.userId })
    .select('otpCode email')
    .exec()
    .then(result => {

        if(result == null) {
            return res.status(401).json({
                message: "Auth failed."
            });
        }

        getOTP(result.otpCode, result.email);

        res.status(200).json({
            message: "New OTP code is send to your E-mail. Please check the E-mail."
        })
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

function getOTP(secret, email) {
    let { token, remaining } = getToken(secret);
    console.log(token ,remaining);
    
    ejs.renderFile(appRoot + "/server/template/otpAuthentication.ejs", { token, timeRemaining: remaining }, (err, data) => {
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
                subject: 'OTP Authentication ', // Subject line
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
    
    return null;
}

function getToken(secret) {
    return({
        "token":Speakeasy.totp({
            secret: secret,
            encoding: "base32"
        }),
        "remaining":(30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
    })
}

function ValidateOTP(secret, token) {
    return(
        Speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: token,
            window: 0
        })
    )
}

exports.ValidateOTPController = (req, res, next) => {
        //Validation
        var validationError = validator(req.body, OTPSchema);

        if(validationError){
            return res.status(400).json({
                message: validationError
            });
        }
        //End of validation

    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    userBase.findOne({ _id: decoded.userId })
    .select('otpCode')
    .exec()
    .then(result => {

        console.log(ValidateOTP(result.otpCode, req.body.token));
        if(!ValidateOTP(result.otpCode, req.body.token)) {
            return res.status(401).json({
                message: "Auth Failed"
            })
        }


        const token = jwt.sign({
            otpStatus: true,
        }, 
        process.env.secret_key,   
        {
            expiresIn: process.env.token_expires_in
        },
        );

        res.status(200).json({
            message: "Auth Successful",
            otpStatus: token
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });

}