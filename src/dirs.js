const fse = require('fs-extra');
const path = require('path');
require('dotenv').config();

const { FILEDIR } = process.env;

// Throw error if FILEDIR is not defined.
if (typeof FILEDIR === 'undefined') {
  throw new Error('FILEDIR environment variable not defined. Add it to .env');
}

const DATADIR = path.join(FILEDIR, 'data');
const MISCDATADIR = path.join(FILEDIR, 'unvalidated_data');
const SCHEMADIR = path.join(FILEDIR, 'schema');

fse.ensureDir(DATADIR);
fse.ensureDir(MISCDATADIR);
fse.ensureDir(SCHEMADIR);

module.exports = {
  FILEDIR,
  DATADIR,
  MISCDATADIR,
  SCHEMADIR,
};
