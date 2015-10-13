'use strict';

angular.module('vppApp')
    .controller('FeedbackCtrl', [
		'$scope',
		'$http',
	  	function ($scope, $http) {
	
            $scope.feedbackCat = "Select one of the following...";
            $scope.feedbackType = "Select one of the following...";
            $scope.feedbackComment;
            $scope.feedbackMessage;
            $scope.isActive;

            $scope.toggle = function () {
                $scope.isActive = !$scope.isActive;
            };

            var devDataUrl = "http://localhost:3003";
            var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";
            $(document).on('click', '.close', function () {
                $('#feedbackSuccess').removeClass('in');

            });
            $(document).on('click', '.closefail', function () {
                $('#feedbackFailure').removeClass('in');

                //$('.alert').hide();

            });
            $(".ddFeedbackCategory").on('click', '.fcat-li', function (e) {
                $scope.feedbackCat = $(this).children('.selected-fbCat').text();

            });
            $(".ddFeedbackType").on('click', '.ftyp-li', function (e) {
                $scope.feedbackType = $(this).children('.selected-fbType').text();

            });
            $scope.fbCat = [
                {
                    "Category": "Site Page: Research & Policies"

                    },
                {
                    "Category": "Site Page: Parking Data"

                    },
                {
                    "Category": "Site Page: Parking Map"

                    },
                {

                    "Category": "Site Page: Help"
                    },
                {

                    "Category": "Other"
                    }
            ];
            //Data Object for Feedback Category
            $scope.fbType = [
                {
                    "Category": "General Feedback"

                    },
                {
                    "Category": "Suggestion"
                    },
                {
                    "Category": "Application Bug"

                    },
                {
                    "Category": "Enhancement Request"
                    }];


            $('#submitFeedbackBTN').click(function () {
                $scope.feedbackMessage = "";
                $(".feedback-message").show();
                //$scope.feedbackCategory = $('#feedbackCategory').val();
                // $scope.feedbackType = $('#feedbackType').val();
                //$scope.feedbackComment = $('#feedbackComment').val();

                //http request for Master Summary Data
                $http({
                    url: publicDataURL + '/data/submitfeedback?fc=' + $scope.feedbackCat + '&ft=' + $scope.feedbackType + '&fcomment=' + $scope.feedbackComment,
                    method: 'POST'
                }).success(function (results) {
                    //console.log(results);
                    $scope.feedbackCat = "Select one of the following...";
                    $scope.feedbackType = "Select one of the following...";
                    $scope.feedbackComment = "";
                    //$('#feedbackSuccess').addClass('in');
                    $scope.feedbackMessage = "Thanks for your Feedback.";
                    $(".feedback-message").delay(5000).fadeOut(100);


                }).error(function (data, status) {
                    //console.log("There was an error:", status);

                    $('#feedbackFailure').addClass('in');

                });
                //End of http request
            });

            $scope.op = {
                floor: 0,
                ceil: 100,
                value: 70
            };
	    }
   ]
);