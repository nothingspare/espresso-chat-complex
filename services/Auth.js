Application.service('Auth', [
	'Storage', '$location', 'API', '$rootScope', '$q',
	function (Storage, $location, API, $rootScope, $q) {
		var Auth = {
			sessionExists: function authSessionExists() {
				var auth = Storage.get('auth');
				if (auth) {
					return true;
				}
				return false;
			},
			login: function authLogin(credentials) {
				var deferred = $q.defer();
				//send the login info to the '@authenticate' endpoint
				API.authenticate(credentials).success(function (data) {
					console.log(data);
					if (angular.equals(data, {})) {
						deferred.reject('No user with those credentials found, please try again');
					}
					else {
						var auth = data;
						Storage.put('auth', auth);
						deferred.resolve();
					}
				});
				return deferred.promise;
			},
			logout: function authLogout() {
				Storage.remove('auth');
			},
			forceLogin: function authForceLogin() {
				$location.path('/login');
			},
			sessionValid: function () {
				var validKey = API.valid();
				validKey.success(function (data) {
					var auth = Storage.get('auth'); //if the user just logged out, auth has been deleted after the request
					if (auth) {
						$rootScope.$broadcast('UserLoggedIn');
					}
				});
				validKey['error'](function () {
					if ($location.path() === '/login') {return;}
					Auth.forceLogin();
				});
			}
		}
		return Auth;
	}
]);