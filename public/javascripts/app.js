// Angular module, defining routes for the app
angular.module('biddle',[]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/newbid', { templateUrl: '../partials/newbidform.html',controller: bidCtrl }).
			when('/searchbid', { templateUrl: '../partials/searchbid.html',controller:Searchbid }).

			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/' });
	}]);

