angular.module('vppApp')
    .controller('AboutCtrl', [
        '$scope',
        '$http',
        function($scope, $http) {
            'use strict';
            $scope.contact = {};

            var devDataUrl = "http://localhost:3003";
            var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

            //Submit contact form
            $scope.submitContact = function(form) {
                if (form.$valid) {
                    $http.post(devDataUrl + "/data/submitcontact", $scope.contact).success(function(data, status) {
                        $scope.message = data;
                        console.log(data);
                        if (data.response === "success") {
                            $scope.contact = {};
                            $scope.contactMessage = "Thank you for your comments!";
                        } else if (data.response === 'error') {
                            $scope.contactMessage = "Something went wrong. Please try submitting the form again, or emailing us directly on ksmith@mtc.ca.gov";
                        }
                    });
                } else {
                    $scope.contactMessage = "Please fix errors on the page and submit again";
                }

            };

        }
    ]);
