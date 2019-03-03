const bcrypt = require('bcrypt');
const fs = require('fs');
const {FILEDIR} = require('./dirs');

var salt = bcrypt.genSaltSync(10);

hashAndStore = (password) => {
	try {
		var hash = bcrypt.hashSync(password, salt);
		fs.writeFileSync(`${FILEDIR}/passwordHash.txt`, hash);
		console.log("Password hash successfully written to File.");
	} catch(error) {
		console.log(error)
	}
}

verify = (password) => {
	try {
		var readHash = fs.readFileSync(`${FILEDIR}/passwordHash.txt`, 'utf-8');
		console.log("Password hash read from file successfully.");
		return bcrypt.compareSync(password, readHash.toString());
	} catch(error) {
		console.log(error)
	}
}

module.exports = {hashAndStore, verify}