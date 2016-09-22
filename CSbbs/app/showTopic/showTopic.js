//显示话题详情视图的控制器
angular.module('CSbbs').controller('showTopicCtrl', function ($http, $scope, $routeParams, $rootScope, $location, $route) {
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


    //时间差
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
			$rootScope.topics[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
		}
		else if(dValue > 31104000000){
			$rootScope.topics[i].timeDValue = parseInt(dValue/31104000000) + '年前';
		}
	}


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

	$scope.canEdit = false;

	//$routeParams.topic是个字符串对象
	//$scope.topic = JSON.parse($routeParams.topic);
	for(var i = 0; i < $rootScope.topics.length; i++){
		if($rootScope.topics[i]._id == $routeParams.topicId){
			$scope.topic = $rootScope.topics[i];
			$scope.topic.pv += 1;

			//pv加1
			$http.post('/pvPlus', $scope.topic).success(function(res){});

			//判断当前话题是否是自己发表的
			if(localStorage['User-Data'] !== undefined && $rootScope.topics[i].user == JSON.parse(localStorage['User-Data']).username){
				$scope.canEdit = true;

				//编辑话题
				$scope.edit = function(){
					$http.post('/edit', $scope.topic).success(function(res){
						if(res.state == 'success'){
							//console.log(res.topic);
							localStorage.setItem('Topic-Data', JSON.stringify(res.topic));
							console.log(JSON.parse(localStorage['Topic-Data']));
							$location.path('/edit');
						}
					});
				}

				//删除话题
				$scope.delete = function(){
					if(confirm("确认删除？")) {
						$http.post('/delete', $scope.topic).success(function(res){
							if(res.state == 'success'){
								$location.path('/');
							}
						});
					}
					else {
						console.log("not sure");
					}
				}
			}

			console.log($scope.topic);
		}
	}

	console.log($routeParams.topicId);
	
	var converter = new showdown.Converter();
    converter.setOption("tasklists", true);
    converter.setOption("tables", true);
    converter.setOption("parseImgDimensions", true);
    var html = converter.makeHtml($scope.topic.content);
    document.getElementById("showTopicContent").innerHTML = html;

    //添加回复部分
    $scope.comment = '';
    $scope.commentNotWritten = '';
    $scope.gottenComments = $scope.topic.comment;

    //分页处理
	//每页设置显示数为20条
	//currentPages为当前页的数组，第一页第二页第三页...
	$scope.currentPages = [];
	if(($scope.gottenComments.length)%25 == 0){
		$scope.pageLength = parseInt(($scope.gottenComments.length)/25);
	}
	else{
		$scope.pageLength = parseInt(($scope.gottenComments.length)/25) + 1;
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
			$scope.currentPageComments = $scope.gottenComments.slice(25 * (currentPage-1), 25 * currentPage);
		}
		//最后一页
		else{
			$scope.currentPageComments = $scope.gottenComments.slice(25 * (currentPage-1));
		}
		console.log($scope.currentPageComments);
	}
	$scope.getPage(1);

    for(var i = 0 ; i < $scope.topic.comment.length; i++){
    	$scope.gottenComments[i].showit = false;
    	if($scope.gottenComments[i].commentAt == '' || $scope.gottenComments[i].commentAt === undefined){
    		$scope.gottenComments[i].atUser = false;
    	}
    	else {
    		$scope.gottenComments[i].atUser = true;
    	}


    	//评论中的时间差
    	var oldDate = new Date($scope.gottenComments[i].commentDate);
		var dValue = Date.now() - oldDate;
		if(dValue < 60000){
			$scope.gottenComments[i].timeDValue = '不到1分钟';
		}
		else if(dValue > 60000 && dValue <= 3600000){
			$scope.gottenComments[i].timeDValue = parseInt(dValue/60000) + '分钟前';
		}
		else if(dValue > 3600000 && dValue <= 86400000){
			$scope.gottenComments[i].timeDValue = parseInt(dValue/3600000) + '小时前';
		}
		else if(dValue > 86400000 && dValue <= 2592000000){
			$scope.gottenComments[i].timeDValue = parseInt(dValue/86400000) + '天前';
		}
		else if(dValue > 2592000000 && dValue <= 31104000000){
			$scope.gottenComments[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
		}
		else if(dValue > 31104000000){
			$scope.gottenComments[i].timeDValue = parseInt(dValue/31104000000) + '年前';
		}


		//最后评论的用户
		var finalIndex = $scope.gottenComments.length - 1;
		$scope.finalCommenter = $scope.gottenComments[finalIndex].commentUser;
		$scope.finalCommentDate = $scope.gottenComments[finalIndex].timeDValue;
		

    }
    $scope.commentCounts = $scope.topic.comment.length;

    //让回复支持markdown,还不知道怎么做= =
    /*var commentConverter = new showdown.Converter();
    commentConverter.setOption("tasklists", true);
    commentConverter.setOption("tables", true);
    commentConverter.setOption("parseImgDimensions", true);
    for(var i = 0 ; i < $scope.topic.comment.length; i++){
	    var commentHtml = commentConverter.makeHtml($scope.topic.comment[i].commentInner);
	    //$scope.gottenComments[i].commentInner = commentHtml;
	    var str = '"' + $scope.gottenComments[i].commentInner + '"';
	    console.log(document.getElementById("asd"));
	}*/

	//回复作者(添加评论)
    $scope.replyAuthor = function(){
    	if($scope.comment == ''){
    		$scope.commentNotWritten = '回复内容不能为空';
    		return ;
    	}
    	var data = {
    		topicId: $scope.topic._id,
    		commentInner: $scope.comment,
    		commentUser: $rootScope.current_user,
    		commentDate: Date.now()
    	};
    	$http.post('/addComment', data).success(function(res){
    		if(res.state == 'success'){
    			//console.log(res.topic.comment);
    			$scope.gottenComments = res.topic.comment;
    			$scope.commentCounts = res.topic.comment.length;
    			location.reload(true);
    			/*for(var i = 0 ; i < $scope.topic.comment.length; i++){
			    	$scope.gottenComments[i].showit = false;
			    	if($scope.gottenComments[i].commentAt == '' || $scope.gottenComments[i].commentAt === undefined){
			    		$scope.gottenComments[i].atUser = false;
			    	}
			    	else {
			    		$scope.gottenComments[i].atUser = true;
			    	}


			    	//评论中的时间差
			    	var oldDate = new Date($scope.gottenComments[i].date);
					var dValue = Date.now() - oldDate;
					if(dValue < 60000){
						$scope.gottenComments[i].timeDValue = '不到1分钟';
					}
					else if(dValue > 60000 && dValue <= 3600000){
						$scope.gottenComments[i].timeDValue = parseInt(dValue/60000) + '分钟前';
					}
					else if(dValue > 3600000 && dValue <= 86400000){
						$scope.gottenComments[i].timeDValue = parseInt(dValue/3600000) + '小时前';
					}
					else if(dValue > 86400000 && dValue <= 2592000000){
						$scope.gottenComments[i].timeDValue = parseInt(dValue/86400000) + '天前';
					}
					else if(dValue > 2592000000 && dValue <= 31104000000){
						$scope.gottenComments[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
					}
					else if(dValue > 31104000000){
						$scope.gottenComments[i].timeDValue = parseInt(dValue/31104000000) + '年前';
					}


			    }*/
    			//$location.path('/showTopic');
    		}
    	});
    }

    //回复评论
    $scope.hehe = {
    	reply: ''
    };

    /*$scope.safeApply = function(fn) {
	    var phase = this.$root.$$phase;
	    if (phase == '$apply' || phase == '$digest') {
	        if (fn && (typeof(fn) === 'function')) {
	            fn();
	        }
	    } else {
	        this.$apply(fn);
	    }
	};
	$scope.safeApply($scope.reply);*/

    $scope.replyNotWritten = '';
    $scope.showIt = function(gottenComment){
    	gottenComment.showit = true;
    }
    $scope.replyCommenter = function(gottenComment){
    	if($scope.hehe.reply == ''){
    		$scope.replyNotWritten = '回复内容不能为空';
    		return ;
    	}
    	//console.log(gottenComment);
    	var data = {
    		topicId: $scope.topic._id,
    		commentUser: gottenComment.commentUser,
    		replyUser: $rootScope.current_user,
    		replyInner: $scope.hehe.reply,
    		replyDate: Date.now()
    	}
    	$http.post('/addReply', data).success(function(res){
    		$scope.gottenComments = res.topic.comment;
    		$scope.commentCounts = res.topic.comment.length;
    		location.reload(true);
    		/*for(var i = 0 ; i < $scope.topic.comment.length; i++){
		    	$scope.gottenComments[i].showit = false;
		    	if($scope.gottenComments[i].commentAt == '' || $scope.gottenComments[i].commentAt === undefined){
		    		$scope.gottenComments[i].atUser = false;
		    	}
		    	else {
		    		$scope.gottenComments[i].atUser = true;
		    	}


		    	//评论中的时间差
		    	var oldDate = new Date($scope.gottenComments[i].date);
				var dValue = Date.now() - oldDate;
				if(dValue < 60000){
					$scope.gottenComments[i].timeDValue = '不到1分钟';
				}
				else if(dValue > 60000 && dValue <= 3600000){
					$scope.gottenComments[i].timeDValue = parseInt(dValue/60000) + '分钟前';
				}
				else if(dValue > 3600000 && dValue <= 86400000){
					$scope.gottenComments[i].timeDValue = parseInt(dValue/3600000) + '小时前';
				}
				else if(dValue > 86400000 && dValue <= 2592000000){
					$scope.gottenComments[i].timeDValue = parseInt(dValue/86400000) + '天前';
				}
				else if(dValue > 2592000000 && dValue <= 31104000000){
					$scope.gottenComments[i].timeDValue = parseInt(dValue/2592000000) + '个月前';
				}
				else if(dValue > 31104000000){
					$scope.gottenComments[i].timeDValue = parseInt(dValue/31104000000) + '年前';
				}


		    }*/
    		//$location.path('/showTopic');
    	});
    }


    //收藏话题
    $scope.collect = function(){
    	var data = {
    		theUser: $rootScope.current_user,
    		topicId: $scope.topic._id
    	}
    	$http.post('/collectTopic', data).success(function(res){
    		if(res.state == 'success'){
    			alert('收藏成功');
    		}
    		if(res.state == 'failure'){
    			alert('您已收藏过该话题');
    		}
    	});
    }
});