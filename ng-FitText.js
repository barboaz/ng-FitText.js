/* ng-FitText.js v2.2.1
 * https://github.com/patrickmarabeas/ng-FitText.js
 *
 * Original jQuery project: https://github.com/davatron5000/FitText.js
 * Includes use of Underscore's debounce function
 *
 * Copyright 2014, Patrick Marabeas http://marabeas.io
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 25/02/2014
 */

'use strict';

angular.module( 'ngFitText', [] )
	.constant( 'config', {
		'debounce': true,
		'delay': 250
	})
	.directive( 'fittext', [ 'config', function( config ) {
		return {
			restrict: 'A',
			scope: true,
			transclude: true,
			replace: true,
			template: function( element, attrs ) {
				var tag = element[0].nodeName;
				return "<"+tag+" data-ng-transclude data-ng-style='{fontSize:fontSize}'></"+tag+">";
			},
			link: function( scope, element, attrs ) {
				scope.compressor = attrs.fittext || 1;
				scope.minFontSize = attrs.fittextMin || Number.NEGATIVE_INFINITY;
				scope.maxFontSize = attrs.fittextMax || Number.POSITIVE_INFINITY;
				scope.elementWidth = element[0].offsetWidth;

				( scope.resizer = function() {
					scope.elementWidth = element[0].offsetWidth;
					scope.fontSize = Math.max(
						Math.min(
							scope.elementWidth / ( scope.compressor * 10 ),
							parseFloat( scope.maxFontSize )
						),
						parseFloat( scope.minFontSize )
					) + 'px';

					if( !scope.$$phase ) scope.$digest();
				})();

				config.debounce == true
					? angular.element( window ).bind( 'resize', debounce( scope.resizer, config.delay ))
					: angular.element( window ).bind( 'resize', scope.resizer);

				function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}
			}
		}
	}]);