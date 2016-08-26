var app = angular.module('CSbbs', ['ngRoute', 'ngFileUpload']).run(function($rootScope, $http){
	$rootScope.authed = false;
	$rootScope.current_user = "";
	$rootScope.user_image_url = "";
	$rootScope.showImage = false;
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
	});
});

//首页的视图控制器
app.controller('mainCtrl', function($scope, $http, $rootScope){
	if (localStorage['User-Data'] !== undefined){
        $scope.user = JSON.parse(localStorage['User-Data']);
        console.log($scope.user);
        $rootScope.current_user = $scope.user.username;
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
        console.log($scope.user.imageUrl);
    }
	$http.get('/topics').success(function(res){
		if(res.state == 'success'){
			$rootScope.topics = res.topics;
		}
	});
});

app.controller('registerCtrl', function($scope, $http, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
		$location.path('/');
		return ;
	}
	$scope.user = {username: '', password: ''};
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
					$rootScope.user_image_url = res.user.imageUrl;
					$rootScope.showImage = true;
					localStorage.setItem('User-Data', JSON.stringify(res.user));
					$location.path('/');
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
				$rootScope.user_image_url = res.user.imageUrl;
				$rootScope.showImage = true;
				localStorage.setItem('User-Data', JSON.stringify(res.user));
				$location.path('/');
			}
			else if(res.state == "failure"){
				$scope.message = res.message;
			}
		});
	}
	//$scope.loginWithGithub = function(){
		//好奇怪，为什么超链接的get方式与这个get方式不一样呢，而我又不会处理跨域，wtf
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
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
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
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
        console.log($scope.user.imageUrl);
    }

	$scope.canEdit = false;

	//$routeParams.topic是个字符串对象
	//$scope.topic = JSON.parse($routeParams.topic);
	for(var i = 0; i < $rootScope.topics.length; i++){
		if($rootScope.topics[i]._id == $routeParams.topicId){
			$scope.topic = $rootScope.topics[i];

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
    			for(var i = 0 ; i < $scope.topic.comment.length; i++){
			    	$scope.gottenComments[i].showit = false;
			    	if($scope.gottenComments[i].commentAt == '' || $scope.gottenComments[i].commentAt === undefined){
			    		$scope.gottenComments[i].atUser = false;
			    	}
			    	else {
			    		$scope.gottenComments[i].atUser = true;
			    	}
			    }
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
    		for(var i = 0 ; i < $scope.topic.comment.length; i++){
		    	$scope.gottenComments[i].showit = false;
		    	if($scope.gottenComments[i].commentAt == '' || $scope.gottenComments[i].commentAt === undefined){
		    		$scope.gottenComments[i].atUser = false;
		    	}
		    	else {
		    		$scope.gottenComments[i].atUser = true;
		    	}
		    }
    		//$location.path('/showTopic');
    	});
    }
});

//修改用户信息的控制器
app.controller('modifyCtrl', function(Upload, $http, $scope, $rootScope, $location){
	if(localStorage['User-Data'] !== undefined){
        $scope.user = JSON.parse(localStorage['User-Data']);
        console.log($scope.user);
        $rootScope.current_user = $scope.user.username;
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
        console.log($scope.user.imageUrl);
    }
    else {
    	$location.path('/');
    	//alert("请先登录");
    }
    $scope.updatedUser = {username: '', password: ''}
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
        $rootScope.authed = true;
        $rootScope.showImage = true;
        $rootScope.user_image_url = $scope.user.imageUrl;
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
