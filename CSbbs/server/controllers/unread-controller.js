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