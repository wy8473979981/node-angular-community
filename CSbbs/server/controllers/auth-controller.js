var User = require('../datasets/users');
module.exports.register = function(req, res){
	User.findOne({'username': req.body.username}, function(err, user){
		if(err){
			console.log("There is an error");
			res.redirect('/auth/register');
		}
		if(user){
			console.log("User has already exists");
			res.redirect('/auth/register/existedUser');
		}
		else {
			var user = new User();
			user.username = req.body.username;
			user.password = req.body.password;
			user.imageUrl = './app/images/coder.png';
			user.save(function(err){
				if(err){
					console.log("There is an error while saving the user");
					res.redirect('/auth/register');
				}
				else{
					res.send({state: "success", user: {username: req.body.username, imageUrl: user.imageUrl, sign: user.sign}});
				}
			});
		}
	});
}

module.exports.login = function(req, res){
	User.findOne({'username': req.body.username, 'password': req.body.password}, function(err, user){
		if(err){
			console.log("There is an error");
			res.redirect('/auth/login');
		}
		if(user){
			req.session.user = user;
			res.send({state: 'success', user: {username: req.body.username, imageUrl: user.imageUrl, sign:user.sign}});
		}
		else {
			console.log("Wrong username or password");
			res.redirect('/auth/login/userError');
		}
	});
	/*果然是异步T_T
	User.find({}, function(err, users){
		for(var i = 0; i < 100000; i++){
			var a = i % 25000;
			if(a == 0){
				console.log(i);
			}
		}
	});
	console.log('我会被插在中间吗?');*/
}