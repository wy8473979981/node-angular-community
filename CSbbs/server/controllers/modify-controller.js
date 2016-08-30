var User = require('../datasets/users');
var Topic = require('../datasets/topics');
var fs = require('fs-extra');
var path = require('path');
module.exports.modifyImage = function(req, res){
	var file = req.files.file;
	var username = req.body.username;
	var updatedUser = req.body.updatedUser;
	
	var uploadDate = new Date();
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + username + file.name);
    var savePath = "./uploads/" + username + file.name;

    fs.rename(tempPath, targetPath, function (err){
        if (err){
            console.log(err);
        } else {
            User.findOne({'username': username}, function(err, user){
            	if(user.username != updatedUser.username){
            		User.findOne({'username': updatedUser.username}, function(err, user){
            			if(err){
            				res.json({status: 500});
            			}
            			if(user){
            				res.send({state: 'failure', message: '用户名已存在'});
            			}
            		});
            	}
            	/*user.username = updatedUser.username;
            	user.password = updatedUser.password;
            	if(updatedUser.sign == ''){
            		user.sign = '这家伙很懒，什么个性签名也没留下'
            	}
            	else {
            		user.sign = updatedUser.sign;
            	}*/
            	/*Topic.find({'user': username}, function(err, topics){
            		//这句能打印出来
            		//console.log("hello worldT_T");
            		if(err){
            			console.log("failed save");
                        res.json({status: 500});
                    }
            		else {
            			//console.log(topics);
            			for(var i = 0; i < topics.length; i++){
            				topics[i].userImage = savePath;
            				
            				//这句无法打印出来
            				//console.log("Hello worldT_T");
            				topics[i].save(function(err){
            					if(err){
            						console.log("failed save");
                        			res.json({status: 500});
            					}
            				});
            			}
            		}
            	});*/
            	Topic.find({}, function(err, topics){
            		if(err){
            			res.json({status: 500});
            		}
            		else{
            			for(var i = 0; i < topics.length; i++){
            				//修改用户信息后，找到该用户发表的话题，修改话题中的用户信息。
            				if(topics[i].user == user.username){
            					//这句能打印出来
            					//console.log(topics[i]);
            					//console.log('第一个标记，我好烦呀呀呀呀呀');
            					topics[i].user = updatedUser.username;
            					topics[i].userImage = savePath;
            					if(updatedUser.sign == ''){
				            		topics[i].userSign = '这家伙很懒，什么个性签名也没留下';
				            	}
				            	else {
				            		topics[i].userSign = updatedUser.sign;
				            	}
				            	topics[i].save(function(err, theTopic){
				            		if(err){
				            			//console.log(theTopic);
				            			res.json({status: 500});
				            		}
				            		//console.log('1' + theTopic);
				            		//这句打印undefined
				            		//console.log(topics[i]);
				            		//这句正常
				            		//console.log(theTopic);
				            	});
            				}

            				//console.log('what the fuck!');
            				//please 时刻牢记，comment是个对象数组T_T
            				
            				for(var j = 0; j < topics[i].comment.length; j++){
            					console.log('what the fuck:' + user.username);
            					//找到该用户评论的话题，修改评论中的用户信息
            					if(topics[i].comment[j].commentUser == user.username){
            						//console.log('第二个标记，我依然好烦呀呀呀呀呀');
	            					topics[i].comment[j].commentUser = updatedUser.username;
	            					topics[i].comment[j].commentUserImage = savePath;
	            					topics[i].save(function(err, theTopic){
	            						if(err){
	            							res.json({status: 500});
	            						}
	            						//console.log('2' + theTopic);
	            					});
	            				}

	            				//找到该用户被@的评论，修改被@的用户名
	            				if(topics[i].comment[j].commentAt == user.username){
	            					//console.log('我tm的还是好烦啊啊啊啊啊');
	            					topics[i].comment[j].commentAt = updatedUser.username;
	            					topics[i].save(function(err, theTopic){
	            						if(err){
	            							res.json({status: 500});
	            						}
	            						//console.log('3' + theTopic);
	            					});
	            				}
            				}

            				//找到该用户评论的话题，修改评论中的用户信息
            				/*啊，果然写错了，comment是个对象数组
            				if(topics[i].comment.commentUser == user.username){
            					console.log(topics[i]);
            					topics[i].comment.commentUser = updatedUser.username;
            					topics[i].comment.commentUserImage = savePath;
            					topics[i].save(function(err,theTopic){
            						if(err){
            							res.json({status: 500});
            						}
            						//console.log(theTopic);
            					});
            				}*/

            				//找到该用户被@的评论，修改被@的用户名
            				/*同上= =写错了
            				if(topics[i].comment.commentAt == user.username){
            					topics[i].comment.commentAt = updatedUser.username;
            					topics[i].save(function(err){
            						if(err){
            							res.json({status: 500});
            						}
            					});
            				}*/
            			}
            			user.username = updatedUser.username;
		            	user.password = updatedUser.password;
		            	if(updatedUser.sign == ''){
		            		user.sign = '这家伙很懒，什么个性签名也没留下'
		            	}
		            	else {
		            		user.sign = updatedUser.sign;
		            	}
		                user.imageUrl = savePath;
		                user.save(function(err){
		                    if (err){
		                        console.log("failed save");
		                        res.json({status: 500});
		                    } else {
		                        res.send({state: 'success', user: {username: user.username, imageUrl: user.imageUrl, sign: user.sign}});
		                    }
		                });
            		}
            	});
            	/*因为异步的关系，Topic.find({}, function(err, topics){})里面的function是异步执行的，这段代码不能写在这个位置，啊啊啊啊啊，调了好久才发现这个问题
            	user.username = updatedUser.username;
            	user.password = updatedUser.password;
            	if(updatedUser.sign == ''){
            		user.sign = '这家伙很懒，什么个性签名也没留下'
            	}
            	else {
            		user.sign = updatedUser.sign;
            	}
                user.imageUrl = savePath;
                user.save(function(err){
                    if (err){
                        console.log("failed save");
                        res.json({status: 500});
                    } else {
                        res.send({state: 'success', user: {username: user.username, imageUrl: user.imageUrl, sign: user.sign}});
                    }
                });*/
            });
        }
    });
}