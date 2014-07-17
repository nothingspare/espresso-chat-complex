'use strict';
var Application = angular.module('Application', ['ngRoute']);
Application.run([
	'Auth', '$location', '$rootScope',
	function (Auth, $location, $rootScope) {
		$rootScope.$on('$locationChangeStart', function (event, data) {
			if (Auth.sessionExists()) {
				//we've already logged in, so ...
				
				//redirect if the API key has expired
				Auth.sessionValid();
			}
			else {
				Auth.forceLogin();
			}
		});
	}
]);

Application.constant('Config', {
	base: {
		app: 'http://localhost/mdh/essential',
		api: 'http://localhost:8080/KahunaService/rest/el-local/rwjoj/v1'
	}
});
