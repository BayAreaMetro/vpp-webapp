'use strict';

angular.module('vppApp')
	.directive("footerTemplate", function ($http, $compile, $translate) {
		return {
			restrict: 'EA',
			scope: {
				snippets: '='
			},
			templateUrl: 'footer/footer.directive.html',
			link: function($scope) {

				$scope.changeLanguage = function (key) {
					$translate.use(key);
				};

				// Add tab support for 508 compliance
				$scope.changeLanguageOnEnter = function (key, e) {

					if(e.which === 13) {
						$translate.use(key);
					}

				};

				$scope.adaReturnToStart = function(){
					$('#user-link').focus();
					return false;
				};
			}
		};
	});