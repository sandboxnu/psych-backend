const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
require('dotenv').config();

const app = express();

app.use(fileUpload());
app.use(cors()); // Allow cross-origin requests since frontend is on different domain than backend.

const PORT = 3001;
const { FILEDIR } = process.env;
const DATADIR = `${FILEDIR}/data`;

// Throw error if FILEDIR is not defined.
if (typeof FILEDIR === 'undefined') {
  console.log('file not defs');
  throw new Error('FILEDIR environment variable not defined. Add it to .env');
}

// Create FILEDIR if it does not exist
if (!fs.existsSync(FILEDIR)) {
  fs.mkdirSync(FILEDIR);
}

// Create data subdirectory if it does not already exist
if (!fs.existsSync(DATADIR)) {
  fs.mkdirSync(DATADIR);
}

// Get config file
app.get('/api/experiment', (req, res) => {
  res.sendFile(`${FILEDIR}/config.txt`, {}, (err) => {
    if (err) {
      res.status(400).send({
        message: 'no config',
      });
    }
  });
});

app.get('/api/data', (req, res) => {
  res.status(200).set({
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename=data.zip',
  });

  const zip = archiver('zip');
  zip.pipe(res);
  zip.directory(`${DATADIR}/`, false);
  zip.finalize();
});

// Post config file
app.post('/api/experiment', (req, res) => {
  const { files: { file } } = req;
  if (!file) {
    return res.status(400).send('Config file was not uploaded!');
  }
  // Save the config file
  file.mv(`${FILEDIR}/config.txt`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send('Config saved');
  });
  return false;
});

app.post('/api/data', (req, res) => {
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

/* eslint no-console: "off" */
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
