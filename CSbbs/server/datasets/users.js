var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
	username: String,
	password: String,
	sign: {type: String, default: '这家伙很懒，什么个性签名也没留下'},
	userPostTopic: [{type: String}],
	userReplyTopic: [{type: String}],
	imageUrl: String,
	signDate: {type: Date, default: Date.now}
});