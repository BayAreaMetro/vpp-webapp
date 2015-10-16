'use strict';

angular.module('vppApp')
    .directive("navTemplateLarge", function () {
        return {
            restrict: 'EA',
            scope: {
                snippets: '='
            },
            controller: 'NavLargeCtrl',
            templateUrl: 'public/directives/navbarLarge/navbar-large.directive.html',
            link: function ($scope) {

                // Placeholder
                $scope.user = {
                    name: 'What is this?'
                };
            }
        };
    });