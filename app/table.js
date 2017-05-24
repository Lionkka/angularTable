"use strict";

module.exports = (app) => {
    app.controller('productCtrl', ($scope, $timeout, toaster, Restangular) => {
        $scope.sortType = 'id';
        $scope.connectivity = ['Blocked', 'Unblocked'];
        $scope.sortReverse = false;
        $scope.maxSize = 10;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;
        $scope.numPages = Math.ceil($scope.bigTotalItems / $scope.maxSize);
        $scope.products = [];
        $scope.groups = [];
        $scope.sortType = 'id';
        $scope.search = {
            id: '',
            title: '',
            price: '',
            timestamp: '',
            group_id: '',
            connectivity: ''
        };
        getGroups();
        productsReq();
        function getGroups() {
            toaster.pop('wait', "Process");
            Restangular.all('products/groups').getList().then((groups) => {
                //showMessage(groups);
                $scope.groups = groups;
            });
        }

        $scope.searchProduct = function () {

            $scope.data = [];

            $scope.products.forEach((item) => {

                let isPass = true;

                for (let col in $scope.search) {
                    if (col === 'connectivity') {
                        if (item[col].toLowerCase()
                                .indexOf($scope.search[col].toLowerCase()) !== 0)
                            isPass = false;
                    }
                    if (item[col].toLowerCase()
                            .indexOf($scope.search[col].toLowerCase()) === -1) {
                        isPass = false;
                    }
                }
                if (isPass) {
                    $scope.data.push(item);
                }
            });

            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = $scope.data.length;
            $scope.numPages = Math.ceil($scope.bigTotalItems / $scope.maxSize);

        };

        $scope.pageChanged = function () {
            $scope.data = $scope.products.slice(($scope.bigCurrentPage - 1) *
                $scope.maxSize);
        };

        $scope.sortProduct = function () {
            $scope.products.sort((a, b) => {

                let order = !$scope.sortReverse ? 1 : -1;
                if ($scope.sortType === 'price') {

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
                    if (a[$scope.sortType] < b[$scope.sortType])
                        return -order;
                    if (a[$scope.sortType] > b[$scope.sortType])
                        return order;
                    return 0;
                }
            });
            $scope.pageChanged();
        };

        function productsReq() {
            toaster.pop('wait', "Process");
            $timeout(() => {
                Restangular.all('products').getList().then((result) => {
                    showMessage(result);
                    $scope.products = result;
                    $scope.bigTotalItems = result.length;
                    $scope.pageChanged();
                    $scope.numPages = Math.ceil($scope.bigTotalItems / $scope.maxSize);
                });

            }, '2000');


        }

        function showMessage(response) {
            toaster.clear();
            console.log('must be toaster');
            if (response) {
                toaster.pop('success', "Success", null, 5000);
            }
            else {
                toaster.pop('error', "Something wrong", null, 5000);
            }
        }


    });

    app.controller('serverSortCtrl', ($scope, toaster, Restangular) => {
        $scope.sortType = 'id';
        $scope.connectivity = ["Blocked", "Unblocked"];
        $scope.sortReverse = false;
        $scope.groups = [];
        $scope.maxSize = 10;
        $scope.totalItems = 10;
        $scope.currentPage = 1;
        $scope.numPages = Math.ceil($scope.totalItems / $scope.maxSize);
        $scope.searchPhrases = {
            id: '',
            title: '',
            price: '',
            timestamp: '',
            group_id: '',
            connectivity: ''
        };
        getGroups();
        function getGroups() {
            toaster.pop('wait', "Process");
            Restangular.all('products/groups').getList().then((groups) => {
                showMessage(groups);
                $scope.groups = groups;
            });
        }

        $scope.requestData = () => {
            toaster.pop('wait', "Process");

            let params = {
                page: $scope.currentPage,
                maxSize: $scope.maxSize,
                searchPhrases: $scope.searchPhrases,
                sortType: $scope.sortType,
                sortReverse: $scope.sortReverse
            };
            Restangular.all('products/paginate')
                .getList(params)
                .then((result) => {
                    showMessage(result);
                    $scope.data = result[1];
                    $scope.totalItems = result[0];
                    $scope.numPages = Math.ceil($scope.totalItems / $scope.maxSize);
                });
        };
        $scope.requestData();

        function showMessage(response) {
            toaster.clear();
            if (response) {
                toaster.pop('success', "Success", null, 1000);
            }
            else {
                toaster.pop('error', "Something wrong", null, 5000);
            }
        }
    });


};

