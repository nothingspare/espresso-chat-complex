Application.service('API', [
	'Config', '$http', 'Storage',
	function (Config, $http, Storage) {
		//endpoints wrapper
		var API = {
			authenticate: function endpointAuthentication(credentials) {
				return $http.get(
					Config.base.api + '/auth?arg_username=' + credentials.username + '&arg_password=' + credentials.password,
					{headers: API.authHeaders()}
				);
			},
			valid: function endpointApp() {
				return $http.get(
					Config.base.api + '/conversations',
					{headers: API.authHeaders()}
				);
			},
			getMessages: function endpointGetMessages(id) {
				return $http.get(
					Config.base.api + '/messages?filter=conversation_id%3D' + id,
					{headers: API.authHeaders()}
				);
			},
			putMessage: function endpointPutMessage(message) {
				return $http.put(
					Config.base.api + '/messages',
					message,
					{headers: API.authHeaders()}
				);
			},
			getConversations: function endpointGetConversations() {
				return $http.get(
					Config.base.api + '/conversations',
					{headers: API.authHeaders()}
				);
			},
			putConversation: function endpointPutConversation(conversation) {
				return $http.put(
					Config.base.api + '/conversations',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			postConversation: function endpointPostConversation(conversation) {
				return $http.put(
					Config.base.api + '/conversations',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			deleteConversation: function endpointPostConversation(conversation) {
				var auth = Storage.get('auth');
				conversation['@metadata'].action = 'DELETE';
				return $http.put(
					Config.base.api + '/conversations',
					conversation,
					{headers: API.authHeaders()}
				);
			},
			authHeaders: function apiAuthHeaders(obj) {
				var auth = Storage.get('auth');
				var key;
				if (angular.equals(auth, null)) {
					key = Config.registrationKey;
				}
				else {
					key = auth.apikey;
				}
				return {'Authorization': 'Espresso ' + key + ':1'};
			},
			populateMetadata: function populateMetadata(entity, object) {
				object['@metadata'] = {
					action: 'INSERT',
					entity: entity,
					links: []
				};
				return object;
			},
			getUser: function endpointGetUser(user) {
				return $http.get(
					Config.base.api + '/users?filter=username%3D"' + user + '"',
					{headers: API.authHeaders()}
				);
			}
		};
		return API;
	}
]);