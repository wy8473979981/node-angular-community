var Topic = require('../datasets/topics');
var User = require('../datasets/users');
module.exports.postTopic = function(req, res){
	var topic = new Topic();
	topic.user = req.body.user;
	console.log(req.body.user);
	User.findOne({'username': req.body.user}, function(err, theUser){
		if(err){}
		if(theUser){
			topic.userImage = theUser.imageUrl;
			topic.block = req.body.block;
			topic.title = req.body.title;
			topic.content = req.body.content;
			topic.date = req.body.date;
			topic.save(function(err){
				if(err){
					console.log("There is an error while saving topic");
					res.redirect('/topics/error');
				}
				else {
					res.send({state: "success", topic: topic});
				}
			});
			console.log(theUser);
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