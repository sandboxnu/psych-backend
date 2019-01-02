const { Router } = require('express');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const { DATADIR } = require('./dirs');


module.exports = (router = new Router()) => {
  router.get('/', (req, res) => {
    res.status(200).set({
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment; filename=data.zip',
    });

    const zip = archiver('zip');
    zip.pipe(res);
    zip.directory(`${DATADIR}/`, false);
    zip.finalize();
  });

  router.post('/', (req, res) => {
    const { files: { file } } = req;
    if (!file) {
      return res.status(400).send('Collected data file was not uploaded!');
    }
    // Sanitize filename to ensure it's a valid path (and avoid certain hacks).
    const safeName = sanitize(file.name);
    // Store the file on the server.
    file.mv(`${DATADIR}/${safeName}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send('Data saved');
    });
    return false;
  });
  return router;
};
