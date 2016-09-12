var User = require('../datasets/users');
var Topic = require('../datasets/topics');
module.exports.userInfo = function(req, res){
	//console.log(req.body);
	User.findOne({username: req.body.username}, function(err, theUser){
		if(err){
			res.json({status: 500});
		}
		else{
			var postTopics = [];	//该用户发布的话题对象数组
			var replyTopics = [];	//该用户回复的话题对象数组
			var collTopics = [];	//该用户收藏的话题对象数组
			var asyncEnd1 = false;
			var asyncEnd2 = false;
			var asyncEnd3 = false;
			if(theUser.userPostTopic.length > 0){
				for(var i = 0; i < theUser.userPostTopic.length; i++){
					Topic.findById(theUser.userPostTopic[i], function(err, theTopic){
						if(err){
							res.json({status: 500});
						}
						else{
							postTopics.push(theTopic);
							if(postTopics.length == theUser.userPostTopic.length){
								asyncEnd1 = true;
							}
							//能正常打印
							//console.log(postTopics);
						}
					});
				}
			}
			else{
				asyncEnd1 = true;
			}
			//只打印'就问你有没有？'
			//console.log('就问你有没有？' + postTopics);
			if(theUser.userReplyTopic.length > 0){
				for(var i = 0; i < theUser.userReplyTopic.length; i++){
					Topic.findById(theUser.userReplyTopic[i], function(err, theTopic){
						//console.log(i);
						if(err){
							res.json({status: 500});
						}
						else{
							replyTopics.push(theTopic);
							if(replyTopics.length == theUser.userReplyTopic.length){
								asyncEnd2 = true;
							}
						}
					});
				}
			}
			else{
				asyncEnd2 = true;
			}
			if(theUser.userCollTopic.length > 0){
				for(var i = 0; i < theUser.userCollTopic.length; i++){
					Topic.findById(theUser.userCollTopic[i], function(err, theTopic){
						//console.log(i);
						if(err){
							res.json({status: 500});
						}
						else{
							collTopics.push(theTopic);
							if(collTopics.length == theUser.userCollTopic.length){
								asyncEnd3 = true;
							}
						}
					});
				}
			}
			else{
				asyncEnd3 = true;
			}
			//res.send({state: 'success', user: theUser, postTopics: postTopics, replyTopics: replyTopics});
			var interval = setInterval(function(){
				if(asyncEnd1 && asyncEnd2 && asyncEnd3){
					res.send({state: 'success', user: theUser, postTopics: postTopics, replyTopics: replyTopics, collTopics: collTopics});
					clearInterval(interval);
				}
			}, 1000);
		}
	});


	//注释掉的代码都是因为异步机制而导致不可行的方案以及对异步的测试,啊啊啊啊,async drove me mad.


	/*Oh my Lady gaga,为什么这样会打印0,哦，是异步。。。。。。
	a = 0;
	User.findOne({username: req.body.username}, function(err, theUser){
		a++;
		a++;
	});
	console.log(a);*/



	/*User.findOne({username: req.body.username}, function(err, theUser){
		if(err){
			res.json({status: 500});
		}
		else{
			var postTopics = [];	//该用户发布的话题对象数组
			var replyTopics = [];	//该用户回复的话题对象数组
			for(var i = 0; i < theUser.userPostTopic.length; i++){
				//打印0
				console.log(i);
				Topic.findById(theUser.userPostTopic[i], function(err, theTopic){
					//打印1，所以又是异步的锅？
					console.log(i);
					if(err){
						res.json({status: 500});
					}
					else{
						postTopics.push(theTopic);
						//能正常打印
						//console.log(postTopics);
					}
					var lengthInc1 = theUser.userPostTopic.length - 1;
					if(i == lengthInc1){
						console.log('Oh my lady gaga');
						for(var j = 0; j < theUser.userReplyTopic.length; j++){
							Topic.findById(theUser.userReplyTopic[j], function(err, theTopic2){
								console.log(theTopic2);
								if(err){
									res.json({status: 500});
								}
								else{
									replyTopics.push(theTopic2);
									//打印不出来
									//console.log(replyTopics);
								}
								var lengthInc2 = theUser.userReplyTopic.length - 1;
								if(j == lengthInc2){
									console.log(postTopics);
									console.log('下面先换一行');
									console.log(replyTopics);
									res.send({state: 'success', user: theUser, postTopics: postTopics, replyTopics: replyTopics});
								}
							});
						}
					}
				});
			}
			//只打印'就问你有没有？'
			//console.log('就问你有没有？' + postTopics);
		}
	});*/



	/*User.findOne({username: req.body.username}, function(err, theUser){
		if(err){
			res.json({status: 500});
		}
		else{
			var postTopics = [];	//该用户发布的话题对象数组
			var replyTopics = [];	//该用户回复的话题对象数组
			for(var i = 0; i < 4; i++){
				//打印0
				console.log(i);
				Topic.findById(theUser.userPostTopic[0], function(err, theTopic){
					//打印1，所以又是异步的锅？
					console.log(i);
					//最后结果是打印0,1,2,3,4,4,4,4，好嘛，果然是异步。
					/*if(err){
						res.json({status: 500});
					}
					else{
						postTopics.push(theTopic);
						//能正常打印
						//console.log(postTopics);
					}
					var lengthInc1 = theUser.userPostTopic.length - 1;
					if(i == lengthInc1){
						console.log('Oh my lady gaga');
						for(var j = 0; j < theUser.userReplyTopic.length; j++){
							Topic.findById(theUser.userReplyTopic[j], function(err, theTopic2){
								console.log(theTopic2);
								if(err){
									res.json({status: 500});
								}
								else{
									replyTopics.push(theTopic2);
									//打印不出来
									//console.log(replyTopics);
								}
								var lengthInc2 = theUser.userReplyTopic.length - 1;
								if(j == lengthInc2){
									console.log(postTopics);
									console.log('下面先换一行');
									console.log(replyTopics);
									res.send({state: 'success', user: theUser, postTopics: postTopics, replyTopics: replyTopics});
								}
							});
						}
					}*/
				/*});
			}
			//只打印'就问你有没有？'
			//console.log('就问你有没有？' + postTopics);
		}
	});*/



	/*User.findOne({username: req.body.username}, function(err, theUser){
		if(err){
			res.json({status: 500});
		}
		else{
			var postTopics = [];	//该用户发布的话题对象数组
			var replyTopics = [];	//该用户回复的话题对象数组
			for(var ele1 in theUser.userPostTopic){
				console.log(typeof ele1);
				/*Topic.findById(ele1, function(err, theTopic){
					if(err){
						res.json({status: 500});
					}
					else{
						postTopics.push(theTopic);
						//能正常打印
						console.log(postTopics);
					}
					/*if(i == lengthInc1){
						console.log('Oh my lady gaga');
						for(var j = 0; j < theUser.userReplyTopic.length; j++){
							Topic.findById(theUser.userReplyTopic[j], function(err, theTopic2){
								console.log(theTopic2);
								if(err){
									res.json({status: 500});
								}
								else{
									replyTopics.push(theTopic2);
									//打印不出来
									//console.log(replyTopics);
								}
								var lengthInc2 = theUser.userReplyTopic.length - 1;
								if(j == lengthInc2){
									console.log(postTopics);
									console.log('下面先换一行');
									console.log(replyTopics);
									res.send({state: 'success', user: theUser, postTopics: postTopics, replyTopics: replyTopics});
								}
							});
						}
					}*/
				//});
			/*}
			//只打印'就问你有没有？'
			//console.log('就问你有没有？' + postTopics);
		}
	});*/
}