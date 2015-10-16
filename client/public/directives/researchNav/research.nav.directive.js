'use strict';

angular.module('vppApp')
    .directive("researchNav", function () {
        return {
            restrict: 'EA',
            scope: {
                snippets: '='
            },
            controller: 'ResearchCtrl',
            templateUrl: 'public/directives/researchNav/research.nav.directive.html',
            link: function ($scope) {

                // Placeholder
            }
        };
    });
