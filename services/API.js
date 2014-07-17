Application.service('API', [
	'Config', '$http', 'Storage',
	function (Config, $http, Storage) {
		//endpoints wrapper
		var API = {
			authenticate: function endpointAuthentication(credentials) {
				return $http.post(
					Config.base.api + '/@authentication',
					credentials
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
			authHeaders: function apiAuthHeaders(obj) {
				var auth = Storage.get('auth');
				return {'Authorization': 'Espresso ' + auth.key + ':1'};
			},
			populateMetadata: function populateMetadata(entity, object) {
				object['@metadata'] = {
					action: 'INSERT',
					entity: entity,
					links: []
				};
				return object;
			}
		};
		return API;
	}
]);