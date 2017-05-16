"use strict";
const app = angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('productCtrl', ($scope, $http, $timeout) => {
    $scope.sortType = 'id';
    $scope.sortReverse = false;
    $scope.maxSize = 10;
    $scope.bigTotalItems = 10;
    $scope.bigCurrentPage = 1;
    $scope.numPages = 0;
    $scope.products = [];
    $scope.data = [];

    $timeout(productsReq, '10');

    $scope.pageChanged = function () {
        $scope.data = $scope.products.slice(($scope.bigCurrentPage - 1) *
            $scope.maxSize, $scope.bigCurrentPage * $scope.maxSize);
    };

    $scope.sortProduct = function (sortType) {
        $scope.products.sort((a, b)=> {

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
                $scope.numPages = $scope.bigTotalItems / $scope.maxSize;
                $scope.pageChanged();
            })
            .error((err) => console.log(err));
    }


});