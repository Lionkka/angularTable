"use strict";
const express = require('express');
const router = express.Router();
let output = require('../output');

router.get('/', getProducts);

function getProducts(req, res) {
    res.send(JSON.stringify(output));
}
module.exports = router;