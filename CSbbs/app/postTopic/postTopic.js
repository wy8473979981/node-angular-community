//发布话题视图的控制器
angular.module('CSbbs').controller('postTopicCtrl', function($scope, $http, $rootScope, $location){
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