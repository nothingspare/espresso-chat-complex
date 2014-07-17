'use strict';
Application.controller('LoginController', [
	'$rootScope', 'Storage', '$scope', 'Auth', '$timeout', '$location',
	function ($rootScope, Storage, $scope, Auth, $timeout, $location) {
		//init form parameters
		$scope.data = {
			username: '',
			password: ''
		};
		
		//failed login notification
		$scope.alert = '';
		$scope.$watch('alert', function clearAlert(current, previous) {
			if (!current) {return;}
			$timeout(function () { $scope.alert = ''; }, 3000);
		});
		
		//form/user interfaces
		$scope.form = {
			submit: function () {
				Auth.login($scope.data).then(
					$scope.form.success,
					$scope.form.fail
				);
			},
			fail: function () {
				$scope.alert = 'No user with those credentials found, please try again';
			},
			success: function (data) {
				$location.path('/');
			}
		};
		
		//redirect if already logged in
	}
]);