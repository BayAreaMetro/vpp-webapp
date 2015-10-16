'use strict';


angular.module('vppApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'cgNotify',
	'rzModule'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider) {

        $urlRouterProvider.otherwise("/");
        //$locationProvider.html5Mode(true);

        // Set the preferred language
        $translateProvider.preferredLanguage('en');

        // Set headers w/ interceptor
        //$httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function ($rootScope, $q, $cookieStore) {
        return {

            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookieStore && $cookieStore.get('sessionId')) {
                    config.headers.sessionid = $cookieStore.get('sessionId');
                }

                return config;
            },

            // Intercept 401s
            responseError: function (response) {
                if (response.status === 401) {
                    // remove any stale tokens
                    $cookieStore.remove('sessionId');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    })
    .run(function ($rootScope, $location) {});