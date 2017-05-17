"use strict";
const app = angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('productCtrl', ($scope, $http, $timeout) => {
    $scope.sortType = 'id';
    $scope.sortReverse = false;
    $scope.maxSize = 10;
    $scope.bigTotalItems = 10;
    $scope.bigCurrentPage = 1;
    $scope.numPages = Math.ceil( $scope.bigTotalItems/$scope.maxSize);
    $scope.products = [];
    $scope.data = [];
    $scope.search = {
        id: '',
        title: '',
        price: '',
        timestamp: ''
    };


    $timeout(productsReq, '2000');

    $scope.searchProduct = function (type) {

        $scope.data = [];
        $scope.products.forEach((item) => {
            if (item[type].toLowerCase().indexOf($scope.search[type].toLowerCase()) > -1) {
                $scope.data.push(item);
            }
        });
        $scope.bigCurrentPage = 1;
        $scope.bigTotalItems = $scope.data.length;
        $scope.numPages = Math.ceil( $scope.bigTotalItems/$scope.maxSize);

    };

    $scope.pageChanged = function () {
        $scope.data = $scope.products.slice(($scope.bigCurrentPage - 1) *
            $scope.maxSize);
    };

    $scope.sortProduct = function (sortType) {
        $scope.products.sort((a, b) => {

            let order = !$scope.sortReverse ? 1 : -1;
            if (sortType === 'price') {

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
                if (a[sortType] < b[sortType])
                    return -order;
                if (a[sortType] > b[sortType])
                    return order;
                return 0;
            }
        });
        $scope.pageChanged();
    };

    function productsReq() {
        $http.get('http://localhost:3000/products')
            .success((result) => {

                $scope.products = result;
                $scope.bigTotalItems = result.length;
                $scope.pageChanged();
                $scope.numPages = Math.ceil( $scope.bigTotalItems/$scope.maxSize);
            })
            .error((err) => console.log(err));
    }


});