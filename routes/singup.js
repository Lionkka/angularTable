"use strict";
const express = require('express');
const router = express.Router();
const coutriesJSON  = require('../res/countries.json');
const citiesJSON = require('../res/world-cities.json');

router.get('/counties', getCounties);
router.get('/cities/:country', getCities);
router.post('/adduser', addUser);

function addUser(req, res, next) {

    setTimeout(()=>{
        getRandom()>1000
            ? res.send('success')
            :res.send('fail');
    },getRandom());
}

function getCounties(req, res, next) {

    setTimeout(()=>
        res.send(coutriesJSON)
        ,getRandom())


}

function getCities(req, res, next) {

    let country = req.params.country;
    let resCities = [];
    citiesJSON.forEach((item)=>{
        if (item.country === country){
            resCities.push(item.name);
        }
    });
    resCities.sort();
    setTimeout(()=>
            res.send(resCities)
        ,getRandom())

}
function getRandom() {
    return Math.floor(Math.random() * (2000 - 300 + 1)) + 300;
}
module.exports = router;