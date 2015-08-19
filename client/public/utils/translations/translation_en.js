'use strict';

angular.module('vppApp')
    .config(function ($translateProvider) {

		// Make sure translation are escaped properly
		$translateProvider.useSanitizeValueStrategy('sanitize');

		// English translations
		$translateProvider.translations('en', {
            HEADLINE: 'Viva La Costume'
        });
    });