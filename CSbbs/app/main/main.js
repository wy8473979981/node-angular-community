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


			//将所有话题按照最后回复时间（发布时间）降序排序
			$rootScope.topics.sort(function(object1, object2){
				var commentLengthInc1 = object1.comment.length - 1;
				var commentLengthInc2 = object2.comment.length - 1;
				//若话题回复条数不为0
				if(commentLengthInc1 >= 0){
					var date1 = Number(new Date(object1.comment[commentLengthInc1].commentDate));
				}
				//若为0
				else{
					var date1 = Number(new Date(object1.date));
				}
				if(commentLengthInc2 >= 0){
					var date2 = Number(new Date(object2.comment[commentLengthInc2].commentDate));
				}
				//若为0
				else{
					var date2 = Number(new Date(object2.date));
				}
				//要做的是降序排序
				return date1<date2?1:-1;
			});
			console.log($rootScope.topics);


			//从这里到195行是分页处理
			//分页处理
			//每页设置显示话题数为25条
			//currentPages为当前页的数组，第一页第二页第三页...
			$scope.currentPages = [];
			if(($rootScope.topics.length)%25 == 0){
				$scope.pageLength = parseInt(($rootScope.topics.length)/25);
			}
			else{
				$scope.pageLength = parseInt(($rootScope.topics.length)/25) + 1;
			}
			if($scope.pageLength <= 6){
				for(var i = 0; i < $scope.pageLength; i++){
					$scope.currentPages.push(i + 1);
					//console.log($scope.currentPages[i]);
				}
			}
			else{
				for(var i = 0; i < 6; i++){
					if(i != 5){
						$scope.currentPages.push(i + 1);
					}
					else{
						$scope.currentPages.push('...');
					}
				}
			}
			//改变currentPages数组
			$scope.setCurrentPages = function(currentPage){
				if(currentPage == '...' || currentPage == '..'){
				}
				if(currentPage < 5){
					$scope.currentPages.splice(0, 6, 1, 2, 3, 4, 5, '...');
				}
				else if(currentPage > $scope.pageLength - 4){
					$scope.currentPages.splice(0, 6, '..', $scope.pageLength - 4, $scope.pageLength - 3, $scope.pageLength - 2, $scope.pageLength - 1, $scope.pageLength);
				}
				else{
					if($scope.currentPages[$scope.currentPages.indexOf(currentPage) - 1] == '..'){
						if(currentPage == 5){
							$scope.currentPages.splice(0, 6, 1, 2, 3, 4, 5, '...');
						}
						else{
							$scope.currentPages.splice(0, 6, '..', currentPage - 3, currentPage - 2, currentPage - 1, currentPage, '...');
						}
					}
					else if($scope.currentPages[$scope.currentPages.indexOf(currentPage) + 1] == '...'){
						if(currentPage >= $scope.pageLength - 4){
							$scope.currentPages.splice(0, 6, '..', $scope.pageLength - 4, $scope.pageLength - 3, $scope.pageLength - 2, $scope.pageLength - 1, $scope.pageLength);
						}
						else{
							$scope.currentPages.splice(0, 6, '..', currentPage, currentPage + 1, currentPage + 2, currentPage + 3, '...');
						}
					}
				}
			}
			//获取当前页数据
			$scope.getPage = function(currentPage){
				if($scope.pageLength > 6){
					$scope.setCurrentPages(currentPage);
				}
				//console.log($scope.currentPages);
				//console.log('共' + pageLength + '页');
				//console.log('当前为第' + currentPage + '页');
				//若非最后一页
				if(currentPage != $scope.pageLength){
					$scope.currentPageTopics = $rootScope.topics.slice(25 * (currentPage-1), 25 * currentPage);
				}
				//最后一页
				else{
					$scope.currentPageTopics = $rootScope.topics.slice(25 * (currentPage-1));
				}
				console.log($scope.currentPageTopics);
			}
			$scope.getPage(1);


		}
	});
});
