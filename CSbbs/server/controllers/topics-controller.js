var Topic = require('../datasets/topics');
var User = require('../datasets/users');
module.exports.postTopic = function(req, res){
	var topic = new Topic();
	topic.user = req.body.user;
	//console.log(req.body.userSign);
	topic.userSign = req.body.userSign;
	console.log(req.body.user);
	User.findOne({'username': req.body.user}, function(err, theUser){
		if(err){}
		if(theUser){
			topic.userImage = theUser.imageUrl;
			topic.block = req.body.block;
			topic.title = req.body.title;
			topic.content = req.body.content;
			topic.date = req.body.date;
			topic.save(function(err, topic){
				if(err){
					console.log("There is an error while saving topic");
					res.redirect('/topics/error');
				}
				else {
					theUser.userPostTopic.push(topic._id);
					theUser.save(function(err, user){
						//console.log(user);
					});
					res.send({state: "success", topic: topic});
				}
			});
			//console.log(theUser);
		}
		else{
			//topic.userImage = './app/images/coder.png';
		}
	});
	//topic.userImage = './app/images/coder.png';
}
module.exports.getTopics = function(req, res){
	Topic.find({}).sort({date: -1}).exec(function(err, topics){
		if(err){
			console.log("There is error while getting topics");
			res.redirect('/topics/error');
		}
		else{
			//console.log(topics);
			res.send({state: 'success', topics: topics});
		}
	});
}

module.exports.edit = function(req, res){
	var topicId = req.body._id;
	Topic.findById(topicId, function(err, topic){
		if(err){
			res.json({status: 500});
		}
		else {
			res.send({state: 'success', topic: topic});
		}
	});
}

module.exports.editFinished = function(req, res){
	var topicId = req.body._id;
	Topic.findById(topicId, function(err, topic){
		topic.title = req.body.title;
		topic.content = req.body.content;
		topic.block = req.body.block;
		//console.log(topic.title);
		//console.log(topic.content);
		//console.log(topic.block);
		topic.save(function(err){
			if(err){
				res.json({status: 500});
			}
			else{
				res.send({state: 'success', topic: topic});
			}
		});
	});
}

module.exports.delete = function(req, res){
	var topicId = req.body._id;
	Topic.remove({_id: topicId}, function(err){
		if(err){
			res.json({status: 500});
		}
		else {
			//在'用户发表的话题'中删除该话题
			User.findOne({username: req.body.user}, function(err, user){
				if(err){
					res.json({status: 500});
				}
				else {
					for(var i = 0; i < user.userPostTopic.length; i++){
						if(user.userPostTopic[i] == topicId){
							user.userPostTopic.splice(i, 1);
						}
					}
					user.save(function(err){
						if(err){
							res.json({status: 500});
						}
						else{
							//console.log(user);
						}
					});
				}
			});

			//在'用户回复的话题'中删除该话题
			User.find({}, function(err, users){
				if(err){
					res.json({status: 500});
				}
				else{
					for(var i = 0; i < users.length; i++){
						for(var j = 0; j < users[i].userReplyTopic.length; j++){
							if(users[i].userReplyTopic[j] == topicId){
								users[i].userReplyTopic.splice(j, 1);
							}
						}
						console.log(users[i].userReplyTopic);
						//错出在这
						//这样写报错
						/*users[i].save(function(err){
							if(err){
								console.log(err);
								//res.json({status: 500});
							}
						});*/
						//这样ok.......why?
						User.findByIdAndUpdate(users[i]._id, {userReplyTopic: users[i].userReplyTopic}, function(err){
							if(err){
								res.json({status: 500});
							}
						});
					}
					res.send({state: 'success'});
				}
			});
		}
	});
}

module.exports.addComment = function(req, res){
	var topicId = req.body.topicId;
	var theUser = req.body.commentUser;
	User.findOne({username: req.body.commentUser}, function(err, user){
		//若该用户之前没评论过这话题，则在userReplyTopic中添加该话题_id
		var newReply = true;
		for(var i = 0; i < user.userReplyTopic.length; i++){
			if(user.userReplyTopic[i] == topicId){
				newReply = false;
			}
		}
		if(newReply){
			user.userReplyTopic.push(topicId);
		}
		//user.userReplyTopic.push(topicId);
		var newComment = {
			commentInner: req.body.commentInner,
			commentUser: req.body.commentUser,
			commentUserImage: user.imageUrl,
			commentDate: req.body.commentDate
		}
		Topic.findById(topicId, function(err, topic){
			if(err){
				res.json({status: 500});
			}
			else {
				topic.comment.push(newComment);
				topic.save(function(err){
					if(err){
						res.json({status: 500});
					}
					else {
						user.save(function(err){
							if(err){
								res.json({status: 500});
							}
						});
						res.send({state: 'success', topic: topic});
					}
				});
			}
		});
	});
}

module.exports.addReply = function(req, res){
	var topicId = req.body.topicId;
	var theUser = req.body.replyUser;
	User.findOne({username: req.body.replyUser}, function(err, user){
		if(err){
			res.json({status: 500});
		}
		else {
			//若该用户之前没评论过这话题，则在userReplyTopic中添加该话题_id
			var newReply = true;
			for(var i = 0; i < user.userReplyTopic.length; i++){
				if(user.userReplyTopic[i] == topicId){
					newReply = false;
				}
			}
			if(newReply){
				user.userReplyTopic.push(topicId);
			}
			//user.userReplyTopic.push(topicId);
			var newReply = {
				commentInner: req.body.replyInner,
				commentUser: req.body.replyUser,
				commentUserImage: user.imageUrl,
				commentAt: req.body.commentUser,
				commentDate: req.body.replyDate
			}
			Topic.findById(topicId, function(err, topic){
				if(err){
					res.json({status: 500});
				}
				else {
					topic.comment.push(newReply);
					topic.save(function(err){
						if(err){
							res.json({status: 500});
						}
						else {
							user.save(function(err){
								if(err){
									res.json({status: 500});
								}
							});
							res.send({state: 'success', topic: topic});
						}
					});
				}
			});
		}
	});
}