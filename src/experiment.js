const { Router } = require('express');
const path = require('path');
const { FILEDIR } = require('./dirs');
const { verify } = require('./authentication');

module.exports = (router = new Router()) => {
// Get config file
  router.get('/', (req, res) => {
    res.sendFile(path.join(FILEDIR, 'config.txt'), {}, (err) => {
      if (err) {
        res.status(400).send({
          message: 'no config',
        });
      }
    });
  });
  // Post config requires password
  router.post('/', (req, res, next) => {
    verify(req.query.password)
      .then((authenticated) => {
        if (authenticated) {
          console.log('authenticated');
          next();
        } else {
          res.status(401).send('Incorrect password');
        }
      })
      .catch((error) => {
        res.status(500).send();
        console.log(error);
      });
  });
  // Post config file
  router.post('/', (req, res) => {
    const { files: { file } = {} } = req;
    if (!file) {
      return res.status(400).send('Config file was not uploaded!');
    }
    // Save the config file
    file.mv(path.join(FILEDIR, 'config.txt'), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send('Config saved');
    });
    return false;
  });
  return router;
};
