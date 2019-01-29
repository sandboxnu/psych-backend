const Ajv = require('ajv');
const { SCHEMADIR } = require('./dirs');

const ajv = new Ajv();

// Returns the name of the first matching schema for the data
const findMatchingSchema = (data) => {
  return 'TODO';
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
