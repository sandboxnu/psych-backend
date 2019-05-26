const { Router } = require('express');
const path = require('path');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const unusedFilename = require('unused-filename');
const { DATADIR } = require('./dirs');
const { authMiddleware } = require('./authentication');
const fs = require('fs');

module.exports = (router = new Router()) => {
  router.get('/', authMiddleware);
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
    const jsonDataFile = 'reqJson.txt'
    const jsonData = req.body

    if (Object.keys(jsonData).length === 0) {
      return res.status(400).send('Malformed or bad data');
    }
    // Sanitize filename to ensure it's a valid path (and avoid certain hacks).
    const safeName = sanitize(jsonDataFile);
    unusedFilename(path.join(DATADIR, safeName))
      .then((filename) => {
        fs.writeFile(filename, JSON.stringify(jsonData), (err) => {
          if (err) {
            console.error(err)
            return res.status(500).send(err);
          }
          return res.send('Data saved');
        });
      });
    return false;
  });
  return router;
};
