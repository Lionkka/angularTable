"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const products = require('./routes/products');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/products', products);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    if (!res.status)
        res.status(err.status || 500);

    res.json({
        error: err.message
    });
});
app.listen(3000, function () {
    console.log('listen');
});