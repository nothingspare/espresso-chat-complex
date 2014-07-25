'use strict';
Application.controller('LoginController', [
	'$rootScope', 'Storage', '$scope', 'Auth', '$timeout', '$location', 'API',
	function ($rootScope, Storage, $scope, Auth, $timeout, $location, API) {
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
			},
			register: function () {
				console.log('register', $scope.data);
				API.postUser($scope.data).then(function (promise) {
					console.log(promise);
				});
			}
		};
		
		$scope.registrationMode = false;
		$scope.$on('toggleRegister', function () {
			$scope.registrationMode = !$scope.registrationMode;
		});

		$scope.$on('AuthAuthenticate', function (event, data) {
			$scope.data = data;
			$scope.form.submit();
		});
		//redirect if already logged in
	}
]);