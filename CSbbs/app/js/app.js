var app = angular.module('CSbbs', ['ngRoute', 'ngFileUpload']).run(function($rootScope, $http){
	$rootScope.authed = false;
	$rootScope.current_user = "";
	$rootScope.current_user_sign = "这家伙很懒，什么个性签名也没留下";
	$rootScope.user_image_url = "";
	$rootScope.showImage = false;
	$rootScope.unreadCount = 0;
	$rootScope.showCount = false;
	$rootScope.logout = function(){
		localStorage.clear();
		$rootScope.authed = false;
		$rootScope.current_user = "";
		$rootScope.user_image_url = "";
		$rootScope.showImage = false;
	}
	$http.get('/topics').success(function(res){
		if(res.state == 'success'){
			$rootScope.topics = res.topics;
		}
	});
	//setTimeout($rootScope.logout(), 5000);
});

app.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'app/main/main.html',
		controller: 'mainCtrl'
	}).when('/register', {
		templateUrl: 'app/register/register.html',
		controller: 'registerCtrl'
	}).when('/login', {
		templateUrl: 'app/login/login.html',
		controller: 'loginCtrl'
	}).when('/postTopic', {
		templateUrl: 'app/postTopic/postTopic.html',
		controller: 'postTopicCtrl'
	}).when('/showTopic', {
		templateUrl: 'app/showTopic/showTopic.html',
		controller: 'showTopicCtrl'
	}).when('/modify', {
		templateUrl: 'app/modify/modify.html',
		controller: 'modifyCtrl'
	}).when('/edit', {
		templateUrl: 'app/edit/edit.html',
		controller: 'editCtrl'
	}).when('/userInfo', {
		templateUrl: 'app/userInfo/userInfo.html',
		controller: 'userInfoCtrl'
	}).when('/unread', {
		templateUrl: 'app/unread/unread.html',
		controller: 'unreadCtrl'
	});
});

//首页的视图控制器
app.controller('mainCtrl', function($scope, $http, $rootScope){
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

app.controller('registerCtrl', function($scope, $http, $rootScope, $location){
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

app.controller('loginCtrl', function($scope, $http, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
		$location.path('/');
		return ;
	}
	$scope.user = {username: '', password: ''};

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(res){
			if(res.state == "success"){
				$rootScope.authed = true;
				$rootScope.current_user = res.user.username;
				$rootScope.current_user_sign = res.user.sign;
				$rootScope.user_image_url = res.user.imageUrl;
				$rootScope.showImage = true;
				//localStorage.setItem('User-Data', JSON.stringify(res.user));
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
	//$scope.loginWithGithub = function(){
		//好奇怪，为什么超链接的get方式与这个get方式不一样呢
		/*$http.get('/auth/github').success(function(res){
			console.log(res);
		});*/
		/*$http.get('/githubUserData').success(function(res){
			if(res.state == 'success' && res.userData){
				console.log(res);
				$rootScope.authed = true;
				$rootScope.current_user = res.userData.username;
				$rootScope.user_image_url = res.userData._json.avatar_url;
				$rootScope.showImage = true;
				if($rootScope.user_image_url == ""){
					$rootScope.user_image_url = "./app/images/coder.png";
				}
				else {
					//$rootScope.showImage = true;
				}
				$location.path('/');
			}
		});
	}*/
});

//发布话题视图的控制器
app.controller('postTopicCtrl', function($scope, $http, $rootScope, $location){
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
	$scope.blocks = ['分享','问答','新闻','招聘'];
	$scope.title = "";
	$scope.content = "";

	$scope.postTopic = function(){
		var myselect = document.getElementById("theTopics");
		var index = myselect.selectedIndex;
		$scope.choosedBlock = myselect.options[index].value;
  		console.log($scope.choosedBlock);
  		if(!$rootScope.authed){
  			alert('请先登录');
  			return;
  		}
  		else{
  			$scope.titleNotWriten = "";
  			$scope.contentNotWriten = "";
  			if($scope.title == ""){
  				$scope.titleNotWriten = "标题不能为空";
  				return ;
  			}
  			if($scope.content == ""){
  				$scope.contentNotWriten = "内容不能为空";
  				return ;
  			}
  			var data = {
	  			user: $rootScope.current_user,
	  			userSign: $rootScope.current_user_sign,
	  			block: $scope.choosedBlock,
	  			title: $scope.title,
	  			content: $scope.content,
	  			date: Date.now()
	  		}
	  		$http.post('/topics', data).success(function(res){
	  			if(res.state == 'success'){
	  				$location.path('/');
	  			}
	  		});
  		}
	}
});

//显示话题详情视图的控制器
app.controller('showTopicCtrl', function ($http, $scope, $routeParams, $rootScope, $location, $route) {
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

//修改用户信息的控制器
app.controller('modifyCtrl', function(Upload, $http, $scope, $rootScope, $location){
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

//重新编辑话题的控制器
app.controller('editCtrl', function ($scope, $location, $http, $rootScope) {
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
    /*else{
    	//$location.path('/');
    	return ;
    }*/

    $scope.blocks = ['分享','问答','新闻','招聘'];

	if (localStorage['Topic-Data'] !== undefined){
		$scope.title = JSON.parse(localStorage['Topic-Data']).title;
		$scope.content = JSON.parse(localStorage['Topic-Data']).content;
	}
	else {
		$scope.title = "";
		$scope.content = "";
	}

	$scope.postTopic = function(){
		var myselect = document.getElementById("theTopics");
		var index = myselect.selectedIndex;
		$scope.choosedBlock = myselect.options[index].value;
  		console.log($scope.choosedBlock);
  		if(!$rootScope.authed){
  			alert('请先登录');
  			return;
  		}
  		else{
  			$scope.titleNotWriten = "";
  			$scope.contentNotWriten = "";
  			if($scope.title == ""){
  				$scope.titleNotWriten = "标题不能为空";
  				return ;
  			}
  			if($scope.content == ""){
  				$scope.contentNotWriten = "内容不能为空";
  				return ;
  			}
  			var topicData = {
  				block: $scope.choosedBlock,
  				content: $scope.content,
  				title: $scope.title,
  				_id: JSON.parse(localStorage['Topic-Data'])._id
  			};
	  		$http.post('/editFinished', topicData).success(function(res){
	  			if(res.state == 'success'){
	  				localStorage.setItem('Topic-Data', JSON.stringify(res.topic));
	  				$location.path('/');
	  			}
	  		});
  		}
	}
});

//展示用户信息的控制器
app.controller('userInfoCtrl', function ($scope, $rootScope, $location, $http, $routeParams){
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

//未读信息页的控制器
app.controller('unreadCtrl', function($http, $scope, $rootScope, $location, $routeParams){
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

/*app.controller('mailAuthCtrl', function($scope, $http, $routeParams, $location) {
	console.log($routeParams.code);
});*/