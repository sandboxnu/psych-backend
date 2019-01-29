const fse = require('fs-extra');
const path = require('path');
require('dotenv').config();

const { FILEDIR } = process.env;
const DATADIR = path.join(FILEDIR, 'data');
const SCHEMADIR = path.join(FILEDIR, 'schema');

// Throw error if FILEDIR is not defined.
if (typeof FILEDIR === 'undefined') {
  throw new Error('FILEDIR environment variable not defined. Add it to .env');
}

fse.ensureDir(DATADIR);
fse.ensureDir(SCHEMADIR);

module.exports = { FILEDIR, DATADIR, SCHEMADIR };
