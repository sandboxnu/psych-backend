const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const { SCHEMADIR } = require('./dirs');

const ajv = new Ajv();

// Returns the name of the first matching schema for the data,
// null if no matches
const findMatchingSchema = (data) => {
  const schemaFiles = fs.readdirSync(SCHEMADIR);
  for (const schemaFile of schemaFiles) {
    const fullpath = path.join(SCHEMADIR, schemaFile);
    const schema = JSON.parse(fs.readFileSync(fullpath));
    if (ajv.validate(schema, data)) {
      return schemaFile;
    }
  }
  return null;
};

// Returns one of:
//   { error: 'A string explaining the error' }
//   { matches: 'A string with the name of the first matching schema' }
module.exports = (file) => {
  const filecontents = file.data.toString();
  let json;
  try {
    json = JSON.parse(filecontents);
  } catch (e) {
    return { error: 'Could not parse data as JSON' };
  }

  const result = findMatchingSchema(json);
  if (result) {
    return { matches: result };
  }
  return { error: 'No matching schema' };
};
