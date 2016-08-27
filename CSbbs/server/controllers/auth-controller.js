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
			var user = new User({
				username: req.body.username;
				password: req.body.password;
				imageUrl: './app/images/coder.png';
			});
			user.save(function(err){
				if(err){
					console.log("There is an error while saving the user");
					res.redirect('/auth/register');
				}
				else{
					res.send({state: "success", user: {username: req.body.username, imageUrl: user.imageUrl}});
				}
			});
		}
	});
}

module.exports.login = function(req, res){
	User.findOne({'username': req.body.username}, function(err, user){
		if(err){
			console.log("There is an error");
			res.redirect('/auth/login');
		}
		if(user){
			req.session.user = user;
			res.send({state: 'success', user: {username: req.body.username, imageUrl: user.imageUrl}});
		}
		else {
			console.log("Wrong username or password");
			res.redirect('/auth/login/userError');
		}
	});
}
