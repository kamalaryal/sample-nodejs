const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
global.appRoot = path.resolve(__dirname);

const routes = require('./server/routes');
const { mongoUrl } = require('./server/config/db');

mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(console.log('mongoDB Connected.'));
// mongoose.connect('mongodb://localhost:27017/loginPortal', { useNewUrlParser: true }).then(console.log('mongoDB Connected.'));
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/v1/', routes);

app.use('/', express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    console.log("mapped to cms")
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

// app.use((req, res, next) =>{
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) =>{
//    res.status(error.status || 500);
//    res.json({
//         message : error.message
//    });
//    console.log(error);
// });


module.exports = app;