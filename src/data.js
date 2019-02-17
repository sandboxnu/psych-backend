const { Router } = require('express');
const path = require('path');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const unusedFilename = require('unused-filename');
const { DATADIR } = require('./dirs');
const { hashAndStore, verify } = require('./authentication');

var hasAuthenticated = false;
module.exports = (router = new Router()) => {
  router.get('/', (req, res, next) => {
    hasAuthenticated = verify(req.query.password)
    if (hasAuthenticated) {
      next();
    }
    else {
      res.status(401).send('Incorrect password');
    }
  }

  router.get('/', (req, res) => {
    res.status(200).set({
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment; filename=data.zip',
    });
    const zip = archiver('zip');
    zip.pipe(res);
    zip.directory(DATADIR, false);
    zip.finalize();
  });

  router.post('/', (req, res) => {
    const { files: { file } = {} } = req;
    if (!file) {
      return res.status(400).send('Collected data file was not uploaded!');
    }
    if (!file.name) {
      return res.status(400).send('Collected data file missing name');
    }
    // Sanitize filename to ensure it's a valid path (and avoid certain hacks).
    const safeName = sanitize(file.name);
    unusedFilename(path.join(DATADIR, safeName))
      .then((filename) => {
        // Store the file on the server.
        file.mv(filename, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.send('Data saved');
        });
      });
    return false;
  });
  return router;
};
