'use strict';

angular.module('vppApp')
    .controller('FeedbackCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
            console.log("Feedback");
            var devDataUrl = "http://localhost:3003";
            var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

            $('#submitFeedbackBTN').click(function () {

                $scope.feedbackCategory = $('#feedbackCategory').val();
                $scope.feedbackType = $('#feedbackType').val();
                $scope.feedbackComment = $('#feedbackComment').val();

                //http request for Master Summary Data
                $http({
                    url: publicDataURL + '/data/submitfeedback?fc=' + $scope.feedbackCategory + '&ft=' + $scope.feedbackType + '&fcomment=' + $scope.feedbackComment,
                    method: 'POST'
                }).success(function (results) {
                    //console.log(results);

                }).error(function (data, status) {
                    //console.log("There was an error:", status);

                });
                //End of http request

            });
  }
 ]);