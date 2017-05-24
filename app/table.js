"use strict";

module.exports = (app)=>{
    app.controller('productCtrl', ($scope, $http, $timeout) => {
        let url = 'http://localhost:3000/products';
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


        $http.get(url + '/groups').then(
            (result) => {
                $scope.groups = result.data;
            },
            (err) => console.log(err));

        $timeout(productsReq, '2000');

        $scope.searchProduct = function () {

            $scope.data = [];

            $scope.products.forEach((item) => {

                let isPass = true;

                for (let col in $scope.search) {
                    if(col === 'connectivity'){
                        if(item[col].toLowerCase()
                                .indexOf($scope.search[col].toLowerCase()) !== 0 )
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
            $http.get(url)
                .success((result) => {

                    $scope.products = result;
                    $scope.bigTotalItems = result.length;
                    $scope.pageChanged();
                    $scope.numPages = Math.ceil($scope.bigTotalItems / $scope.maxSize);
                })
                .error((err) => console.log(err));
        }


    });

    app.controller('serverSortCtrl', ($scope, $http) => {
        let url = 'http://localhost:3000/products';
        $scope.sortType = 'id';
        $scope.connectivity = ["Blocked", "Unblocked"];
        $scope.isLoading = true;
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
        $http.get(url + '/groups').then(
            (result) => {
                $scope.groups = result.data;
            },
            (err) => console.log(err));

        $scope.requestData = () => {
            $scope.isLoading = true;
            $http({
                method: 'GET',
                url: url + '/paginate',
                params: {
                    page: $scope.currentPage,
                    maxSize: $scope.maxSize,
                    searchPhrases: $scope.searchPhrases,
                    sortType: $scope.sortType,
                    sortReverse: $scope.sortReverse
                }
            })
                .then(
                    (result) => {
                        $scope.data = result.data.output;
                        $scope.totalItems = result.data.totalItems;
                        $scope.numPages = Math.ceil($scope.totalItems / $scope.maxSize);
                        $scope.isLoading = false;
                    },
                    (err) => console.log(err)
                );
        };
        $scope.requestData();
    });
};

