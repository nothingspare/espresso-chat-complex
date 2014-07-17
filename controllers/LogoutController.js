'use strict';
Application.controller('LogoutController', [
	'$location', 'Auth',
	function ($location, Auth) {
		Auth.logout();
		Auth.forceLogin();
	}
]);