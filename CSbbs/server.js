var express = require('express')
    , http = require('http')
    , path = require('path')
    , app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//var passport = require('passport')
//    , GithubStrategy = require('passport-github').Strategy;
var User = require('./server/datasets/users.js');
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
//app.set('view engine', 'html');
app.use(multipartMiddleware);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser())
app.use(express.session({secret: 'blog.fens.me'}));
/*app.use(passport.initialize());
app.use(passport.session());*/
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var mongoose = require('mongoose');
//var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var authController = require('./server/controllers/auth-controller.js');
var topicsController = require('./server/controllers/topics-controller.js');
var modifyController = require('./server/controllers/modify-controller.js');
var userInfoController = require('./server/controllers/userInfo-controller.js');

mongoose.connect('mongodb://localhost:27017/CSbbs');

//app.use(bodyParser.json());
//app.use(multipartMiddleware);
app.use('/app', express.static(__dirname + "/app" ));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(__dirname + "/uploads"));

/*passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GithubStrategy({//对应从Github申请KEY
    clientID: "31b30c9ea88aaa926ac6",
    clientSecret: "052b8d554e735f1a0fbe6b1621849c91b16385e4",
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},function(accessToken, refreshToken, profile, done) {
    done(null, profile);
}));*/

app.get('/', function(req, res){
	res.sendfile('index.html');
});

/*app.all('/github', isLoggedIn);
app.get("/github",function(req, res){
	global.githubUser = req.user;
	var theUser = new User();
	User.findOne({'username': req.user.username}, function(err, user){
		if(err){
			console.log("There is an error");
		}
		else if(user){
			return;
		}
		else{
			theUser.username = req.user.username;
			theUser.imageUrl = req.user._json.avatar_url;
			theUser.save(function(err){
				if(err){
					console.log("服务器出错");
				}
			});
		}
	});
});
app.get('/githubUserData', function(req, res){
	res.send({state: 'success', userData: global.githubUser});
});

app.get("/auth/github", passport.authenticate("github",{ scope : "email"}));
app.get("/auth/github/callback",passport.authenticate("github",{
    successRedirect: '/github',
    failureRedirect: '/'
}));*/

app.get('/auth/register', function(req, res){
	res.send({state: 'failure', user: null, message: '服务器出错'});
});
app.get('/auth/register/existedUser', function(req, res){
	res.send({state: 'failure', user: null, message: '用户名已存在'});
});
app.post('/auth/register', authController.register);

//app.get('/mailAuth', authController.mailAuth);

app.get('/auth/login', function(req, res){
	res.send({state: 'failure', user: null, message: '服务器出错'});
});
app.get('/auth/login/userError', function(req, res){
	res.send({state: 'failure', user: null, message: '用户名或密码错误'});
});
app.post('/auth/login', authController.login);

app.get('/topics/error', function(req, res){
	res.send({state: 'failure', topic: null, message: '服务器出错'});
});
//获取已有的话题
app.get('/topics', topicsController.getTopics);
//发布话题
app.post('/topics', topicsController.postTopic);

app.post('/pvPlus', topicsController.pvPlus);

app.post('/updateImage', multipartMiddleware, modifyController.modifyImage);

//编辑话题
app.post('/edit', topicsController.edit);

app.post('/editFinished', topicsController.editFinished);

//删除话题
app.post('/delete', topicsController.delete);

//添加回复
app.post('/addComment', topicsController.addComment);

//添加对评论的回复
app.post('/addReply', topicsController.addReply);

//收藏话题
app.post('/collectTopic', topicsController.collectTopic);

//查看用户信息页
app.post('/userInfo', userInfoController.userInfo);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

/*function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}*/