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


/*app.controller('mailAuthCtrl', function($scope, $http, $routeParams, $location) {
	console.log($routeParams.code);
});*/
