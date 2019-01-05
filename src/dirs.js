const fse = require('fs-extra');
require('dotenv').config();

const { FILEDIR } = process.env;
const DATADIR = `${FILEDIR}/data`;

// Throw error if FILEDIR is not defined.
if (typeof FILEDIR === 'undefined') {
  throw new Error('FILEDIR environment variable not defined. Add it to .env');
}

fse.ensureDir(DATADIR);

module.exports = { FILEDIR, DATADIR };
