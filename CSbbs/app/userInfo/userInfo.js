//展示用户信息的控制器
angular.module('CSbbs').controller('userInfoCtrl', function ($scope, $rootScope, $location, $http, $routeParams){
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
	
	//console.log($routeParams.username);
	var data = {
		username: $routeParams.username
	}
	$http.post('/userInfo', data).success(function(res){
		if(res.state == 'success'){
			console.log(res);
			$scope.theUser = res.user;
			$scope.postTopics = res.postTopics;
			$scope.postCount = $scope.postTopics.length;
			$scope.replyTopics = res.replyTopics;
			$scope.replyCount = $scope.replyTopics.length;
			$scope.collTopics = res.collTopics;
			$scope.collCount = $scope.collTopics.length;

			$scope.showColl = false;

			if($scope.theUser.username == $rootScope.current_user){
				$scope.showColl = true;
			}


			//用户信息页中的时间差
			//发布的话题中的时间差
			for(var i = 0; i < $scope.postTopics.length; i++){
				var finalIndex = $scope.postTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.postTopics[i].oldDate = new Date($scope.postTopics[i].comment[finalIndex].commentDate);
				}
				else{
					$scope.postTopics[i].oldDate = new Date($scope.postTopics[i].date);
				}
				var dValue = Date.now() - $scope.postTopics[i].oldDate;
				if(dValue < 60000){
					$scope.postTopics[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$scope.postTopics[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$scope.postTopics[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$scope.postTopics[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$scope.postTopics[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
				}
				else if(dValue > 31104000000){
					$scope.postTopics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}
			}
			//评论的话题中的时间差
			for(var i = 0; i < $scope.replyTopics.length; i++){
				var finalIndex = $scope.replyTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.replyTopics[i].oldDate = new Date($scope.replyTopics[i].comment[finalIndex].commentDate);
				}
				else{
					$scope.replyTopics[i].oldDate = new Date($scope.replyTopics[i].date);
				}
				var dValue = Date.now() - $scope.replyTopics[i].oldDate;
				if(dValue < 60000){
					$scope.replyTopics[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$scope.replyTopics[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$scope.replyTopics[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$scope.replyTopics[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$scope.replyTopics[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
				}
				else if(dValue > 31104000000){
					$scope.replyTopics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}
			}
			//收藏的话题中的时间差
			for(var i = 0; i < $scope.collTopics.length; i++){
				var finalIndex = $scope.collTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.collTopics[i].oldDate = new Date($scope.collTopics[i].comment[finalIndex].commentDate);
				}
				else{
					$scope.collTopics[i].oldDate = new Date($scope.collTopics[i].date);
				}
				var dValue = Date.now() - $scope.collTopics[i].oldDate;
				if(dValue < 60000){
					$scope.collTopics[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$scope.collTopics[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$scope.collTopics[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$scope.collTopics[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$scope.collTopics[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
				}
				else if(dValue > 31104000000){
					$scope.collTopics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}
			}


			//用户信息页中的最后回复者头像
			//用户发表的话题中最后回复者头像
			for(var i = 0; i < $scope.postTopics.length; i++){
				var finalIndex = $scope.postTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.postTopics[i].showFinalImg = true;
					$scope.postTopics[i].finalCommenterImg = $scope.postTopics[i].comment[finalIndex].commentUserImage;
				}
				else{
					$scope.postTopics[i].showFinalImg = false;
					//随便设一个，反正不会显示
					$scope.postTopics[i].finalCommenterImg = '/app/images/coder.png';
				}
			}
			//用户回复的话题中最后回复者头像
			for(var i = 0; i < $scope.replyTopics.length; i++){
				var finalIndex = $scope.replyTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.replyTopics[i].showFinalImg = true;
					$scope.replyTopics[i].finalCommenterImg = $scope.replyTopics[i].comment[finalIndex].commentUserImage;
				}
				else{
					$scope.replyTopics[i].showFinalImg = false;
					//随便设一个，反正不会显示
					$scope.replyTopics[i].finalCommenterImg = '/app/images/coder.png';
				}
			}
			//用户收藏的话题中最后回复者头像
			for(var i = 0; i < $scope.collTopics.length; i++){
				var finalIndex = $scope.collTopics[i].comment.length - 1;
				if(finalIndex >= 0){
					$scope.collTopics[i].showFinalImg = true;
					$scope.collTopics[i].finalCommenterImg = $scope.collTopics[i].comment[finalIndex].commentUserImage;
				}
				else{
					$scope.collTopics[i].showFinalImg = false;
					//随便设一个，反正不会显示
					$scope.collTopics[i].finalCommenterImg = '/app/images/coder.png';
				}
			}


		}
	});
});