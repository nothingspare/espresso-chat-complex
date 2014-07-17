Application.service('Auth', [
	'Storage', '$location', 'API',
	function (Storage, $location, API) {
		var Auth = {
			sessionExists: function authSessionExists() {
				var auth = Storage.get('auth');
				if (auth) {
					return true;
				}
				return false;
			},
			login: function authLogin(credentials) {
				//send the login info to the '@authenticate' endpoint
				return API.authenticate(credentials).success(function (data) {
					var auth = {
						username: credentials.username,
						key: data.apikey
					};
					Storage.put('auth', auth);
				});
			},
			logout: function authLogout() {
				Storage.remove('auth');
			},
			forceLogin: function authForceLogin() {
				$location.path('/login');
			},
			sessionValid: function () {
				API.valid()['error'](function () {
					if ($location.path() === '/login') {return;}
					Auth.forceLogin();
				});
			}
		}
		return Auth;
	}
]);