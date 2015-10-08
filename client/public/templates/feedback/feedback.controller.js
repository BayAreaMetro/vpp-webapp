'use strict';

angular.module('vppApp')
    .controller('FeedbackCtrl', [
		'$scope',
		'$http',
		function ($scope, $http) {
			
			$scope.feedbackCat;
			$scope.feedbackType;
			$scope.feedbackComment;
			$scope.feedbackMessage;
			$scope.isActive;
			
			$scope.toggle = function(){
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
			        $('#feedbackCategory').val("");
			        $('#feedbackType').val("");
			        $('#feedbackComment').val("");
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