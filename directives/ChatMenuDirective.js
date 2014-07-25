'use strict';
Application.directive('chatMenu', [
	'$rootScope' ,
	function ($rootScope) {
		var ChatMenu = {
			restrict: 'A',
			scope: true,
			controller: ['$scope', function ($scope) {
				$scope.isAuthenticated = false;
				$scope.$on('UserLoggedIn', function () {
					$scope.isAuthenticated = true;
				});
				$scope.$on('UserLoggedOut', function () {
					$scope.isAuthenticated = false;
				});
				$scope.register = function () {
					$rootScope.$broadcast('toggleRegister');
				};
			}]
		};
		return ChatMenu;
}]);