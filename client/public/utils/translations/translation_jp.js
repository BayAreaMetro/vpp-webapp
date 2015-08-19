'use strict';

angular.module('vppApp')
    .config(function ($translateProvider) {

		// Make sure translation are escaped properly
		$translateProvider.useSanitizeValueStrategy('sanitize');

		// French translations
        $translateProvider.translations('jp', {
            HEADLINE: 'ビバラコスチューム'
        });
    });