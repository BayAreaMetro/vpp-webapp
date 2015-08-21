'use strict';

angular.module('vppApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('mapping', {
                url: "/mapping",
                templateUrl: 'public/templates/mapping/mapping.html'
                //controller: 'MappingCtrl'
            });
    });