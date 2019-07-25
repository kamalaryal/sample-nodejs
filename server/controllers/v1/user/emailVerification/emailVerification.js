const jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");
const ejs = require("ejs");
const _ = require('lodash');

const userBase = require('../../../../models/userBase');

const { validator } = require('../../../../validators/');
const { getResetLinkSchema } = require('../../../../validators/user/userValidators');

exports.getVerificationLinkController = (req, res, next) => {
    //Validation
    var validationError = validator(req.body, getResetLinkSchema);

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
    .exec()
    .then(result => {

        var userId = _.find(result, { email: req.body.email });
        
        if(!userId) {
            return res.status(409).json({
                message: "Error: Invalid request."
            });
        }

        ejs.renderFile(appRoot + "/server/template/verification.ejs", { link: 'https://localhost:5001/user/verification/'+result.multiUseToken, role: result.role, fullName: result.fullName }, (err, data) => {
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

        res.status(200).json({
            message: "Verification link has been send to your email"
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err.message
        });
    });
}

exports.verificationTokenController = (req, res, next) => {

    userBase.findOne({ multiUseToken: req.params.token })
    .exec()
    .then(result => {

        var userId = _.find(result, { multiUseToken: req.params.token });

        if (result === null) {
            return res.status(200).json({
                message: "Password reset token is invalid or has expired."
            });

        }

        if (userId.verificationStatus == "verified") {
            return res.status(200).json({
                message: "Your accout has been already verified"
            });

        } else {

            id = result._id
            userBase.findOneAndUpdate(
                {
                    _id: id, multiUseToken: req.params.token
                },
                {
                     $set: { verificationStatus: 'verified' }
                }
            )
            .exec()
            .then(result =>{
                console.log('Userbase collection updated.');
                res.status(200).json({
                    message: "Your account has been verfied successfully!",
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err.message
                });

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