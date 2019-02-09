const Ajv = require('ajv');
const { Router } = require('express');
const path = require('path');
const unusedFilename = require('unused-filename');
const { SCHEMADIR } = require('./dirs');

const ajv = new Ajv();

module.exports = (router = new Router()) => {
  // Post schema file
  router.post('/', (req, res) => {
    const { files: { file } = {} } = req;
    if (!file) {
      return res.status(400).send('Schema file was not uploaded!');
    }
    if (!file.name) {
      return res.status(400).send('Schema file missing name');
    }
    const filecontents = file.data.toString();
    let schemaJson;
    try {
      schemaJson = JSON.parse(filecontents);
    } catch (e) {
      return res.status(400).send('Schema file is not valid JSON!');
    }
    try {
      ajv.compile(schemaJson);
    } catch (e) {
      return res.status(400).send('File could not be parsed as a valid JSON schema!');
    }

    // Save the schema file
    unusedFilename(path.join(SCHEMADIR, file.name))
      .then((unusedPath) => {
        file.mv(unusedPath, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          const filename = path.basename(unusedPath);
          return res.send(`Schema saved as ${filename}`);
        });
      });
    return false;
  });
  return router;
};
