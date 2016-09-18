//注册视图的控制器
angular.module('CSbbs').controller('registerCtrl', function($scope, $http, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
		$location.path('/');
		return ;
	}
	$scope.user = {username: '', password: '', userEmail: ''};
	$scope.ensure = "";

	$scope.register = function(){
		$scope.message = "";
		$scope.errorMsg = "";
		if($scope.user.username == ''){
			$scope.errorMsg = "用户名不能为空";
			return ;
		}
		if($scope.user.password == ''){
			$scope.errorMsg = "密码不能为空";
			return ;
		}
		if($scope.user.password == $scope.ensure){
			$http.post('/auth/register', $scope.user).success(function(res){
				if(res.state == "success"){
					$rootScope.authed = true;
					$rootScope.current_user = res.user.username;
					$rootScope.current_user_sign = res.user.sign;
					$rootScope.user_image_url = res.user.imageUrl;
					$rootScope.showImage = true;
					//localStorage.setItem('User-Data', JSON.stringify(res.user));
					//$location.path('/');

					var data = {
						username: $scope.user.username
					}
					$http.post('/unread', data).success(function(res2){
						if(res2.state == 'success'){
							var realCount = 0;
							for(var i = 0; i < res2.unread.length; i++){
								if(!res2.unread[i].asure){
									realCount++;
								}
							}
							$rootScope.unreadCount = realCount;
							res.user.unreadLength = realCount;
							localStorage.setItem('User-Data', JSON.stringify(res.user));
							$location.path('/');
						}
					});
				}
				else if(res.state == "failure"){
					$scope.message = res.message;
				}
			});
		}
		else {
			$scope.errorMsg = "两个密码不一致";
			return ;
		}
	}
});