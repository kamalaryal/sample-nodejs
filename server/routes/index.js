const express = require('express');
const router = express.Router();

const userRoutes = require('./v1/user/user');

router.use('/user', userRoutes);

router.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) =>{
   res.status(error.status || 500);
   res.json({
        message : error.message
   });
   console.log(error);
});

module.exports = router;