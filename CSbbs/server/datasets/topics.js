var mongoose = require('mongoose');
module.exports = mongoose.model('Topic', {
	user: String,
	userSign: {type: String, default: '这家伙很懒，什么个性签名也没留下'},
	userImage: String,
	block: String,
	title: String,
	content: String,
	comment: [{
		commentInner: String,
		commentUser: String,
		commentUserImage: String,
		commentAt: String,
		commentDate: {
			type: Date,
			default: Date.now
		}
	}],
	date: {type: Date, default: Date.now}
});