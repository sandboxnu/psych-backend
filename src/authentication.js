const bcrypt = require('bcrypt');
const fse = require('fs-extra');
const path = require('path');
const { FILEDIR } = require('./dirs');

const HASHFILE = path.join(FILEDIR, 'passwordHash.txt');

function hashAndStore(password) {
  return bcrypt.hash(password, 10)
    .then(hash => fse.writeFile(HASHFILE, hash));
}

// Return Promise of boolean representing whether user is authorized
// Throws Error if there's no password saved in the hashfile
function verify(password) {
  return fse.pathExists(HASHFILE)
    .then((exists) => {
      if (!exists) {
        // Error out if the hashfile doesn't exist.
        throw new Error('no_password_stored');
      }
      return fse.readFile(HASHFILE, 'utf-8');
    })
    .then((hash) => {
      if (hash === '') {
        // Error out if the hashfile is empty
        throw new Error('no_password_stored');
      }
      if (typeof password === 'undefined') {
        // Return not authenticated if no password given.
        return false;
      }
      return bcrypt.compare(password, hash.toString());
    });
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
    .catch((err) => {
      if (err.message === 'no_password_stored') {
        res.status(401).send('No password stored');
      }
      res.status(500).send();
    });
}

function changePassword(req, res) {
  if (typeof req.query.newPassword === 'undefined') {
    res.status(400).send('Must provide newPassword');
    return;
  }
  verify(req.query.password)
    .catch((err) => {
      // If there is no password stored yet, treat it like they are authenticated!
      if (err.message === 'no_password_stored') {
        return true;
      }
      throw err;
    })
    .then((authenticated) => {
      if (authenticated) {
        return hashAndStore(req.query.newPassword)
          .then(() => res.status(200).send('New password stored'));
      }
      return res.status(401).send('Incorrect password');
    })
    .catch(err => res.status(500).send(err));
}

module.exports = {
  hashAndStore, verify, authMiddleware, changePassword,
};
