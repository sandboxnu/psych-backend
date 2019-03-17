const bcrypt = require('bcrypt');
const fse = require('fs-extra');
const path = require('path');
const { FILEDIR } = require('./dirs');

const HASHFILE = path.join(FILEDIR, 'passwordHash.txt');

const salt = bcrypt.genSaltSync(10);

const hashAndStore = (password) => {
  try {
    const hash = bcrypt.hashSync(password, salt);
    fse.writeFileSync(HASHFILE, hash);
  } catch (error) {
    console.log(error);
  }
};

function verify(password) {
	console.log(password);
  return fse.ensureFile(HASHFILE)
    .then(() => fse.readFile(HASHFILE, 'utf-8'))
    .then(hash => bcrypt.compareSync(password, hash.toString()));
}

function authMiddleware(req, res, next) {
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

module.exports = { hashAndStore, verify, authMiddleware };
