exports.isAdmin = (req, res, next) => {
    var userData = req.userData;
    if(userData.role == "admin"){
        next();
    }else{
        return res.status(401).json({
            message: "Auth failed."
        })
    }
}