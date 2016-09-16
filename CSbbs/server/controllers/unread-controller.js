var Topic = require('../datasets/topics');
var User = require('../datasets/users');
module.exports.unread = function(req, res){
	//req.body.username
	User.findOne({username: req.body.username}, function(err, user){
		if(err){
			res.json({status: 500});
		}
		else {
			res.send({state: 'success', unread: user.unread});
		}
	});
}

//确认未读消息
module.exports.asureUnread = function(req, res){
	console.log(req.body);
	//卧槽，大兄弟，unread是个数组诶，这tm也能查到？
	//给你一颗大红心，我控几不住我记几呀，我要记住你
	//其实也可以通过在app.js中，将传过来的对象加上一个username属性，其值为$rootScope.current_user，然后User.findOne的查询条件改成username，来实现
	User.findOne({'unread._id': req.body._id}, function(err, user){
		if(err){
			res.json({status: 500});
		}
		else{
			for(var i = 0; i < user.unread.length; i++){
				if(user.unread[i]._id == req.body._id){
					user.unread[i].asure = true;
					user.save(function(err){
						if(err){
							res.json({status: 500});
						}
						else{
							res.send({state: 'success', unread: user.unread});
						}
					});
				}
			}
		}
	});
}