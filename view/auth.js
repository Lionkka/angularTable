"use strict";
const app = angular.module('app', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.controller('authCtrl', ($scope, $http, $timeout) =>{
    $scope.hasError = false;

    $scope.popup2 = {
        opened: false
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
});
