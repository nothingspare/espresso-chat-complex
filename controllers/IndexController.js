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
					deletable: true,
					comments: 0,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z'
				};
				
				API.populateMetadata('conversations', $scope.conversation);
				angular.extend($scope.conversation, conversation); 
				API.putConversation($scope.conversation).success($scope.conversations.reset);
			},
			refresh: function () {
				API.getConversations().success(function (data) {
					$scope.conversationsList = data;
				});
			},
			reset: function () {
				$scope.conversations.refresh();
				$scope.conversation.title = '';
			},
			activate: function (conversation) {
				$scope.refreshDialogue = function () {
					API.getMessages(conversation.id).success(function (data) {
						$scope.dialogueList = data;
						$scope.activeConversation = conversation;
					});
				}
				setInterval(function () {
					$scope.$apply($scope.refreshDialogue);
				}, 3000);
				$scope.refreshDialogue();
			},
			toggleStatus: function (conversation) {
				conversation.open = !conversation.open;
				API.postConversation(conversation)
					.success($scope.conversations.reset)
					['error'](function () {
						conversation.open = !conversation.open;
					});
				console.log('toggle status', conversation);
			},
			confirmDelete: function (conversation) {
				var execute = confirm('Are you sure you want to delete ' + conversation.title);
				if (execute) {
					API.deleteConversation(conversation).success($scope.conversations.reset);
				}
			}
		};
		
		$scope.users = {
			getInfo: function ($event, conversation) {
				var $element = angular.element($event.target);
				API.getLikability(conversation.creator).success(function (data) {
					$element.data('powertip', data[0].comment_count + ' <i class="fa fa-comment-o"></i> ' + data[0].likes_count + ' <i class="fa fa-hand-o-left"></i>');
					$element.powerTip({
						placement: 's',
						smartPlacement: true
					});
					$element.powerTip('show');
				});
			}
		};
		
		//chat interfaces
		$scope.chat = {
			add: function (parent_id) {
				if (!parent_id) {
					parent_id = 0;
				}
				var auth = Storage.get('auth');
				var message = {
					parent_id: parent_id,
					conversation_id: $scope.activeConversation.id,
					time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z',
					creator: auth.username,
					likes: 0
				};
				
				API.populateMetadata('messages', $scope.message);
				angular.extend($scope.message, message); 
				API.putMessage($scope.message)
					.success(function (data) {
						$scope.conversations.refresh();
						$scope.conversations.activate($scope.activeConversation, true);
						$scope.message.message = '';
					})
					['error']($scope.chat.fail);
			},
			fail: function (data) {
				console.log('chat failed', data);
				if (data.errorCode === 50052) {
					alert(data.errorMessage);
				}
				else {
					//server error, possibly no message entered
				}
			},
			like: function (dialogue) {
				var auth = Storage.get('auth');
				var like = {
					message_id: dialogue.id,
					username: auth.username,
					liked_user: dialogue.creator
				};
				console.log(like);
				API.postLike(like)
					.success(function (data) {
						$scope.conversations.refresh();
						$scope.conversations.activate($scope.activeConversation, true);
					})
			}
		};
		
		//populate conversations
		$scope.conversations.refresh();
	}
]);