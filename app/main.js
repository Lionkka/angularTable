"use strict";
const angular = require('angular');
const app = angular.module('app',
    ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'toaster', 'ui.router', 'restangular', 'ngRoute']);

require('angular-animate');
require('angular-sanitize');
require('bootstrap');
require('angular-ui-bootstrap');
require('angular-route');
require('angularjs-toaster');
require('angular-ui-router');
require('restangular');

app.config(function ($stateProvider, RestangularProvider) {
    let signupState = {
        name: 'signup',
        url: '/signup',
        templateUrl: 'auth.html'
    };

    let tableFrontState = {
        name: 'tableFront',
        url: '/table-front',
        templateUrl: 'table.html'
    };

    let tableServerState = {
        name: 'tableServer',
        url: '/table-server',
        templateUrl: 'table.html'
    };

    $stateProvider.state(signupState);
    $stateProvider.state(tableFrontState);
    $stateProvider.state(tableServerState);

    RestangularProvider.setBaseUrl('http://localhost:3000/singup');
    RestangularProvider.setRequestInterceptor(function (elem, operation, what) {
        return elem;
    });
});


require('./auth')(app);
require('./table')(app);