'use strict';
var Application = angular.module('Application', ['ngRoute']);
Application.run([
	'Auth', '$location', '$rootScope', '$route',
	function (Auth, $location, $rootScope) {
		$rootScope.$on('$locationChangeStart', function (event) {
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
		api: 'http://localhost:8080/KahunaService/rest/el-local/wajbj/v1'
	}
});
