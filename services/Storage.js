Application.service('Storage', [function () {
	var Storage = {
		put: function storagePut(key, data) {
			if (angular.isObject(data)) {
				data = JSON.stringify(data);
			}
			localStorage.setItem(key, data);
		},
		get: function storageGet(key) {
			var data = false;
			data = localStorage.getItem(key);
			try {
				if( angular.isObject(JSON.parse(data))) {
					data = JSON.parse(data);
				}
			} catch (e) {
				//data wasn't JSON, move along
			}
			return data;
		},
		remove: function storageRemove(key) {
			localStorage.removeItem(key);
		}
	};
	return Storage;
}]);