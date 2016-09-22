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


			//按最后回复时间排序函数
			var sortFunction = function(object1, object2){
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
			}
			//将发表的话题按照最后回复时间（发布时间）降序排序
			$scope.postTopics.sort(sortFunction);
			//将回复的话题按照最后回复时间（发布时间）降序排序
			$scope.replyTopics.sort(sortFunction);
			//将收藏的话题按照最后回复时间（发布时间）降序排序
			$scope.collTopics.sort(sortFunction);


			//分页处理
			//每页设置显示数为20条
			//currentPages为当前页的数组，第一页第二页第三页...
			//currentPages1->post,2->reply,3->coll
			$scope.currentPages1 = [];
			if(($scope.postTopics.length)%5 == 0){
				$scope.pageLength1 = parseInt(($scope.postTopics.length)/5);
			}
			else{
				$scope.pageLength1 = parseInt(($scope.postTopics.length)/5) + 1;
			}
			if($scope.pageLength1 <= 6){
				for(var i = 0; i < $scope.pageLength1; i++){
					$scope.currentPages1.push(i + 1);
					//console.log($scope.currentPages[i]);
				}
			}
			else{
				for(var i = 0; i < 6; i++){
					if(i != 5){
						$scope.currentPages1.push(i + 1);
					}
					else{
						$scope.currentPages1.push('...');
					}
				}
			}
			//改变currentPages数组
			$scope.setCurrentPages = function(currentPage){
				if(currentPage == '...' || currentPage == '..'){
				}
				if(currentPage < 5){
					$scope.currentPages1.splice(0, 6, 1, 2, 3, 4, 5, '...');
				}
				else if(currentPage > $scope.pageLength1 - 4){
					$scope.currentPages1.splice(0, 6, '..', $scope.pageLength1 - 4, $scope.pageLength1 - 3, $scope.pageLength1 - 2, $scope.pageLength1 - 1, $scope.pageLength1);
				}
				else{
					if($scope.currentPages1[$scope.currentPages1.indexOf(currentPage) - 1] == '..'){
						if(currentPage == 5){
							$scope.currentPages1.splice(0, 6, 1, 2, 3, 4, 5, '...');
						}
						else{
							$scope.currentPages1.splice(0, 6, '..', currentPage - 3, currentPage - 2, currentPage - 1, currentPage, '...');
						}
					}
					else if($scope.currentPages1[$scope.currentPages1.indexOf(currentPage) + 1] == '...'){
						if(currentPage >= $scope.pageLength1 - 4){
							$scope.currentPages1.splice(0, 6, '..', $scope.pageLength1 - 4, $scope.pageLength1 - 3, $scope.pageLength1 - 2, $scope.pageLength1 - 1, $scope.pageLength1);
						}
						else{
							$scope.currentPages1.splice(0, 6, '..', currentPage, currentPage + 1, currentPage + 2, currentPage + 3, '...');
						}
					}
				}
			}
			//获取当前页数据
			$scope.getPage = function(currentPage){
				if($scope.pageLength1 > 6){
					$scope.setCurrentPages(currentPage);
				}
				//console.log($scope.currentPages);
				//console.log('共' + pageLength + '页');
				//console.log('当前为第' + currentPage + '页');
				//若非最后一页
				if(currentPage != $scope.pageLength1){
					$scope.currentPostTopics = $scope.postTopics.slice(5 * (currentPage-1), 5 * currentPage);
				}
				//最后一页
				else{
					$scope.currentPostTopics = $scope.postTopics.slice(5 * (currentPage-1));
				}
			}
			$scope.getPage(1);

			//回复的话题
			$scope.currentPages2 = [];
			if(($scope.replyTopics.length)%5 == 0){
				$scope.pageLength2 = parseInt(($scope.replyTopics.length)/5);
			}
			else{
				$scope.pageLength2 = parseInt(($scope.replyTopics.length)/5) + 1;
			}
			if($scope.pageLength2 <= 6){
				for(var i = 0; i < $scope.pageLength2; i++){
					$scope.currentPages2.push(i + 1);
					//console.log($scope.currentPages[i]);
				}
			}
			else{
				for(var i = 0; i < 6; i++){
					if(i != 5){
						$scope.currentPages2.push(i + 1);
					}
					else{
						$scope.currentPages2.push('...');
					}
				}
			}
			//改变currentPages数组
			$scope.setCurrentPages = function(currentPage){
				if(currentPage == '...' || currentPage == '..'){
				}
				if(currentPage < 5){
					$scope.currentPages2.splice(0, 6, 1, 2, 3, 4, 5, '...');
				}
				else if(currentPage > $scope.pageLength2 - 4){
					$scope.currentPages2.splice(0, 6, '..', $scope.pageLength2 - 4, $scope.pageLength2 - 3, $scope.pageLength2 - 2, $scope.pageLength2 - 1, $scope.pageLength2);
				}
				else{
					if($scope.currentPages2[$scope.currentPages2.indexOf(currentPage) - 1] == '..'){
						if(currentPage == 5){
							$scope.currentPages2.splice(0, 6, 1, 2, 3, 4, 5, '...');
						}
						else{
							$scope.currentPages2.splice(0, 6, '..', currentPage - 3, currentPage - 2, currentPage - 1, currentPage, '...');
						}
					}
					else if($scope.currentPages2[$scope.currentPages2.indexOf(currentPage) + 1] == '...'){
						if(currentPage >= $scope.pageLength2 - 4){
							$scope.currentPages2.splice(0, 6, '..', $scope.pageLength2 - 4, $scope.pageLength2 - 3, $scope.pageLength2 - 2, $scope.pageLength2 - 1, $scope.pageLength2);
						}
						else{
							$scope.currentPages2.splice(0, 6, '..', currentPage, currentPage + 1, currentPage + 2, currentPage + 3, '...');
						}
					}
				}
			}
			//获取当前页数据
			$scope.getPage = function(currentPage){
				if($scope.pageLength2 > 6){
					$scope.setCurrentPages(currentPage);
				}
				//console.log($scope.currentPages);
				//console.log('共' + pageLength + '页');
				//console.log('当前为第' + currentPage + '页');
				//若非最后一页
				if(currentPage != $scope.pageLength2){
					$scope.currentReplyTopics = $scope.replyTopics.slice(5 * (currentPage-1), 5 * currentPage);
				}
				//最后一页
				else{
					$scope.currentReplyTopics = $scope.replyTopics.slice(5 * (currentPage-1));
				}
			}
			$scope.getPage(1);


			//收藏的话题
			$scope.currentPages3 = [];
			if(($scope.collTopics.length)%5 == 0){
				$scope.pageLength3 = parseInt(($scope.collTopics.length)/5);
			}
			else{
				$scope.pageLength3 = parseInt(($scope.collTopics.length)/5) + 1;
			}
			if($scope.pageLength3 <= 6){
				for(var i = 0; i < $scope.pageLength3; i++){
					$scope.currentPages3.push(i + 1);
					//console.log($scope.currentPages[i]);
				}
			}
			else{
				for(var i = 0; i < 6; i++){
					if(i != 5){
						$scope.currentPages3.push(i + 1);
					}
					else{
						$scope.currentPages3.push('...');
					}
				}
			}
			//改变currentPages数组
			$scope.setCurrentPages = function(currentPage){
				if(currentPage == '...' || currentPage == '..'){
				}
				if(currentPage < 5){
					$scope.currentPages3.splice(0, 6, 1, 2, 3, 4, 5, '...');
				}
				else if(currentPage > $scope.pageLength3 - 4){
					$scope.currentPages3.splice(0, 6, '..', $scope.pageLength3 - 4, $scope.pageLength3 - 3, $scope.pageLength3 - 2, $scope.pageLength3 - 1, $scope.pageLength3);
				}
				else{
					if($scope.currentPages3[$scope.currentPages3.indexOf(currentPage) - 1] == '..'){
						if(currentPage == 5){
							$scope.currentPages3.splice(0, 6, 1, 2, 3, 4, 5, '...');
						}
						else{
							$scope.currentPages3.splice(0, 6, '..', currentPage - 3, currentPage - 2, currentPage - 1, currentPage, '...');
						}
					}
					else if($scope.currentPages3[$scope.currentPages3.indexOf(currentPage) + 1] == '...'){
						if(currentPage >= $scope.pageLength3 - 4){
							$scope.currentPages3.splice(0, 6, '..', $scope.pageLength3 - 4, $scope.pageLength3 - 3, $scope.pageLength3 - 2, $scope.pageLength3 - 1, $scope.pageLength3);
						}
						else{
							$scope.currentPages3.splice(0, 6, '..', currentPage, currentPage + 1, currentPage + 2, currentPage + 3, '...');
						}
					}
				}
			}
			//获取当前页数据
			$scope.getPage = function(currentPage){
				if($scope.pageLength3 > 6){
					$scope.setCurrentPages(currentPage);
				}
				//console.log($scope.currentPages);
				//console.log('共' + pageLength + '页');
				//console.log('当前为第' + currentPage + '页');
				//若非最后一页
				if(currentPage != $scope.pageLength3){
					$scope.currentCollTopics = $scope.collTopics.slice(5 * (currentPage-1), 5 * currentPage);
				}
				//最后一页
				else{
					$scope.currentCollTopics = $scope.collTopics.slice(5 * (currentPage-1));
				}
			}
			$scope.getPage(1);


		}
	});
});