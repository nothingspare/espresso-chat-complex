'use strict';
var Application = angular.module('Application', ['ngRoute']);
Application.run([
	'Auth', '$location', '$rootScope',
	function (Auth, $location, $rootScope) {
		$rootScope.$on('$locationChangeStart', function (event, data) {
			if (Auth.sessionExists()) {
				//we've already logged in, so ...
				
				//redirect if the API key has expired
				var log = Auth.sessionValid();
			}
			else {
				Auth.forceLogin();
				$rootScope.$broadcast('UserLoggedOut');
			}
		});
	}
]);

Application.constant('Config', {
	base: {
		app: 'http://localhost/mdh/espresso-chat-complex',
		api: 'http://localhost:8080/KahunaService/rest/el-local/cwskj/v1'
	}
});
