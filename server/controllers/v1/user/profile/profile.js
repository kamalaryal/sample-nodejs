const jwt = require('jsonwebtoken');

const userBase = require('../../../../models/userBase');

const { validator } = require('../../../../validators/');
const {
    editProfileSchema,
    editOtherProfileSchema
} = require('../../../../validators/user/userValidators');

exports.getSingleProfileController = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    userBase.findOne({ _id: decoded.userId })
    .select('email fullName role')
    .exec()
    .then(result => {

        if (result === null) {
            return res.status(404).json({
                message: "Invalid profile token."
            });
        }
        res.status(200).json(result);
        
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });

}

exports.getProfileController = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    userBase.find()
    .select('email fullName role createdAt status')
    .exec()
    .then(result => {

        if (result.length === 0) {
            return res.status(404).json({
                message: "No profile data exist."
            });
        }
        res.status(200).json(result);
        
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });

}

exports.editProfileController = (req, res, next) => {

    //Validation
    var validationError = validator(req.body, editProfileSchema);

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

        if(result === null) {
            return res.status(404).json({
                message: "Invalid user Id."
            });
        }

        userBase.updateOne(
            {
                _id: decoded.userId
            },
            {
                $set: { 
                    fullName: req.body.fullName,
                    email: req.body.email
                }
            }
        )
        .exec()
        .then(docs => {
            console.log(docs);
            
            if(docs.nModified === 0) {
                return res.status(200).json({
                    message: "Not modified."
                });
            }

            return res.status(200).json({
                message: "Profile updated successfully."
            });

        })
        .catch(err => {
            console.log(err);
            res.status.json({
                error: err.message
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err.message
        });
    });
}

exports.editOtherProfileController = (req, res, next) => {
    
    //Validation
    var validationError = validator(req.body, editOtherProfileSchema);

    if(validationError){
        return res.status(400).json({
            message: validationError
        });
    }
    //End of validation

    const token = req.headers.authorization.split(" ")[1]; //accessing after bearer i.e bearer token
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log(decoded);

    userBase.findOne({ _id: req.params._id })
    .exec()
    .then(result => {

        if(result === null) {
            return res.status(404).json({
                message: "Invalid user Id."
            });
        }

        userBase.updateOne(
            {
                _id: req.params._id
            },
            {
                $set: { 
                    fullName: req.body.fullName,
                    email: req.body.email,
                    role: req.body.role
                }
            }
        )
        .exec()
        .then(docs => {
            console.log(docs);
            
            if(docs.nModified === 0) {
                return res.status(200).json({
                    message: "Not modified."
                });
            }

            return res.status(200).json({
                message: "Profile updated successfully."
            });

        })
        .catch(err => {
            console.log(err);
            res.status.json({
                error: err.message
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err.message
        });
    });
}

exports.toggleStatusController = (req, res, next) => {
    userBase.findOne({ _id: req.params._id })
    .exec()
    .then(result => {
        if(result === null) {
            return res.status(404).json({
                message: 'Invalid user ID.'
            });
        }

        let status = result.status;

        userBase.update({ _id: req.params._id }, { $set: { status: !status } })
        .exec()
        .then(result => {
            console.log(result);

            if(result.nModified == 0) {
                return res.status(200).json({
                    message: "Not modified."
                });
            }

            if(status) {
                return res.status(200).json({
                    message: "User is Block."
                });
            } else {
                return res.status(200).json({
                    message: "User is Active."
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
    
}