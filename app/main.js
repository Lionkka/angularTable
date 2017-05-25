"use strict";
const angular = require('angular');
const app = angular.module('app',
    ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'toaster', 'ui.router', 'restangular', 'ngRoute', 'cfp.loadingBar']);

require('angular-animate');
require('angular-sanitize');
require('bootstrap');
require('angular-ui-bootstrap');
require('angular-route');
require('angularjs-toaster');
require('angular-ui-router');
require('restangular');
require('angular-loading-bar');

app.config(($stateProvider, RestangularProvider) => {
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
        templateUrl: 'table-server.html'
    };

    $stateProvider.state(signupState);
    $stateProvider.state(tableFrontState);
    $stateProvider.state(tableServerState);

    RestangularProvider.setBaseUrl('http://localhost:3000/');

});
app.run((Restangular, cfpLoadingBar, toaster)=>{
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        cfpLoadingBar.complete();
        toaster.clear();
        toaster.pop('error', "Error", response.data, 5000);

        return false;
    });
});
require('./table')(app);
require('./auth')(app);
