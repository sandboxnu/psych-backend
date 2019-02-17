const bcrypt = require('bcrypt');
const fs = require('fs');
const {FILEDIR} = require('./dirs');

var salt = bcrypt.genSaltSync(10);

hashAndStore = (password) => {
	var hash = bcrypt.hashSync(password, salt);
	fs.writeFile(`${FILEDIR}/passwordHash.txt`, hash, function(err, data){
    	if (err) console.log(err);
    	console.log("Password hash successfully written to File.");
	});
}

verify = (password) => {
	fs.readFile(`${FILEDIR}/passwordHash.txt`, 'utf-8' ,function(err, buf) {
		if (err) console.log(err);
		var readHash = buf.toString();
	});
	return bcrypt.compareSync(password, readHash);
}

module.exports = {hashAndStore, verify}