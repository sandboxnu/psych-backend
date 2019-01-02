const fs = require('fs');
require('dotenv').config();

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

module.exports = { FILEDIR, DATADIR };
