var mongoose = require('mongoose');
module.exports = mongoose.model('Topic', {
	user: String,
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