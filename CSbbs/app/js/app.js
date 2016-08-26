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
app.controller('showTopicCtrl', function ($scope, $routeParams, $rootScope) {
	//$routeParams.topic是个字符串对象
	//$scope.topic = JSON.parse($routeParams.topic);
	for(var i = 0; i < $rootScope.topics.length; i++){
		if($rootScope.topics[i]._id == $routeParams.topicId){
			$scope.topic = $rootScope.topics[i];
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
    	alert("请先登录");
    }
    $scope.updatedUser = {username: '', password: ''}
    $scope.file = null;

    $scope.update = function(){
    	Upload.upload({
    		url: '/updateImage',
    		method: 'POST',
    		data: {username: $scope.user.username, updatedUser: $scope.updatedUser},
    		file: $scope.file
    	}).success(function(res){
    		localStorage.setItem('User-Data', JSON.stringify(res.user));
			$location.path('/');
    	}).error(function(error){
    		console.log(error);
    	});
    }
});