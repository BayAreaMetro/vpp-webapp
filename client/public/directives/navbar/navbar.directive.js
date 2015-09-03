'use strict';

angular.module('vppApp')
    .directive("navTemplate", function () {
        return {
            restrict: 'EA',
            scope: {
                snippets: '='
            },
            controller: 'NavCtrl',
            templateUrl: 'public/directives/navbar/navbar.directive.html',
            link: function ($scope) {

                // Placeholder
                $scope.user = {
                    name: 'What is this?'
                };
            }
        };
    });