'use strict';
Application.controller('IndexController', [
	'$rootScope', 'Storage', 'API', '$scope',
	function ($rootScope, Storage, API, $scope) {
		$scope.conversation = {};
		$scope.message = {};
		$scope.conversationsList = []; //retrieve from server later
		$scope.activeConversation = false;
		
		//conversation/user interfaces
		$scope.conversations = {
			add: function () {
				var auth = Storage.get('auth');
				var conversation = {
					id: '',
					creator: auth.username,
					open: true,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z'
				};
				
				API.populateMetadata('conversations', $scope.conversation);
				angular.extend($scope.conversation, conversation); 
				API.putConversation($scope.conversation).success(function () {
					$scope.conversations.refresh();
					$scope.conversation.title = '';
				});
			},
			refresh: function () {
				API.getConversations().success(function (data) {
					$scope.conversationsList = data;
				});
			},
			activate: function (conversation) {
				$scope.refreshDialog = function () {
					API.getMessages(conversation.id).success(function (data) {
						$scope.dialogList = data;
						$scope.activeConversation = conversation;
					});
				}
				setInterval(function () {
					$scope.$apply($scope.refreshDialog);
				}, 3000);
				$scope.refreshDialog();
			}
		};
		
		//chat interfaces
		$scope.chat = {
			add: function () {
				var auth = Storage.get('auth');
				var message = {
					id: '',
					conversation_id: $scope.activeConversation.id,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z',
					creator: auth.username
				};
				
				API.populateMetadata('messages', $scope.message);
				angular.extend($scope.message, message); 
				API.putMessage($scope.message).success(function (data) {
					$scope.conversations.activate($scope.activeConversation, true);
					$scope.message.message = '';
				});
			}
		};
		
		//populate conversations
		$scope.conversations.refresh();
	}
]);