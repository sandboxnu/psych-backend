const { Router } = require('express');
const path = require('path');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const unusedFilename = require('unused-filename');
const validate = require('./schema-validator');
const { DATADIR, MISCDATADIR } = require('./dirs');

module.exports = (router = new Router()) => {
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
    const validationResult = validate(file);

    let filePath;
    let sendStatus;
    if (validationResult.error) {
      filePath = path.join(MISCDATADIR, safeName);
      sendStatus = () => res.status(400).send(validationResult.error);
    } else {
      let schemaName = validationResult.matches;
      if (schemaName.endsWith('.json')) {
        schemaName = schemaName.slice(0, -5);
      }

      const fileName = `${schemaName}_${safeName}`;
      filePath = path.join(DATADIR, fileName);
      sendStatus = () => res.send('Data saved');
    }
    unusedFilename(filePath)
      .then((unusedPath) => {
        file.mv(unusedPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          return sendStatus();
        });
      });
    return false;
  });
  return router;
};
