'use strict';

angular.module('vppApp')
    .directive("data", function () {
        return {
            restrict: 'EA',
            templateUrl: 'public/directives/dataNav/data-nav.directive.html',
            controller: 'DataCtrl'
        };
    });