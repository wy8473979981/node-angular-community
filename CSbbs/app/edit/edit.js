//重新编辑话题视图的控制器
angular.module('CSbbs').controller('editCtrl', function ($scope, $location, $http, $rootScope) {
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