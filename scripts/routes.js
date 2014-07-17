'use strict';
Application.config([
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/', {controller: 'IndexController', templateUrl: 'partials/index.html'})
			.when('/login', {controller: 'LoginController', templateUrl: 'partials/login.html'})
			.when('/logout', {controller: 'LogoutController', templateUrl: 'partials/login.html'})
			.otherwise({redirectTo: '/'});
	}
]);