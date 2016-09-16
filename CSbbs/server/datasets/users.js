var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
	username: String,
	//userEmail: String,
	password: String,
	sign: {type: String, default: '这家伙很懒，什么个性签名也没留下'},
	userPostTopic: [{type: String}],
	userReplyTopic: [{type: String}],
	userCollTopic: [{type: String}],
	unread: [{
		commentUser: String,
		topicId: String,
		topicTitle: String,
		asure: Boolean,
		commentDate: {
			type: Date
		}
	}],
	imageUrl: String,
	signDate: {type: Date, default: Date.now}
});