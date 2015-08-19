// 'use strict';

// angular.module('vppApp')
// 	.factory('Auth', function Auth($location, $rootScope, $http, $cookieStore, $q) {
// 		var currentUser = {};
// 		if ($cookieStore && $cookieStore.get('sessionId')) {
// 			currentUser = {
// 				sessionId: $cookieStore.get('sessionId')
// 			};
// 		}

// 		return {

// 			/**
// 			 * Authenticate user and save token
// 			 *
// 			 * @param  {Object}   user     - login info
// 			 * @param  {Function} callback - optional
// 			 * @return {Promise}
// 			 */
// 			login: function(user, callback) {
// 				var cb = callback || angular.noop;
// 				var deferred = $q.defer();

// 				$http.get('app/json/login.json').
// 					success(function(data) {

// 						$cookieStore.put('sessionId', data.sessionid);

// 						currentUser = {
// 							sessionId: data.sessionid
// 						};

// 						deferred.resolve(data);
// 						return cb();
// 					}).
// 					error(function(err) {
// 						this.logout();
// 						deferred.reject(err);
// 						return cb(err);
// 					}.bind(this));

// 				return deferred.promise;
// 			},

// 			/**
// 			 * Delete access token and user info
// 			 *
// 			 * @param  {Function}
// 			 */
// 			logout: function() {
// 				$cookieStore.remove('sessionId');
// 				currentUser = {};
// 			},

// 			/**
// 			 * Gets all available info on authenticated user
// 			 *
// 			 * @return {Object} user
// 			 */
// 			getCurrentUser: function() {
// 				return currentUser;
// 			},

// 			/**
// 			 * Get auth token
// 			 */
// 			getSessionId: function() {
// 				return $cookieStore.get('sessionId');
// 			}
// 		};
// 	});
