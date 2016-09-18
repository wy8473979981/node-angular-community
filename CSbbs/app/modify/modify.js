//修改用户信息的控制器
angular.module('CSbbs').controller('modifyCtrl', function(Upload, $http, $scope, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
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
    else {
    	$location.path('/');
    	//alert("请先登录");
    }
    $scope.updatedUser = {username: '', password: '', sign: ''}
    $scope.file = null;

    $scope.update = function(){
    	if($scope.updatedUser.username == ''){
    		$scope.message = '用户名不能为空';
    		return ;
    	}
    	if($scope.updatedUser.password == ''){
    		$scope.message = '密码不能为空';
    		return ;
    	}
    	Upload.upload({
    		url: '/updateImage',
    		method: 'POST',
    		data: {username: $scope.user.username, updatedUser: $scope.updatedUser},
    		file: $scope.file
    	}).success(function(res){
    		if(res.state == 'success'){
    			localStorage.setItem('User-Data', JSON.stringify(res.user));
				$location.path('/');
    		}
    		if(res.state == 'failure'){
    			$scope.message = '用户名已存在';
    		}
    	}).error(function(error){
    		console.log(error);
    	});
    }
});