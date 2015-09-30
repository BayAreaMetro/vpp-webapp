'use strict';

angular.module('vppApp')
    .controller('FeedbackCtrl', [
	'$scope',
	'$http',
	function ($scope, $http) {
		
		$scope.feedbackCat;
		$scope.feedbackType;
		$scope.feedbackComment;
		console.log("Feedback");
		
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
		        $('#feedbackSuccess').addClass('in');
		
		
		    }).error(function (data, status) {
		        //console.log("There was an error:", status);
		
		        $('#feedbackFailure').addClass('in');
		
		    });
		    //End of http request
		
		});
  	}
 ]);