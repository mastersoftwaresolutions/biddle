// Angular module, defining routes for the app
var app = angular.module('biddle',["ngCookies"]);
	app.config(['$routeProvider',"$cookiesProvider", function($routeProvider,$cookies) {
		$routeProvider.
			when('/newbid', { templateUrl: '../partials/newbidform.html',controller: bidCtrl }).
			when('/searchbid', { templateUrl: '../partials/searchbid.html',controller:Searchbid }).
			when('/login', { templateUrl: '../partials/login.html',controller: loginCtrl }).

			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/' });
	}]);

app.directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
});