var User = require('../datasets/users');
var bCrypt = require('bcrypt-nodejs');

/*var nodemailer = require('nodemailer');

var random = parseInt(Math.random() * 1000000);

var authed = false;

var url = 'http://127.0.0.1:3000/#/mailAuth?code=' + random;*/

module.exports.register = function(req, res){
	/*console.log(req.body);

	var transporter = nodemailer.createTransport({
		host: 'smtp.126.com',
	    port: 25,
	    //secureConnection: true, // use SSL
	    auth: {
	        user: 'zpnaruto@126.com',
	        pass: '...'  		//126的授权码
	    }
	});

	var mailOptions = {
	    from: 'zpnaruto@126.com', // sender address
	    to: req.body.userEmail, // list of receivers
	    subject: 'Hello ✔', // Subject line
	    text: 'Hello ✔', // plaintext body
	    html: '<b>请点击下方链接完成验证</b><p><a href=' + url + '>请点击验证</a></p>' // html body
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});*/

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
			user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			console.log('-----------华丽的侦察机分割线-----------');
			console.log(user.password);
			user.signDate = Date.now();
			user.imageUrl = './app/images/coder.png';
			user.save(function(err){
				if(err){
					console.log("There is an error while saving the user");
					res.redirect('/auth/register');
				}
				else{
					res.send({state: "success", user: {username: req.body.username, imageUrl: user.imageUrl, sign: user.sign, unread: user.unread}});
				}
			});
		}
	});
}

/*module.exports.mailAuth = function(req, res){
	console.log('啦啦啦啦');
	res.send('hahaha');
}*/

module.exports.login = function(req, res){
	User.findOne({'username': req.body.username}, function(err, user){
		if(err){
			console.log("There is an error");
			res.redirect('/auth/login');
		}
		if(user){
			if(bCrypt.compareSync(req.body.password, user.password)){
				req.session.user = user;
				res.send({state: 'success', user: {username: req.body.username, imageUrl: user.imageUrl, sign:user.sign, unread: user.unread}});
			}
			else{
				console.log("Wrong username or password");
				res.redirect('/auth/login/userError');
			}
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