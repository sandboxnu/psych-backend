const { Router } = require('express');
const { FILEDIR } = require('./dirs');

module.exports = (router = new Router()) => {
// Get config file
  router.get('/', (req, res) => {
    res.sendFile(`${FILEDIR}/config.txt`, {}, (err) => {
      if (err) {
        res.status(400).send({
          message: 'no config',
        });
      }
    });
  });
  // Post config file
  router.post('/', (req, res) => {
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
  return router;
};
