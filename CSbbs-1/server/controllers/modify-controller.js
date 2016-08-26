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
            	user.username = updatedUser.username;
            	user.password = updatedUser.password;
            	Topic.find({'userImage': user.imageUrl}, function(err, topics){
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
            	});
                user.imageUrl = savePath;
                user.save(function(err){
                    if (err){
                        console.log("failed save");
                        res.json({status: 500});
                    } else {
                        res.send({state: 'success', user: {username: user.username, imageUrl: user.imageUrl}});
                    }
                })
            })
        }
    });
}