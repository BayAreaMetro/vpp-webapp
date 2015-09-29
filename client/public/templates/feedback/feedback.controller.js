'use strict';

angular.module('vppApp')
	.controller('FeedbackCtrl', [
		'$scope',
		'$http', 
		function($scope, $http){
			console.log("Feedback");
		}
	]
);