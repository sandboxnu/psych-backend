const { Router } = require('express');
const { FILEDIR } = require('./dirs');
const { authMiddleware } = require('./authentication');

const { timeStamp } = require('./serverUtils');

var Config = require('./models/Config.model');

const collection = 'experiment_data'

module.exports = (router = new Router()) => {
  //get all config documents from mongo.
  router.get('/', authMiddleware);
  router.get('/', (req, res) => {
    Config.find({}).then(function(configs) {
      var response = {};
      var count = 1;
      configs.map((record) => { 
        response[count] = JSON.parse(record["configData"]);
        count += 1;
      });
      res.status(200).set({
      'Content-Type': 'application/json',
      });
      res.send(response);
    }).catch(function(error) {
      res.status(500).send(error);
    });
  });
  router.get('/:configID', (req, res) => {
    const configID = req.params.configID
    Config.find({configID: configID }).then(function(configs) {
      res.status(200).set({
      'Content-Type': 'application/json',
      });
      const response = configs[0]['configData']
      res.send(response);
    });
  });
  // Post config requires password
  router.post('/', authMiddleware);
  // Post config json object
  router.post('/', (req, res) => {
    const jsonData = req.body
    if (Object.keys(jsonData).length === 0) {
      return res.status(400).send('Malformed or bad data');
    }
    const time = timeStamp();
    const config = new Config({time: time, configData: JSON.stringify(jsonData)});
    config.save(function (err, fluffy) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send('Data saved');
    });
    return false;
  });
  return router;
};
