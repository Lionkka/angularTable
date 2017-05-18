"use strict";
const app = angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'toaster']);

app.controller('authCtrl', ($scope, $http, toaster) => {
    let url = 'http://localhost:3000/singup';
    $scope.hasError = false;
    $scope.countries = [];
    $scope.cities = [];

    getCountries();

    $scope.getCities = (country) => {
        $scope.cities = [];

        $http({
            method: 'GET',
            url: url + '/cities/' + country,
        }).then(
            (result) => {
                $scope.cities = result.data;
            },
            (err) => console.log(err)
        );
    };
    function getCountries() {
        $http({
            method: 'GET',
            url: url + '/counties',
        }).then(
            (result) => {
                $scope.countries = result.data;
            },
            (err) => console.log(err)
        );
    }

    $scope.submitForm = function (isValid) {
        if (isValid) {

            toaster.pop('wait', "Storing your data");
            $http({
                method: 'POST',
                url: url + '/adduser',
                data: {
                    first_name: $scope.first_name,
                    last_name: $scope.last_name,
                    height: $scope.height,
                    bday: $scope.bday,
                    gender: $scope.gender,
                    country: $scope.selectedCountry,
                    city: $scope.selectedCity,
                    password: $scope.password


                }
            }).then(
                (result) => {

                    console.log(result.data);
                    toaster.clear();
                    if(result.data === 'success')
                        toaster.pop('success', "Success", null, 2000);
                    else
                        toaster.pop('error', "Something wrong", null, 2000);
                },
                (err) => console.log(err)
            );

        }

    };

    //datepicker function

    $scope.popup2 = {
        opened: false
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(1917, 0, 0),
        startingDay: 1
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    function disabled(data) {
        let date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

});


app.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                let combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        let origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});
