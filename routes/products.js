"use strict";
const express = require('express');
const router = express.Router();
let productsDB = require('../output');

router.get('/', getAllProducts);
router.get('/paginate', getAllProductsWithPagination);
router.get('/groups', getGroups);

function getGroups(req, res, next) {
    let avaibleGroups = [];
    productsDB.forEach((item)=>{
        if(avaibleGroups.indexOf(item.group_id) < 0){
            avaibleGroups.push(item.group_id);
        }
    });

    avaibleGroups.sort();
    res.send(avaibleGroups);
}

function getAllProducts(req, res, next) {
    res.send(JSON.stringify(productsDB));
}
function getAllProductsWithPagination(req, res, next) {

    let output = productsDB;
    let reqData = req.query;
    let response = {};

    output = searchProducts(output, reqData);
    output = sortProducts(output, reqData);

    response.totalItems = output.length;
    output = output.slice((reqData.page - 1) * reqData.maxSize, reqData.page * reqData.maxSize);

    response.output = output;
    res.send(response);


}
function searchProducts(output, reqData) {

    let filteredData = [];
    let searchPhrases = JSON.parse(reqData.searchPhrases);

    output.forEach((item) => {

        let isPass = true;

        for(let col in searchPhrases){
            if(col === 'connectivity'){
                if(item[col].toLowerCase()
                        .indexOf(searchPhrases[col].toLowerCase()) !== 0 )
                    isPass = false;
            }
            if (item[col].toLowerCase()
                    .indexOf(searchPhrases[col].toLowerCase()) === -1) {
                isPass = false;
            }
        }
        if(isPass){
            filteredData.push(item);
        }
    });

    return filteredData;
}
function sortProducts(output, reqData) {

    let order = !(reqData.sortReverse === 'true') ? 1 : -1;

    output.sort((a, b) => {
        if (reqData.sortType === 'price') {

            let firstNumber = a.price;
            let secondNumber = b.price;

            firstNumber = parseFloat(firstNumber.replace(/[^.\d]+/g, ''));
            secondNumber = parseFloat(secondNumber.replace(/[^.\d]+/g, ''));

            if (firstNumber < secondNumber)
                return -order;
            if (firstNumber > secondNumber)
                return order;
            return 0;
        }
        else {
            if (a[reqData.sortType] < b[reqData.sortType])
                return -order;
            if (a[reqData.sortType] > b[reqData.sortType])
                return order;
            return 0;
        }
    });

    return output;
}

module.exports = router;