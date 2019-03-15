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

function verifyMiddleware(req, res, next) {
  verify(req.query.password)
    .then((authenticated) => {
      if (authenticated) {
        next();
      } else {
        res.status(401).send('Incorrect password');
      }
    })
    .catch(() => {
      res.status(500).send('No password set');
    });
}

module.exports = { hashAndStore, verify, verifyMiddleware };
