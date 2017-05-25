"use strict";

module.exports = (app) => {
    app.controller('authCtrl', ($scope, toaster, Restangular,cfpLoadingBar) => {



        getCountries();
        function getCountries() {
            cfpLoadingBar.start();
            let message = toaster.pop('wait', "Process");
            Restangular.all('singup/counties').getList()
                .then((countries) => {
                    cfpLoadingBar.complete();
                    toaster.clear(message);
                    $scope.countries = countries;
                });
        }

        $scope.getCities = (country) => {
            let message = toaster.pop('wait', "Process");
            cfpLoadingBar.start();
            Restangular.all('singup/cities/' + country).getList()
                .then((cities) => {
                    $scope.cities = cities;
                    cfpLoadingBar.complete();
                    toaster.clear(message);
                });
        };

        $scope.submitForm = function (isValid) {
            if (isValid) {
                cfpLoadingBar.start();
                let message = toaster.pop('wait', "Process");
                let formObj = {
                    first_name: $scope.first_name,
                    last_name: $scope.last_name,
                    height: $scope.height,
                    bday: $scope.bday,
                    gender: $scope.gender,
                    country: $scope.selectedCountry,
                    city: $scope.selectedCity,
                    password: $scope.password

                };
                Restangular.all('singup/adduser')
                    .post(formObj)
                    .then((result) => {
                        toaster.clear(message);
                        toaster.pop('success', "Success", null, 5000);
                        cfpLoadingBar.complete();
                    });
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
};
