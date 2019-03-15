const bcrypt = require('bcrypt');
const fse = require('fs-extra');
const { FILEDIR } = require('./dirs');

const salt = bcrypt.genSaltSync(10);

const hashAndStore = (password) => {
  try {
    const hash = bcrypt.hashSync(password, salt);
    fse.writeFileSync(`${FILEDIR}/passwordHash.txt`, hash);
    console.log('Password hash successfully written to File.');
  } catch (error) {
    console.log(error);
  }
};

function verify(password) {
  return fse.readFile(`${FILEDIR}/passwordHash.txt`, 'utf-8')
    .then(hash => bcrypt.compareSync(password, hash.toString()));
}

module.exports = { hashAndStore, verify };
