const crypto = require('crypto')

function timeStamp() {
	return new Date().toUTCString()
}

function completionCode(timeStamp) {
	return crypto.createHash('md5').update(timeStamp).digest('base64');
}

module.exports = { timeStamp, completionCode }