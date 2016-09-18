//首页的视图控制器
angular.module('CSbbs').controller('mainCtrl', function($scope, $http, $rootScope){
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
	$http.get('/topics').success(function(res){
		if(res.state == 'success'){
			$rootScope.topics = res.topics;


			/*//时间差
			for(var i = 0; i < $rootScope.topics.length; i++){
				var oldDate = new Date($rootScope.topics[i].date);
				var dValue = Date.now() - oldDate;
				if(dValue < 60000){
					$rootScope.topics[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/259200000) + '个月前';
				}
				else if(dValue > 31104000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}
			}*/


			//无人回复的话题
			$rootScope.noReplyTopics = [];
			for(var i = 0; i < $rootScope.topics.length; i++){
				if($rootScope.topics[i].comment.length == 0){
					$rootScope.noReplyTopics.push($rootScope.topics[i]);
					if($rootScope.noReplyTopics.length > 4){
						break;
					}
				}
			}


			//最后回复者的头像集最后回复的日期
			for(var i = 0; i < $rootScope.topics.length; i++){
				var finalIndex = $rootScope.topics[i].comment.length - 1;
				if(finalIndex >= 0){
					$rootScope.topics[i].finalDate = $rootScope.topics[i].comment[finalIndex].commentDate;
					$rootScope.topics[i].showFinalImg = true;
					$rootScope.topics[i].finalCommenterImg = $rootScope.topics[i].comment[finalIndex].commentUserImage;
				}
				else{
					$rootScope.topics[i].finalDate = $rootScope.topics[i].date;
					$rootScope.topics[i].showFinalImg = false;
					//随便设一个，反正不会显示
					$rootScope.topics[i].finalCommenterImg = '/app/images/coder.png';
				}

				//最后评论的时间差
				var oldDate = new Date($rootScope.topics[i].finalDate);
				var dValue = Date.now() - oldDate;
				if(dValue < 60000){
					$rootScope.topics[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/259200000) + '个月前';
				}
				else if(dValue > 31104000000){
					$rootScope.topics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}
			}


		}
	});
});