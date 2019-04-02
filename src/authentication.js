const bcrypt = require('bcrypt');
const fse = require('fs-extra');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { FILEDIR } = require('./dirs');

const HASHFILE = path.join(FILEDIR, 'passwordHash.txt');

function hashAndStore(password) {
  return bcrypt.hash(password, 10)
    .then(hash => fse.writeFile(HASHFILE, hash));
}

// Return a Promise of hash value, returning an empty string if no hash
function getHash() {
  return fse.pathExists(HASHFILE)
    .then(isFile => (isFile ? fse.readFile(HASHFILE, 'utf-8') : ''));
}

function hashExists() {
  return getHash().then(hash => hash !== '');
}

// Return Promise of boolean representing whether user is authorized
function verify(password) {
  return getHash()
    .then((hash) => {
      if (typeof password === 'undefined' || hash === '') {
        // Return not authenticated if no password given or no hash stored
        return false;
      }
      return bcrypt.compare(password, hash.toString());
    });
}

function authorizer(username, password, cb) {
  verify(password)
    .then(authenticated => cb(null, authenticated))
    .catch(err => cb(err));
}

// Using the basic auth library to check the auth header and open up a password popup if no password
const authMiddleware = basicAuth({
  authorizer,
  authorizeAsync: true,
  challenge: true,
  realm: 'sandboxneu',
});

const changePassword = [
  (req, res, next) => {
    // If a hash exists, validate their old password, else let them make the first password
    hashExists().then((exists) => {
      if (exists) {
        authMiddleware(req, res, next);
      } else {
        next();
      }
    });
  },
  (req, res) => {
    if (!req.body || typeof req.body.newPassword === 'undefined') {
      res.status(400).send('Must provide newPassword');
    } else {
      hashAndStore(req.body.newPassword)
        .then(() => res.status(200).send('New password stored'));
    }
  },
];

module.exports = {
  hashAndStore, verify, authMiddleware, changePassword,
};
