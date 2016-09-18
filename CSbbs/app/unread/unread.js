//未读信息页的控制器
angular.module('CSbbs').controller('unreadCtrl', function($http, $scope, $rootScope, $location, $routeParams){
	if (localStorage['User-Data'] !== undefined){
        $scope.user = JSON.parse(localStorage['User-Data']);
        console.log($scope.user);
        $rootScope.current_user = $scope.user.username;
        $rootScope.current_user_sign = $scope.user.sign;
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
        $rootScope.unreadCount = $scope.user.unreadLength;
        $rootScope.showCount = $rootScope.unreadCount > 0? true:false;
        console.log($scope.user.imageUrl);
    }

    if (localStorage['User-Data'] == undefined){
    	$location.path('/');
    	return;
    }


	//$routeParams.username为当前用户名
	var data = {
		username: $routeParams.username
	}
	$http.post('/unread', data).success(function(res){
		if(res.state == 'success'){
			$scope.unreads = res.unread;
			console.log($rootScope.unreadCount);
		}
	});

	//确认某条未读消息后，将该条未读消息放到以往消息中
	$scope.asure = function(unread){
		console.log(unread);
		$http.post('/asureUnread', unread).success(function(res){
			console.log(res);
			$scope.user.unreadLength--;
			localStorage.setItem('User-Data', JSON.stringify($scope.user));
			$rootScope.unreadCount--;
			if($rootScope.unreadCount == 0){
				$rootScope.showCount = false;
			}
		});
	}
});