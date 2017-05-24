"use strict";

module.exports = (app) => {
    app.controller('authCtrl', ($scope, toaster, Restangular) => {

        getCountries();
        function getCountries() {
            toaster.pop('wait', "Process");
            Restangular.all('singup/counties').getList()
                .then((countries) => {
                    showMessage(countries);
                    $scope.countries = countries;
                });
        }

        $scope.getCities = (country) => {
            toaster.pop('wait', "Process");
            Restangular.all('singup/cities/' + country).getList()
                .then((cities) => {
                    $scope.cities = cities;
                    showMessage(cities);
                });
        };

        $scope.submitForm = function (isValid) {
            if (isValid) {

                toaster.pop('wait', "Storing your data");
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
                        showMessage(result === 'success');
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
