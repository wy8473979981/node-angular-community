var User = require('../datasets/users');
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
            	user.username = updatedUser.username;
            	user.password = updatedUser.password;
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