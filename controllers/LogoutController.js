'use strict';
Application.controller('LogoutController', [
	'$rootScope', 'Auth',
	function ($rootScope, Auth) {
		Auth.logout();
		Auth.forceLogin();
		$rootScope.$broadcast('UserLoggedOut');
	}
]);