var mongoose = require('mongoose');
module.exports = mongoose.model('Topic', {
	user: String,
	userImage: String,
	block: String,
	title: String,
	content: String,
	date: {type: Date, default: Date.now}
});